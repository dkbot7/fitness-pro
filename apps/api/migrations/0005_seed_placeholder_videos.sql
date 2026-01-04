-- Add placeholder video URLs to all exercises
-- Using generic workout video placeholders until custom videos are created

-- Update all exercises with generic placeholder videos
UPDATE exercises SET
  video_url = 'https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0fd273d2c6d9a064f3ae35579b2bbdf&profile_id=164&oauth2_token_id=57447761',
  thumbnail_url = 'https://images.pexels.com/videos/4367572/free-video-4367572.jpg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200'
WHERE video_url IS NULL OR video_url = '';

-- Update push-up variations with push-up specific video
UPDATE exercises SET
  video_url = 'https://player.vimeo.com/external/373965309.sd.mp4?s=a293b8e2b8de1e8d6f1f3b0c6a7e0e7e8e0e8e8e&profile_id=164',
  thumbnail_url = 'https://images.pexels.com/videos/3822182/free-video-3822182.jpg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200'
WHERE slug IN ('flexao');

-- Update squat variations with squat specific video
UPDATE exercises SET
  video_url = 'https://player.vimeo.com/external/395198663.sd.mp4?s=c1e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8&profile_id=164',
  thumbnail_url = 'https://images.pexels.com/videos/4662344/free-video-4662344.jpg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200'
WHERE slug IN ('agachamento', 'agachamento-barra', 'leg-press', 'agachamento-goblet', 'afundo', 'afundo-halteres');
