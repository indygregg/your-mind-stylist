import React from "react";
import { BookCover } from "book-cover-3d";

export default function BookCover3D({ imageUrl, title, size = "md" }) {
  const sizes = {
    sm: { width: 160, height: 220 },
    md: { width: 240, height: 320 },
    lg: { width: 300, height: 400 },
  };

  const { width, height } = sizes[size] || sizes.md;

  return (
    <div className="flex items-center justify-center">
      <BookCover rotate={30} rotateHover={15} transitionDuration={1}>
        <img
          src={imageUrl}
          alt={title || "Book cover"}
          style={{ width, height, objectFit: "cover", display: "block" }}
        />
      </BookCover>
    </div>
  );
}