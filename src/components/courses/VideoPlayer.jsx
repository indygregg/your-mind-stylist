import React, { useRef, useEffect } from "react";

export default function VideoPlayer({ src, embedUrl, onProgressUpdate, lastPosition = 0 }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Set initial position
    if (lastPosition > 0) {
      video.currentTime = lastPosition;
    }

    // Track progress every 5 seconds
    const handleTimeUpdate = () => {
      onProgressUpdate?.(video.currentTime);
    };

    const interval = setInterval(() => {
      if (!video.paused) {
        handleTimeUpdate();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [lastPosition, onProgressUpdate]);

  if (embedUrl) {
    return (
      <div className="aspect-video">
        <iframe
          src={embedUrl}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  if (src) {
    return (
      <video
        ref={videoRef}
        controls
        className="w-full"
        src={src}
      >
        Your browser does not support the video tag.
      </video>
    );
  }

  return (
    <div className="aspect-video flex items-center justify-center bg-black text-white">
      Video content coming soon
    </div>
  );
}