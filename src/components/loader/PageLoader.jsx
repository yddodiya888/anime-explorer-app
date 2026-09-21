"use client";

import { useLoading } from "../LoadingProvider";

import "./PageLoader.css";

function PageLoader() {
  const { loading } = useLoading();

  if (!loading) {
    return null;
  }

  return (
    <div className="page-loader">
      <div className="loader-content">
        <div className="loader-animation">
          <div className="loader-ring"></div>

          <div className="loader-orbit orbit-one"></div>

          <div className="loader-orbit orbit-two"></div>

          <div className="loader-center">
            🎌
          </div>
        </div>

        <h2>ANIME EXPLORER</h2>

        <p>Loading your adventure...</p>

        <div className="loader-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
}

export default PageLoader;