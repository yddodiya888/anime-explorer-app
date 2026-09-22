"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Toast from "@/components/Toast";

import api from "@/helper/api.interceptor";
import "./KitsuAnimeDetail.css";
import { useLoading } from "@/components/LoadingProvider";

export default function KitsuAnimeDetail() {
  const { id } = useParams();

  const [toast, setToast] = useState("");
  const [favourites, setFavourites] = useState([]);

  const { startLoading, stopLoading } = useLoading();

  const [anime, setAnime] = useState(null);
  const [characters, setCharacters] = useState([]);

  // LOAD FAVOURITES
  useEffect(() => {
    const savedFavourites =
      JSON.parse(localStorage.getItem("favourites")) || [];

    setFavourites(savedFavourites);
  }, []);

  // FAVOURITE FUNCTION
  const toggleFavourite = () => {
    if (!anime) {
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

        title:
          anime.attributes?.canonicalTitle ||
          anime.attributes?.titles?.en ||
          anime.attributes?.titles?.canonical ||
          "Unknown",

        image:
          anime.attributes?.posterImage?.large ||
          anime.attributes?.posterImage?.original ||
          anime.attributes?.posterImage?.medium,

        score: anime.attributes?.averageRating
          ? Number(anime.attributes.averageRating) / 10
          : null,

        type: anime.attributes?.subtype || "Anime",
      };

      updatedFavourites = [...favourites, favouriteAnime];

      setToast("Added to favourites");
    }

    setFavourites(updatedFavourites);

    localStorage.setItem("favourites", JSON.stringify(updatedFavourites));
  };

  useEffect(() => {
    const getAnime = async () => {
      if (!id) {
        return;
      }

      startLoading();

      try {
        // Get anime details
        const data = await api.getKitsuAnimeDetail(id);

        setAnime(data.data);

        // Get characters
        try {
          const characterData = await api.getKitsuAnimeCharacters(id);

          const characterList = await Promise.all(
            (characterData?.data || []).map(async (item) => {
              const characterUrl =
                item.relationships?.character?.links?.related;

              if (!characterUrl) {
                return null;
              }

              try {
                const characterResponse =
                  await api.getKitsuCharacter(characterUrl);

                const character = characterResponse?.data;

                const image = character?.attributes?.image;

                const imageUrl =
                  image?.original ||
                  image?.large ||
                  image?.medium ||
                  image?.small;

                // Wait for image to load before
                // showing the character card
                if (imageUrl) {
                  await new Promise((resolve) => {
                    const img = new Image();

                    img.onload = resolve;
                    img.onerror = resolve;

                    img.src = imageUrl;
                  });
                }

                return {
                  id: item.id,
                  role: item.attributes?.role,
                  character: character,
                };
              } catch (error) {
                console.error("CHARACTER DETAIL ERROR:", error);

                return null;
              }
            }),
          );

          setCharacters(characterList.filter(Boolean));
        } catch (error) {
          console.error("KITSU CHARACTER ERROR:", error);

          setCharacters([]);
        }
      } catch (error) {
        console.error("KITSU DETAIL ERROR:", error);
      } finally {
        stopLoading();
      }
    };

    getAnime();
  }, [id]);

  if (!anime) {
    return <div className="loading">Loading...</div>;
  }

  const attributes = anime.attributes;

  const title =
    attributes.canonicalTitle ||
    attributes.titles?.en ||
    attributes.titles?.canonical ||
    "No title available";

  const isFavourite = favourites.some((favourite) => favourite.id === anime.id);

  return (
    <main className="anime-detail">
      {/* BACK BUTTON */}

      <Link href="/search" className="back-button">
        ← Back to Search
      </Link>

      {/* DETAILS */}

      <section className="detail-section">
        <div className="detail-image">
          <img
            src={
              attributes.posterImage?.large || attributes.posterImage?.original
            }
            alt={title}
          />
        </div>

        <div className="detail-content">
          <div className="favourite_cont">
            <h1>{title}</h1>
          {/* FAVOURITE BUTTON */}

          <button
            type="button"
            className="favourite-button"
            onClick={toggleFavourite}
          >
              {isFavourite ? "❤️" : "🤍"}
            </button>

          </div>
          

          <p className="synopsis">
            {attributes.synopsis || "No description available."}
          </p>

          {/* META INFORMATION */}

          <div className="detail-meta">
            <span>⭐ {attributes.averageRating || "N/A"}</span>

            <span>📺 {attributes.subtype || "Anime"}</span>

            <span>🎞️ {attributes.episodeCount || "N/A"} Episodes</span>

            <span>{attributes.status || "N/A"}</span>

            <span>⏱️ {attributes.episodeLength || "N/A"} min</span>

            <span>📅 {attributes.startDate || "N/A"}</span>
          </div>

          {/* TITLES */}

          <div className="anime-titles">
            <h3>Titles</h3>

            <p>
              <strong>English:</strong> {attributes.titles?.en || "N/A"}
            </p>

            <p>
              <strong>Japanese:</strong> {attributes.titles?.ja_jp || "N/A"}
            </p>

            <p>
              <strong>Canonical:</strong>{" "}
              {attributes.canonicalTitle ||
                attributes.titles?.canonical ||
                "N/A"}
            </p>
          </div>

          {/* AGE RATING */}

          {attributes.ageRating && (
            <div className="age-rating">
              <strong>Age Rating:</strong> {attributes.ageRating}
              {attributes.ageRatingGuide && ` - ${attributes.ageRatingGuide}`}
            </div>
          )}
        </div>
      </section>

      {/* CHARACTERS */}

      {characters.length > 0 && (
        <section className="characters-section">
          <h2>Characters</h2>

          <div className="characters-grid">
            {characters.map((item) => {
              const character = item.character?.attributes;

              const characterImage =
                character?.image?.original ||
                character?.image?.large ||
                character?.image?.medium ||
                character?.image?.small;

              return (
                <article className="character-card" key={item.id}>
                  <div className="character-image">
                    {characterImage ? (
                      <img
                        src={characterImage}
                        alt={character?.name || "Character"}
                      />
                    ) : (
                      <div className="no-character-image">No Image</div>
                    )}
                  </div>

                  <div className="character-info">
                    <h3>{character?.name || "Unknown Character"}</h3>

                    <p>{item.role || "Unknown role"}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* TOAST */}

      <Toast message={toast} onClose={() => setToast("")} />
    </main>
  );
}
