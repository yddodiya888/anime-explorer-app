"use client";

import "./SkeletonCard.css";

export default function SkeletonCard() {
  return (
    <article className="skeleton-card">
      <div className="skeleton-image"></div>

      <div className="skeleton-info">
        <div className="skeleton-title"></div>

        <div className="skeleton-meta">
          <div className="skeleton-small"></div>
          <div className="skeleton-small"></div>
        </div>

        <div className="skeleton-button"></div>
      </div>
    </article>
  );
}