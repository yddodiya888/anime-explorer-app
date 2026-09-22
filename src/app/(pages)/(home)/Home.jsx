"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Toast from "@/components/Toast";
import "./Home.css";
import api from "@/helper/api.interceptor";
import { useLoading } from "@/components/LoadingProvider";

function Home() {
  const [anime, setAnime] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [toast, setToast] = useState("");
  const { startLoading, stopLoading } = useLoading();
  const router = useRouter();

  // Check login and get favourites
  useEffect(() => {
    const loginStatus = localStorage.getItem("loggedIn");

    setLoggedIn(loginStatus === "true");

    const savedFavourites =
      JSON.parse(localStorage.getItem("favourites")) || [];

    setFavourites(savedFavourites);
  }, []);

  // Add / Remove Favourite
  const toggleFavourite = (anime) => {
    if (!loggedIn) {
      router.push("/login");
      return;
    }

    const alreadyFavourite = favourites.some(
      (favourite) => favourite.id === anime.id,
    );

    let updatedFavourites;

    if (alreadyFavourite) {
      updatedFavourites = favourites.filter(
        (favourite) => favourite.id !== anime.id,
      );

      setToast("Removed from favourites");
    } else {
      const favouriteAnime = {
        id: anime.id,
        title: anime.title,
        image: anime.image,
        score: anime.score,
        type: anime.type,
      };

      updatedFavourites = [...favourites, favouriteAnime];

      setToast("Added to favourites");
    }

    setFavourites(updatedFavourites);

    localStorage.setItem("favourites", JSON.stringify(updatedFavourites));
  };

  // Get Home Anime
  useEffect(() => {
    const getAnime = async () => {
      startLoading();

      try {
        const data = await api.getKitsuHomeAnime();

        console.log("KITSU HOME ANIME:", data);

        setAnime(data.data || []);
      } catch (error) {
        console.error("HOME ANIME ERROR:", error);
      } finally {
        stopLoading();
      }
    };

    getAnime();
  }, []);

  return (
    <main className="home">
      {/* Hero */}

      <section className="hero">
        <div className="hero-content">
          <p className="welcome">🎌 Welcome to Anime Explorer</p>

          <h1>
            Discover Your
            <br />
            <p>Next Favorite</p>
            <p>Anime</p>
          </h1>

          <p className="hero-text">
            Explore popular anime, discover new stories, and find your next
            favorite adventure.
          </p>

          <div className="hero-buttons">
            <Link href="/anime" className="primary-btn">
              Explore Anime
            </Link>

            <Link href="/search" className="secondary-btn">
              Search Anime
            </Link>
          </div>
        </div>

        <div className="hero-art">
          <div className="art-circle">🎌</div>
        </div>
      </section>

      {/* Top Anime */}

      <section className="anime-section" id="top-anime">
        <div className="section-heading">
          <div>
            <p className="section-label">POPULAR COLLECTION</p>

            <h2>Top Anime</h2>
          </div>

          <Link href="/anime" className="view-all">
            View All →
          </Link>
        </div>

        <div className="anime-grid">
          {anime.slice(0, 8).map((item) => {
            const isFavourite = favourites.some(
              (favourite) => favourite.id === item.id,
            );

            return (
              <article className="anime-card" key={item.id}>
                <div className="anime-image">
                  <img src={item.image} alt={item.title} />
                </div>

                <div className="anime-info">
                  <h3>{item.title}</h3>

                  <div className="anime-meta">
                    <span>⭐ {item.score || "N/A"}</span>

                    <span>{item.type || "Anime"}</span>
                  </div>

                  <div className="home-card-buttons">
                    <Link href={`/anime/${item.id}`} className="details-link">
                      View Details
                    </Link>

                    <button
                      type="button"
                      className="favourite-button"
                      onClick={() => toggleFavourite(item)}
                    >
                      {isFavourite ? "❤️" : "🤍"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
      <Toast message={toast} onClose={() => setToast("")} />
    </main>
  );
}

export default Home;
