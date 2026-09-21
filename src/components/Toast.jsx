"use client";

import { useEffect } from "react";
import "./Toast.css";

export default function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!message) {
    return null;
  }

  return (
    <div className="toast-message">
      {message}
    </div>
  );
}