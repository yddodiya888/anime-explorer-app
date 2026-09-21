"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({ children }) {
  const [checking, setChecking] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn");

    if (loggedIn !== "true") {
      router.push("/login");
      return;
    }

    setChecking(false);
  }, [router]);

  if (checking) {
    return null;
  }

  return children;
}