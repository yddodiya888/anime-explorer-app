"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import Toast from "@/components/Toast";
import AnimeImage from "@/components/AnimeImage";
import SkeletonCard from "@/components/SkeletonCard";

import "./Favourite.css";

export default function Favourite() {
  const [favourites, setFavourites] = useState([]);
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedFavourites =
      JSON.parse(localStorage.getItem("favourites")) || [];

    setFavourites(savedFavourites);
    setLoading(false);
  }, []);

  const removeFavourite = (id) => {
    const updatedFavourites = favourites.filter(
      (favourite) => favourite.id !== id,
    );

    setFavourites(updatedFavourites);

    localStorage.setItem("favourites", JSON.stringify(updatedFavourites));

    setToast("Removed from favourites");
  };

  return (
    <main className="favourite-page">
      <div className="favourite-heading">
        <h1>My Favourites</h1>

        <p>Your favourite anime in one place.</p>
      </div>

      {loading ? (
        <div className="favourite-grid">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : favourites.length === 0 ? (
        <p className="no-favourites">
          You haven't added any anime to favourites yet.
        </p>
      ) : (
        <div className="favourite-grid">
          {favourites.map((item) => (
            <article className="favourite-card" key={item.id}>
              <div className="favourite-image">
                <AnimeImage src={item.image} alt={item.title} />
              </div>

              <div className="favourite-info">
                <h2>{item.title}</h2>

                <div className="favourite-meta">
                  <span>⭐ {item.score || "N/A"}</span>

                  <span>{item.type || "Anime"}</span>
                </div>

                <Link href={`/anime/${item.id}`} className="details-link">
                  View Details
                </Link>

                <button
                  type="button"
                  className="remove-favourite"
                  onClick={() => removeFavourite(item.id)}
                >
                  ❤️ Remove Favourite
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <Toast message={toast} onClose={() => setToast("")} />
    </main>
  );
}
