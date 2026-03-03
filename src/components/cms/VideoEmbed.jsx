import React, { useState } from "react";
import { useCmsText } from "./useCmsText";
import { useEditMode } from "./EditModeProvider";
import { Pencil } from "lucide-react";
import InlineEditor from "./InlineEditor";

export default function VideoEmbed({ contentKey, fallback, page, blockTitle }) {
  const { content, block } = useCmsText(contentKey, fallback);
  const { isEditMode, isManager } = useEditMode();
  const [isEditing, setIsEditing] = useState(false);
  
  const getVideoEmbedUrl = (url) => {
    // YouTube
    const ytId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1];
    if (ytId) return `https://www.youtube.com/embed/${ytId}`;
    
    // Vimeo - handle both full URLs and embed URLs
    const vimeoId = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/)?.[1];
    if (vimeoId) return `https://player.vimeo.com/video/${vimeoId}`;
    
    // If it's already an embed URL, return as is
    if (url.includes('player.vimeo.com') || url.includes('youtube.com/embed')) {
      return url;
    }
    
    return null;
  };

  // Strip HTML tags in case CMS wraps the URL in <p> or <a> tags
  const rawContent = content ? content.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").trim() : "";
  const embedUrl = getVideoEmbedUrl(rawContent);

  if (!embedUrl) {
    if (isManager && isEditMode) {
      return (
        <>
          <div
            className="w-full h-full flex items-center justify-center cursor-pointer hover:bg-[#D8B46B]/10 transition-colors group relative"
            onClick={() => setIsEditing(true)}
          >
            <div className="text-center">
              <Pencil size={32} className="text-[#D8B46B] mb-2 mx-auto" />
              <p className="text-[#F9F5EF] text-sm">Click to add video URL</p>
              <p className="text-[#F9F5EF]/60 text-xs mt-1">Paste Vimeo or YouTube URL</p>
            </div>
          </div>
          {isEditing && (
            <InlineEditor
              contentKey={contentKey}
              blockTitle={blockTitle}
              page={page}
              initialContent={content}
              contentType="short_text"
              block={block}
              onClose={() => setIsEditing(false)}
            />
          )}
        </>
      );
    }
    return <div className="text-center text-[#2B2725]/60">Invalid video URL</div>;
  }

  return (
    <>
      <div className={`relative w-full h-full ${isManager && isEditMode ? 'group cursor-pointer' : ''}`}>
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
        {isManager && isEditMode && (
          <div 
            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10"
            onClick={() => setIsEditing(true)}
          >
            <div className="bg-[#D8B46B] text-white px-3 py-2 text-xs flex items-center gap-2 rounded shadow-lg">
              <Pencil size={14} />
              <span>Edit Video</span>
            </div>
          </div>
        )}
      </div>
      {isEditing && (
        <InlineEditor
          contentKey={contentKey}
          blockTitle={blockTitle}
          page={page}
          initialContent={content}
          contentType="short_text"
          block={block}
          onClose={() => setIsEditing(false)}
        />
      )}
    </>
  );
}