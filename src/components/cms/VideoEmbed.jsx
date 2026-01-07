import React from "react";
import { useCmsText } from "./useCmsText";

export default function VideoEmbed({ contentKey, fallback, page, blockTitle }) {
  const { content } = useCmsText(contentKey, fallback);
  
  const getYouTubeEmbedUrl = (url) => {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  const embedUrl = getYouTubeEmbedUrl(content);

  if (!embedUrl) {
    return <div className="text-center text-[#2B2725]/60">Invalid video URL</div>;
  }

  return (
    <iframe
      width="100%"
      height="100%"
      src={embedUrl}
      title="Video"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      className="w-full h-full"
    />
  );
}