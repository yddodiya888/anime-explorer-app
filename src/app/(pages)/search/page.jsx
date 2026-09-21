"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Toast from "@/components/Toast";
import { useRouter } from "next/navigation";

import api from "@/helper/api.interceptor";
import "./Search.css";
import { useLoading } from "@/components/LoadingProvider";

function Search() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [anime, setAnime] = useState([]);
  const [searched, setSearched] = useState(false);
  const [toast, setToast] = useState("");
  const [favourites, setFavourites] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);

  const { loading, startLoading, stopLoading } = useLoading();
  const sliderRef = useRef(null);

  // CHECK LOGIN STATUS
  useEffect(() => {
    const loginStatus = localStorage.getItem("loggedIn");

    setLoggedIn(loginStatus === "true");
  }, []);

  // LOAD FAVOURITES
  useEffect(() => {
    const savedFavourites =
      JSON.parse(localStorage.getItem("favourites")) || [];

    setFavourites(savedFavourites);
  }, []);

  // TOGGLE FAVOURITE
  const toggleFavourite = (animeItem) => {
    if (!loggedIn) {
      router.push("/login");
      return;
    }

    const alreadyFavourite = favourites.some(
      (favourite) => favourite.id === animeItem.id,
    );

    let updatedFavourites;

    // REMOVE FAVOURITE
    if (alreadyFavourite) {
      updatedFavourites = favourites.filter(
        (favourite) => favourite.id !== animeItem.id,
      );

      setToast("Removed from favourites");
    }

    // ADD FAVOURITE
    else {
      const favouriteAnime = {
        id: animeItem.id,
        title: animeItem.title,
        image: animeItem.image,
        score: animeItem.score,
        type: animeItem.type,
      };

      updatedFavourites = [...favourites, favouriteAnime];

      setToast("Added to favourites");
    }

    setFavourites(updatedFavourites);

    localStorage.setItem("favourites", JSON.stringify(updatedFavourites));
  };

  // LOAD DEFAULT ANIME FROM KITSU
  useEffect(() => {
    const getAnime = async () => {
      startLoading();

      try {
        const data = await api.getKitsuAnimePage(1);

        setAnime(data.data || []);
      } catch (error) {
        console.error("DEFAULT KITSU ANIME ERROR:", error);
      } finally {
        stopLoading();
      }
    };

    getAnime();
  }, []);

  // SEARCH ANIME
  const handleSearch = async (e) => {
    e.preventDefault();

    if (!query.trim()) {
      return;
    }

    startLoading();

    try {
      const data = await api.searchAnime(query);

      setAnime(data.data || []);
      setSearched(true);
    } catch (error) {
      console.error("SEARCH ERROR:", error);

      setAnime([]);
      setSearched(true);
    } finally {
      stopLoading();
    }
  };

  // SLIDE LEFT
  const slideLeft = () => {
    if (!sliderRef.current) {
      return;
    }

    sliderRef.current.scrollBy({
      left: -350,
      behavior: "smooth",
    });
  };

  // SLIDE RIGHT
  const slideRight = () => {
    if (!sliderRef.current) {
      return;
    }

    sliderRef.current.scrollBy({
      left: 350,
      behavior: "smooth",
    });
  };

  return (
    <main className="search-page">
      {/* SEARCH */}

      <section className="search-section">
        <h1>Search Anime</h1>

        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search Your Favorite Anime..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </form>
      </section>

      {/* ANIME */}

      <section className="explore-section">
        <div className="explore-heading">
          <h2>✨ {searched ? "Search Results" : "Explore Anime"}</h2>

          <p>
            {searched
              ? `Results for "${query}"`
              : "Find your next favorite anime."}
          </p>
        </div>

        <div className="slider-wrapper">
          <button
            className="slider-button left"
            onClick={slideLeft}
            type="button"
          >
            ‹
          </button>

          <div className="anime-slider" ref={sliderRef}>
            {anime.map((item) => {
              const isFavourite = favourites.some(
                (favourite) => favourite.id === item.id,
              );

              return (
                <article className="search-card" key={item.id}>
                  <div className="search-image">
                    <img src={item.image} alt={item.title} />
                  </div>

                  <div className="search-info">
                    <h3>{item.title}</h3>

                    <div className="search-meta">
                      <span>⭐ {item.score || "N/A"}</span>

                      <span>{item.type || "Anime"}</span>
                    </div>

                    <div className="fav_cont">
                      <Link
                        href={`/search/anime/${item.id}`}
                        className="details-link"
                      >
                        View Details
                      </Link>

                      <button
                        type="button"
                        className="favourite-button"
                        onClick={() => toggleFavourite(item)}
                        aria-label={
                          isFavourite
                            ? "Remove from favourites"
                            : "Add to favourites"
                        }
                      >
                        {isFavourite ? "❤️" : "🤍"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <button
            className="slider-button right"
            onClick={slideRight}
            type="button"
          >
            ›
          </button>
        </div>

        {/* NO RESULTS */}

        {!loading && searched && anime.length === 0 && (
          <p className="no-results">No anime found.</p>
        )}
      </section>

      {/* TOAST */}

      <Toast message={toast} onClose={() => setToast("")} />
    </main>
  );
}

export default Search;
