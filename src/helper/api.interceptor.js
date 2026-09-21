const api = {
  // Home
  getKitsuHomeAnime: async () => {
    const response = await fetch(
      "https://kitsu.io/api/edge/anime?page[size]=20"
    );

    const data = await response.json();

    const anime = data.data.map((item) => {
      const attributes = item.attributes;

      return {
        id: item.id,
        title:
          attributes.canonicalTitle ||
          attributes.titles?.en ||
          attributes.titles?.canonical ||
          "Unknown",
        image:
          attributes.posterImage?.large ||
          attributes.posterImage?.original ||
          attributes.posterImage?.medium,
        score: attributes.averageRating
          ? Number(attributes.averageRating) / 10
          : null,
        type: attributes.subtype || "Anime",
        synopsis: attributes.synopsis || "",
        episodes: attributes.episodeCount || null,
        status: attributes.status || null,
      };
    });

    return {
      data: anime,
    };
  },

  // Anime listing / pagination
  getKitsuAnimePage: async (page = 1, type = "") => {
    let url = `https://kitsu.io/api/edge/anime?page[number]=${page}&page[size]=12`;

    if (type) {
      url += `&filter[subtype]=${type}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch Kitsu anime");
    }

    const data = await response.json();

    const anime = data.data.map((item) => {
      const attributes = item.attributes;

      return {
        id: item.id,
        title:
          attributes.canonicalTitle ||
          attributes.titles?.en ||
          attributes.titles?.canonical ||
          "Unknown",
        image:
          attributes.posterImage?.large ||
          attributes.posterImage?.original ||
          attributes.posterImage?.medium,
        score: attributes.averageRating
          ? Number(attributes.averageRating) / 10
          : null,
        type: attributes.subtype || "Anime",
      };
    });

    return {
      data: anime,
      links: data.links,
    };
  },

  // Search
  searchAnime: async (query) => {
    const response = await fetch(
      `https://kitsu.io/api/edge/anime?filter[text]=${encodeURIComponent(
        query
      )}&page[size]=10`
    );

    const data = await response.json();

    const anime = data.data.map((item) => {
      const attributes = item.attributes;

      return {
        id: item.id,
        title:
          attributes.canonicalTitle ||
          attributes.titles?.en ||
          attributes.titles?.canonical ||
          "Unknown",
        image:
          attributes.posterImage?.large ||
          attributes.posterImage?.original ||
          attributes.posterImage?.medium,
        score: attributes.averageRating
          ? Number(attributes.averageRating) / 10
          : null,
        type: attributes.subtype || "Anime",
      };
    });

    return {
      data: anime,
    };
  },

  // Anime detail
  getKitsuAnimeDetail: async (id) => {
    const response = await fetch(
      `https://kitsu.io/api/edge/anime/${id}`
    );

    const data = await response.json();

    return data;
  },

  // Anime characters
  getKitsuAnimeCharacters: async (id) => {
    const response = await fetch(
      `https://kitsu.io/api/edge/anime/${id}/characters?page[size]=12`
    );

    const data = await response.json();

    return data;
  },

  // Individual character
  getKitsuCharacter: async (url) => {
    const response = await fetch(url);

    const data = await response.json();

    return data;
  },
};

export default api;
