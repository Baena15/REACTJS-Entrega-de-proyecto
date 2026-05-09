import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "rick-morty-favorites-v2";

interface FavoritesData {
  characters: number[];
  episodes: number[];
}

function loadFavorites(): FavoritesData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Migrate old format (plain array of numbers -> treated as characters)
      if (Array.isArray(parsed)) {
        const chars = parsed.filter((id: unknown) => typeof id === "number");
        return { characters: chars, episodes: [] };
      }
      if (parsed && typeof parsed === "object") {
        return {
          characters: Array.isArray(parsed.characters)
            ? parsed.characters.filter((id: unknown) => typeof id === "number")
            : [],
          episodes: Array.isArray(parsed.episodes)
            ? parsed.episodes.filter((id: unknown) => typeof id === "number")
            : [],
        };
      }
    }
  } catch {
    // ignore
  }
  return { characters: [], episodes: [] };
}

function saveFavorites(data: FavoritesData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoritesData>(loadFavorites);

  useEffect(() => {
    saveFavorites(favorites);
  }, [favorites]);

  /* ─── Characters ─── */
  const toggleCharacterFavorite = useCallback((id: number) => {
    setFavorites((prev) => {
      const chars = prev.characters.includes(id)
        ? prev.characters.filter((fId) => fId !== id)
        : [...prev.characters, id];
      return { ...prev, characters: chars };
    });
  }, []);

  const isCharacterFavorite = useCallback(
    (id: number) => favorites.characters.includes(id),
    [favorites.characters]
  );

  /* ─── Episodes ─── */
  const toggleEpisodeFavorite = useCallback((id: number) => {
    setFavorites((prev) => {
      const eps = prev.episodes.includes(id)
        ? prev.episodes.filter((fId) => fId !== id)
        : [...prev.episodes, id];
      return { ...prev, episodes: eps };
    });
  }, []);

  const isEpisodeFavorite = useCallback(
    (id: number) => favorites.episodes.includes(id),
    [favorites.episodes]
  );

  const removeCharacterFavorite = useCallback((id: number) => {
    setFavorites((prev) => ({
      ...prev,
      characters: prev.characters.filter((fId) => fId !== id),
    }));
  }, []);

  const removeEpisodeFavorite = useCallback((id: number) => {
    setFavorites((prev) => ({
      ...prev,
      episodes: prev.episodes.filter((fId) => fId !== id),
    }));
  }, []);

  return {
    characterFavorites: favorites.characters,
    episodeFavorites: favorites.episodes,
    toggleCharacterFavorite,
    toggleEpisodeFavorite,
    isCharacterFavorite,
    isEpisodeFavorite,
    removeCharacterFavorite,
    removeEpisodeFavorite,
  };
}
