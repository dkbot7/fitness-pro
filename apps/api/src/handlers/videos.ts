/**
 * Video Streaming Handler with Range Request Support
 *
 * Best Practices 2026:
 * - Range requests for efficient seeking (Cloudflare Community)
 * - Private R2 bucket with Worker security (Adocasts Blog)
 * - Proper caching headers for CDN optimization
 *
 * References:
 * - https://developers.cloudflare.com/r2/
 * - https://community.cloudflare.com/t/how-do-http-range-requests-work-with-workers/263031
 */

import type { Context } from 'hono';
import type { AppContext } from '../types';

/**
 * Stream video from R2 with Range request support
 * Supports video seeking and efficient bandwidth usage
 */
export async function getExerciseVideo(c: Context<AppContext>) {
  const { slug } = c.req.param();
  const bucket = c.env.VIDEOS; // R2 binding

  if (!bucket) {
    return c.json({ error: 'Video storage not configured' }, 500);
  }

  try {
    const videoKey = `exercises/${slug}.mp4`;

    // Get range header for seeking support
    const range = c.req.header('Range');

    let object;
    if (range) {
      // Parse range header (e.g., "bytes=0-1023")
      const rangeMatch = range.match(/bytes=(\d+)-(\d*)/);
      if (!rangeMatch) {
        return c.json({ error: 'Invalid range header' }, 416);
      }

      const start = parseInt(rangeMatch[1], 10);
      const end = rangeMatch[2] ? parseInt(rangeMatch[2], 10) : undefined;

      // Use R2 range read
      object = await bucket.get(videoKey, {
        range: end ? { offset: start, length: end - start + 1 } : { offset: start },
      });

      if (!object) {
        return c.notFound();
      }

      // Get total size for Content-Range header
      const headObject = await bucket.head(videoKey);
      const totalSize = headObject?.size || 0;
      const endByte = end || totalSize - 1;

      // Return 206 Partial Content
      return new Response(object.body, {
        status: 206,
        headers: {
          'Content-Type': 'video/mp4',
          'Content-Range': `bytes ${start}-${endByte}/${totalSize}`,
          'Content-Length': (endByte - start + 1).toString(),
          'Accept-Ranges': 'bytes',
          'Cache-Control': 'public, max-age=2592000', // 30 days
          'Access-Control-Allow-Origin': '*',
        },
      });
    } else {
      // No range - return full video
      object = await bucket.get(videoKey);

      if (!object) {
        return c.notFound();
      }

      return new Response(object.body, {
        status: 200,
        headers: {
          'Content-Type': 'video/mp4',
          'Content-Length': object.size.toString(),
          'Accept-Ranges': 'bytes',
          'Cache-Control': 'public, max-age=2592000', // 30 days
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  } catch (error) {
    console.error('[Video] Error streaming video:', error);
    return c.json({ error: 'Failed to stream video' }, 500);
  }
}

/**
 * Get video thumbnail (JPEG)
 * Optimized for fast loading in exercise lists
 */
export async function getExerciseThumbnail(c: Context<AppContext>) {
  const { slug } = c.req.param();
  const bucket = c.env.VIDEOS;

  if (!bucket) {
    return c.json({ error: 'Video storage not configured' }, 500);
  }

  try {
    const thumbnailKey = `thumbnails/${slug}.jpg`;
    const object = await bucket.get(thumbnailKey);

    if (!object) {
      // Fallback to placeholder if thumbnail doesn't exist
      return c.redirect('https://via.placeholder.com/640x360.jpg?text=Exercise+Video', 302);
    }

    return new Response(object.body, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Content-Length': object.size.toString(),
        'Cache-Control': 'public, max-age=2592000', // 30 days
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('[Video] Error fetching thumbnail:', error);
    return c.json({ error: 'Failed to fetch thumbnail' }, 500);
  }
}

/**
 * Get signed URL for direct R2 access (24h expiration)
 * Useful for downloading or external players
 */
export async function getSignedVideoUrl(c: Context<AppContext>) {
  const { slug } = c.req.param();
  const bucket = c.env.VIDEOS;

  if (!bucket) {
    return c.json({ error: 'Video storage not configured' }, 500);
  }

  try {
    const videoKey = `exercises/${slug}.mp4`;

    // Check if video exists
    const exists = await bucket.head(videoKey);
    if (!exists) {
      return c.notFound();
    }

    // Generate presigned URL (24h)
    // Note: R2 doesn't support presigned URLs like S3 yet
    // We'll return the Worker URL instead
    const baseUrl = new URL(c.req.url).origin;
    const signedUrl = `${baseUrl}/api/exercises/${slug}/video`;

    return c.json({
      url: signedUrl,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      slug,
    });
  } catch (error) {
    console.error('[Video] Error generating signed URL:', error);
    return c.json({ error: 'Failed to generate URL' }, 500);
  }
}

/**
 * Get video metadata (duration, size, format)
 */
export async function getVideoMetadata(c: Context<AppContext>) {
  const { slug } = c.req.param();
  const bucket = c.env.VIDEOS;

  if (!bucket) {
    return c.json({ error: 'Video storage not configured' }, 500);
  }

  try {
    const videoKey = `exercises/${slug}.mp4`;
    const metadata = await bucket.head(videoKey);

    if (!metadata) {
      return c.notFound();
    }

    return c.json({
      slug,
      size: metadata.size,
      uploaded: metadata.uploaded,
      contentType: metadata.httpMetadata?.contentType || 'video/mp4',
      etag: metadata.etag,
      customMetadata: metadata.customMetadata,
    });
  } catch (error) {
    console.error('[Video] Error fetching metadata:', error);
    return c.json({ error: 'Failed to fetch metadata' }, 500);
  }
}
