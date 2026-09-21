"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import "./Navbar.css";

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const checkLogin = () => {
      const loginStatus = localStorage.getItem("loggedIn");

      setLoggedIn(loginStatus === "true");
    };

    checkLogin();

    window.addEventListener("loginStatusChanged", checkLogin);

    return () => {
      window.removeEventListener("loginStatusChanged", checkLogin);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");

    setLoggedIn(false);

    router.push("/login");
  };

  const handleProtectedPage = (path) => {
    if (!loggedIn) {
      router.push("/login");
      return;
    }

    router.push(path);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* LOGO */}

        <Link href="/" className="navbar-logo">
          🎌 Anime Explorer
        </Link>

        {/* NAVIGATION */}

        <div className="navbar-links">

          <Link href="/">Home</Link>

          <button
            type="button"
            onClick={() => handleProtectedPage("/search")}
          >
            Search
          </button>

          <button
            type="button"
            onClick={() => handleProtectedPage("/anime")}
          >
            Anime
          </button>

          <button
          className="fav_button"
            type="button"
            onClick={() => handleProtectedPage("/favourites")}
          >
            ❤️
          </button>

          <Link href="/contact">Contact Us</Link>

          {loggedIn ? (
            <button
              className="log_out"
              type="button"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <Link href="/login">Login</Link>
          )}

        </div>
      </div>
    </nav>
  );
}