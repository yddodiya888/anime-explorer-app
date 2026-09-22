"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import "./Navbar.css";

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");

    setLoggedIn(false);
    setMenuOpen(false);

    router.push("/login");
  };

  const handleProtectedPage = (path) => {
    setMenuOpen(false);

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

        <Link href="/" className="navbar-logo" onClick={closeMenu}>
          🎌 Anime Explorer
        </Link>

        {/* DESKTOP NAVIGATION */}

        <div className="navbar-links">
          <Link href="/">Home</Link>

          <button type="button" onClick={() => handleProtectedPage("/search")}>
            Search
          </button>

          <button type="button" onClick={() => handleProtectedPage("/anime")}>
            Anime
          </button>

          <button
            className="fav_button"
            type="button"
            onClick={() => handleProtectedPage("/favourites")}
          >
            Favourites
          </button>

          <Link href="/contact">Contact Us</Link>

          {loggedIn ? (
            <button className="log_out" type="button" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <Link href="/login">Login</Link>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}

        <button
          type="button"
          className={`mobile-menu-button ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* MOBILE SIDE MENU */}

      <div
        className={`mobile-menu-overlay ${menuOpen ? "show" : ""}`}
        onClick={closeMenu}
      ></div>

      <div className={`mobile-side-menu ${menuOpen ? "open" : ""}`}>
        <div className="mobile-menu-header">
          <h2>Menu</h2>

          <button
            type="button"
            className="mobile-close-button"
            onClick={closeMenu}
          >
            ×
          </button>
        </div>

        <div className="mobile-menu-links">
          <Link href="/" onClick={closeMenu}>
            Home
          </Link>

          <button type="button" onClick={() => handleProtectedPage("/search")}>
            Search
          </button>

          <button type="button" onClick={() => handleProtectedPage("/anime")}>
            Anime
          </button>

          <button
            type="button"
            onClick={() => handleProtectedPage("/favourites")}
          >
            Favourite
          </button>

          <Link href="/contact" onClick={closeMenu}>
            Contact Us
          </Link>

          {loggedIn ? (
            <button type="button" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <Link href="/login" onClick={closeMenu}>
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
