"use client";

import {
  createContext,
  useContext,
  useRef,
  useState,
} from "react";

const LoadingContext = createContext();

const MIN_LOADING_TIME = 2500;

export function useLoading() {
  return useContext(LoadingContext);
}

export default function LoadingProvider({ children }) {
  const [loading, setLoading] = useState(false);

  const startTimeRef = useRef(null);
  const timerRef = useRef(null);

  const startLoading = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    startTimeRef.current = Date.now();

    setLoading(true);
  };

  const stopLoading = () => {
    if (!startTimeRef.current) {
      setLoading(false);
      return;
    }

    const elapsed =
      Date.now() - startTimeRef.current;

    const remaining =
      MIN_LOADING_TIME - elapsed;

    if (remaining <= 0) {
      setLoading(false);
      startTimeRef.current = null;
      return;
    }

    timerRef.current = setTimeout(() => {
      setLoading(false);
      startTimeRef.current = null;
      timerRef.current = null;
    }, remaining);
  };

  return (
    <LoadingContext.Provider
      value={{
        loading,
        startLoading,
        stopLoading,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
}