"use client";

import { useEffect, useState } from "react";
import { useLoading } from "@/components/LoadingProvider";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import Toast from "@/components/Toast";
import { useRouter } from "next/navigation";
import api from "@/helper/api.interceptor";
import "./Anime.css";

function Anime() {
  const router = useRouter();

  const [anime, setAnime] = useState([]);
  const [page, setPage] = useState(1);
  const [type, setType] = useState("");
  const [favourites, setFavourites] = useState([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [toast, setToast] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const { loading, startLoading, stopLoading } = useLoading();

  useEffect(() => {
    const loginStatus = localStorage.getItem("loggedIn");

    setLoggedIn(loginStatus === "true");
  }, []);

  useEffect(() => {
    const getAnime = async () => {
      startLoading();

      try {
        const data = await api.getKitsuAnimePage(page, type);

        setAnime(data.data || []);
        setHasNextPage(Boolean(data.links?.next));

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      } catch (error) {
        console.error("KITSU ANIME PAGE ERROR:", error);
        setAnime([]);
      } finally {
        stopLoading();
      }
    };

    getAnime();
  }, [page, type]);

  useEffect(() => {
    const savedFavourites =
      JSON.parse(localStorage.getItem("favourites")) || [];

    setFavourites(savedFavourites);
  }, []);

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

  const handleTypeChange = (e) => {
    setType(e.target.value);
    setPage(1);
  };

  const nextPage = () => {
    if (hasNextPage) {
      setPage(page + 1);
    }
  };

  const previousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <ProtectedRoute>
      <main className="anime-page">
        <div className="anime-page-heading">
          <h1>Anime</h1>

          <select value={type} onChange={handleTypeChange}>
            <option value="">All Type</option>
            <option value="TV">TV</option>
            <option value="movie">Movie</option>
            <option value="OVA">OVA</option>
            <option value="ONA">ONA</option>
            <option value="special">Special</option>
          </select>
        </div>

        <div className="anime-grid">
          {anime.map((item) => (
            <article className="anime-card" key={item.id}>
              <div className="anime-image">
                <img src={item.image} alt={item.title} />
              </div>

              <div className="anime-info">
                <h2>{item.title}</h2>

                <div className="anime-meta">
                  <span>⭐ {item.score || "N/A"}</span>

                  <span>{item.type || "Anime"}</span>
                </div>

                <div className="fav_cont">
                  <Link href={`/anime/${item.id}`} className="details-link">
                    View Details
                  </Link>

                  <button
                    type="button"
                    onClick={() => toggleFavourite(item)}
                    className="favourite-button"
                  >
                    {favourites.some((favourite) => favourite.id === item.id)
                      ? "❤️"
                      : "🤍"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {!loading && anime.length === 0 && (
          <p className="no-results">No anime found.</p>
        )}

        {/* PAGINATION */}

        {!loading && (
          <div className="pagination">
            <button onClick={previousPage} disabled={page === 1}>
              ← Previous
            </button>

            <span>Page {page}</span>

            <button onClick={nextPage} disabled={!hasNextPage}>
              Next →
            </button>
          </div>
        )}

        <Toast message={toast} onClose={() => setToast("")} />
      </main>
    </ProtectedRoute>
  );
}

export default Anime;
