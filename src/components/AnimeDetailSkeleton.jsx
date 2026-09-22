"use client";

import "./AnimeDetailSkeleton.css";

export default function AnimeDetailSkeleton() {
  return (
    <main className="detail-skeleton-page">
      <div className="detail-skeleton-image"></div>

      <div className="detail-skeleton-content">
        <div className="detail-skeleton-title"></div>

        <div className="detail-skeleton-meta">
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div className="detail-skeleton-description">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div className="detail-skeleton-button"></div>
      </div>
    </main>
  );
}