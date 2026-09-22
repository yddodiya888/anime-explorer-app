"use client";

import { useEffect } from "react";
import { useLoading } from "../LoadingProvider";

import "./PageLoader.css";

function PageLoader() {
  const { loading } = useLoading();

  useEffect(() => {
    if (loading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [loading]);

  if (!loading) {
    return null;
  }

  return (
    <div className="page-loader">
      <div className="loader-content">

        <h1>ANIME EXPLORER</h1>

        <div className="loader-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>

        <p>Exploring your anime world...</p>

      </div>
    </div>
  );
}

export default PageLoader;