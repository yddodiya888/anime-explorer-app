"use client";

import { useState } from "react";

export default function AnimeImage({ src, alt }) {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  return (
    <div className="anime-image-wrapper">
      {imageLoading && !imageError && (
        <div className="anime-image-skeleton"></div>
      )}

      <img
        src={imageError || !src ? "/images/no-image.png" : src}
        alt={alt || "Anime"}
        onLoad={() => setImageLoading(false)}
        onError={() => {
          setImageError(true);
          setImageLoading(false);
        }}
        className={imageLoading ? "image-hidden" : ""}
      />
    </div>
  );
}