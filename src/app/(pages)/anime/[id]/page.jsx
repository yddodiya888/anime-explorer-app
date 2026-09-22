"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Toast from "@/components/Toast";

import api from "@/helper/api.interceptor";

import "./AnimeDetail.css";
import ProtectedRoute from "@/components/ProtectedRoute";

function AnimeDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [favourites, setFavourites] = useState([]);
  const [anime, setAnime] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [toast, setToast] = useState("");

  // CHECK LOGIN
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

  // FAVOURITE FUNCTION
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
      try {
        // Get Kitsu anime
        const data = await api.getKitsuAnimeDetail(id);

        console.log("KITSU DETAIL RESPONSE:", data);

        setAnime(data.data);

        // Get characters
        try {
          const characterData = await api.getKitsuAnimeCharacters(id);

          console.log("CHARACTER DATA:", characterData);

          const characterList = await Promise.all(
            (characterData?.data || []).map(async (item) => {
              const characterUrl =
                item.relationships?.character?.links?.related;

              if (!characterUrl) {
                return null;
              }

              const characterData = await api.getKitsuCharacter(characterUrl);

              return {
                id: item.id,
                role: item.attributes?.role,
                character: characterData.data,
              };
            }),
          );

          setCharacters(characterList.filter(Boolean));
        } catch (error) {
          console.error("KITSU CHARACTER ERROR:", error);

          setCharacters([]);
        }
      } catch (error) {
        console.error("KITSU DETAIL ERROR:", error);
      }
    };

    if (id) {
      getAnime();
    }
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

  return (
    <ProtectedRoute>
      <main className="anime-detail">
        {/* BACK BUTTON */}

        <Link href="/" className="back-button">
          ← Back
        </Link>

        {/* DETAILS */}

        <section className="detail-section">
          <div className="detail-image">
            <img
              src={
                attributes.posterImage?.large ||
                attributes.posterImage?.original
              }
              alt={title}
            />
          </div>

          <div className="detail-content">
            <div className="fav_cont">
              <h1>{title}</h1>

              <button
                type="button"
                className="favourite-button"
                onClick={() => toggleFavourite(anime)}
              >
                {favourites.some((favourite) => favourite.id === anime.id)
                  ? "❤️"
                  : "🤍"}
              </button>
            </div>

            <p className="synopsis">
              {attributes.synopsis || "No description available."}
            </p>

            {/* META */}

            <div className="detail-meta">
              <span>
                ⭐{" "}
                {attributes.averageRating
                  ? Number(attributes.averageRating) / 10
                  : "N/A"}
              </span>

              <span>📺 {attributes.subtype || "Anime"}</span>

              <span>🎞️ {attributes.episodeCount || "N/A"} Episodes</span>

              <span>📅 {attributes.status || "N/A"}</span>

              <span>⏱️ {attributes.episodeLength || "N/A"} min</span>
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
                <strong>Canonical:</strong> {attributes.canonicalTitle || "N/A"}
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

                return (
                  <article className="character-card" key={item.id}>
                    <div className="character-image">
                      {character?.image ? (
                        <img
                          src={character.image.original}
                          alt={character.name || "Character"}
                          onLoad={(e) => {
                            e.currentTarget.classList.add("image-loaded");
                          }}
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
    </ProtectedRoute>
  );
}

export default AnimeDetail;
