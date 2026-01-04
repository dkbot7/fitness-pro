#!/bin/bash

###############################################################################
# Video Processing Script for Fitness Pro
#
# This script optimizes exercise videos for web delivery:
# - Converts to 720p MP4 (H.264 codec)
# - Generates thumbnails (640x360 JPG)
# - Optimizes for streaming with fast start
#
# Prerequisites:
#   - ffmpeg installed (https://ffmpeg.org/download.html)
#     macOS: brew install ffmpeg
#     Ubuntu: sudo apt install ffmpeg
#     Windows: Download from ffmpeg.org
#
# Usage:
#   ./scripts/process-videos.sh input.mp4 flexao
#
# Output:
#   - videos/exercises/flexao.mp4 (optimized video)
#   - videos/exercises/flexao-thumb.jpg (thumbnail)
###############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if ffmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo -e "${RED}❌ ffmpeg not found${NC}"
    echo "Please install ffmpeg first:"
    echo "  macOS:   brew install ffmpeg"
    echo "  Ubuntu:  sudo apt install ffmpeg"
    echo "  Windows: Download from https://ffmpeg.org/download.html"
    exit 1
fi

# Check arguments
if [ "$#" -ne 2 ]; then
    echo -e "${RED}Usage: $0 <input-video> <exercise-slug>${NC}"
    echo "Example: $0 input.mp4 flexao"
    exit 1
fi

INPUT="$1"
SLUG="$2"
OUTPUT_DIR="videos/exercises"
OUTPUT_VIDEO="${OUTPUT_DIR}/${SLUG}.mp4"
OUTPUT_THUMB="${OUTPUT_DIR}/${SLUG}-thumb.jpg"

# Validate input file exists
if [ ! -f "$INPUT" ]; then
    echo -e "${RED}❌ Input file not found: $INPUT${NC}"
    exit 1
fi

# Create output directory
mkdir -p "$OUTPUT_DIR"

echo -e "${GREEN}🎥 Processing video for exercise: ${SLUG}${NC}\n"

# Get video duration
DURATION=$(ffprobe -v error -show_entries format=duration \
    -of default=noprint_wrappers=1:nokey=1 "$INPUT")
echo "📊 Input duration: ${DURATION}s"

# Get video resolution
RESOLUTION=$(ffprobe -v error -select_streams v:0 \
    -show_entries stream=width,height \
    -of csv=s=x:p=0 "$INPUT")
echo "📐 Input resolution: ${RESOLUTION}"

echo ""
echo -e "${YELLOW}🔄 Step 1: Optimizing video (720p, H.264)...${NC}"

# Convert to optimized 720p MP4
# -vf scale=1280:720 → Resize to 720p
# -c:v libx264 → H.264 codec
# -preset slow → Better compression (slower encoding)
# -crf 23 → Quality level (18-28, lower = better)
# -c:a aac -b:a 128k → Audio codec and bitrate
# -movflags +faststart → Enable streaming (move metadata to start)
# -pix_fmt yuv420p → Compatibility with all players
ffmpeg -i "$INPUT" \
    -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2" \
    -c:v libx264 \
    -preset slow \
    -crf 23 \
    -c:a aac \
    -b:a 128k \
    -movflags +faststart \
    -pix_fmt yuv420p \
    -y \
    "$OUTPUT_VIDEO" 2>&1 | grep -v "frame=" || true

echo -e "${GREEN}✓ Video optimized${NC}"

# Get output file size
VIDEO_SIZE=$(du -h "$OUTPUT_VIDEO" | cut -f1)
echo "📦 Output size: ${VIDEO_SIZE}"

echo ""
echo -e "${YELLOW}🔄 Step 2: Generating thumbnail...${NC}"

# Generate thumbnail from middle of video
# -ss seeks to timestamp (duration/2 for middle frame)
# -vframes 1 → Extract single frame
# -vf scale → Resize to 640x360
# -q:v 2 → JPEG quality (1-31, lower = better)
THUMB_TIME=$(echo "$DURATION / 2" | bc -l)
ffmpeg -i "$OUTPUT_VIDEO" \
    -ss "$THUMB_TIME" \
    -vframes 1 \
    -vf "scale=640:360:force_original_aspect_ratio=decrease,pad=640:360:(ow-iw)/2:(oh-ih)/2" \
    -q:v 2 \
    -y \
    "$OUTPUT_THUMB" 2>&1 | grep -v "frame=" || true

echo -e "${GREEN}✓ Thumbnail generated${NC}"

# Get thumbnail size
THUMB_SIZE=$(du -h "$OUTPUT_THUMB" | cut -f1)
echo "📦 Thumbnail size: ${THUMB_SIZE}"

echo ""
echo -e "${GREEN}✅ Processing complete!${NC}"
echo ""
echo "📁 Output files:"
echo "   Video: ${OUTPUT_VIDEO} (${VIDEO_SIZE})"
echo "   Thumbnail: ${OUTPUT_THUMB} (${THUMB_SIZE})"
echo ""
echo "📋 Next steps:"
echo "   1. Review the output video to ensure quality"
echo "   2. Upload to Cloudflare R2:"
echo "      rclone copy '${OUTPUT_VIDEO}' r2:fitness-pro-videos/exercises/"
echo "      rclone copy '${OUTPUT_THUMB}' r2:fitness-pro-videos/exercises/"
echo "   3. Update database:"
echo "      pnpm tsx scripts/update-video-urls.ts"
echo ""
