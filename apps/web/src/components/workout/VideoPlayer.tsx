'use client';

import { useEffect, useRef, useState } from 'react';

interface VideoPlayerProps {
  videoUrl?: string | null;
  thumbnailUrl?: string | null;
  exerciseName: string;
}

export function VideoPlayer({ videoUrl, thumbnailUrl, exerciseName }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!videoRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.25, rootMargin: '50px' }
    );

    observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);

  // Fallback to placeholder if no video
  if (!videoUrl || hasError) {
    return (
      <div className="overflow-hidden rounded-lg bg-gray-100">
        <div className="flex aspect-video items-center justify-center text-gray-400">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="mt-2 text-sm">
              {hasError ? 'Erro ao carregar vídeo' : 'Vídeo em breve'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-video overflow-hidden rounded-lg bg-gray-900">
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        poster={thumbnailUrl || undefined}
        preload={isInView ? 'metadata' : 'none'}
        loop
        muted
        playsInline
        controls
        onError={() => setHasError(true)}
        aria-label={`Vídeo demonstrativo: ${exerciseName}`}
      >
        <source src={videoUrl} type="video/mp4" />
        <p className="p-4 text-white">
          Seu navegador não suporta reprodução de vídeos HTML5.
        </p>
      </video>
    </div>
  );
}
