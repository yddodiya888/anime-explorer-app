"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Toast from "@/components/Toast";
import { useRouter } from "next/navigation";
import SkeletonCard from "@/components/SkeletonCard";
import api from "@/helper/api.interceptor";
import "./Search.css";
import { useLoading } from "@/components/LoadingProvider";
import AnimeImage from "@/components/AnimeImage";

function Search() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [anime, setAnime] = useState([]);
  const [searched, setSearched] = useState(false);
  const [toast, setToast] = useState("");
  const [favourites, setFavourites] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);

  // SEARCH LOADING
  const [searchLoading, setSearchLoading] = useState(false);

  // SEARCH PAGINATION
  const [searchPage, setSearchPage] = useState(1);
  const [hasMoreResults, setHasMoreResults] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchError, setSearchError] = useState("");

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

    setSearchLoading(true);
    setSearchError("");
    setSearchPage(1);

    try {
      const data = await api.searchAnime(query, 1);

      setAnime(data.data || []);
      setSearched(true);

      setHasMoreResults(Boolean(data.links?.next));
    } catch (error) {
      console.error("SEARCH ERROR:", error);

      setAnime([]);
      setSearched(true);
      setHasMoreResults(false);

      setSearchError("Something went wrong. Please try again.");
    } finally {
      setSearchLoading(false);
    }
  };
  // LOAD MORE SEARCH RESULTS
  const handleLoadMore = async () => {
    if (loadingMore || !hasMoreResults) {
      return;
    }

    const nextPage = searchPage + 1;

    setLoadingMore(true);

    try {
      const data = await api.searchAnime(query, nextPage);

      // ADD NEW RESULTS TO EXISTING RESULTS
      setAnime((currentAnime) => [...currentAnime, ...(data.data || [])]);

      setSearchPage(nextPage);

      // CHECK IF ANOTHER PAGE EXISTS
      setHasMoreResults(Boolean(data.links?.next));
    } catch (error) {
      console.error("LOAD MORE ERROR:", error);
    } finally {
      setLoadingMore(false);
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

          <button type="submit" disabled={searchLoading}>
            {searchLoading ? "Searching..." : "Search"}
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

        {/* SEARCH LOADER */}

        {searchLoading ? (
          <div className="search-results-grid skeleton-grid">
            {Array.from({ length: 8 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : searched ? (
          <>
            {/* SEARCH RESULTS */}

            <div className="search-results-grid">
              {anime.map((item) => {
                const isFavourite = favourites.some(
                  (favourite) => favourite.id === item.id,
                );

                return (
                  <article className="search-card" key={item.id}>
                    <div className="search-image">
                      <AnimeImage src={item.image} alt={item.title} />
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

            {/* LOAD MORE */}

            {hasMoreResults && anime.length > 0 && (
              <div className="load-more-container">
                <button
                  type="button"
                  className="load-more-button"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </>
        ) : (
          /* EXPLORE CAROUSEL */

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
                      <AnimeImage src={item.image} alt={item.title} />
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
        )}

        {/* NO RESULTS */}

        {!searchLoading && searched && anime.length === 0 && (
          <div className="search-empty-state">
            {searchError ? (
              <>
                <h3>⚠️ Something went wrong</h3>

                <p>{searchError}</p>

                <button type="button" onClick={handleSearch}>
                  Try Again
                </button>
              </>
            ) : (
              <>
                <h3>🔍 No anime found</h3>

                <p>We couldn't find any anime for "{query}".</p>
              </>
            )}
          </div>
        )}
      </section>

      {/* TOAST */}

      <Toast message={toast} onClose={() => setToast("")} />
    </main>
  );
}

export default Search;
