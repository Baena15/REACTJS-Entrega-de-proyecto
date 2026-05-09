import { useState, useEffect, useCallback } from "react";
import type { Character, ApiResponse } from "@/lib/api";
import { getCharacters } from "@/lib/api";

export function useCharacters(
  page: number = 1,
  name?: string,
  status?: string,
  species?: string
) {
  const [data, setData] = useState<ApiResponse<Character> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCharacters = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getCharacters(page, name, status, species);
      setData(response);
    } catch {
      setError("Failed to load characters");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [page, name, status, species]);

  useEffect(() => {
    fetchCharacters();
  }, [fetchCharacters]);

  return { data, loading, error, refetch: fetchCharacters };
}

export function useCharacterById(id: number) {
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchCharacter() {
      setLoading(true);
      setError(null);
      try {
        const response = await import("@/lib/api");
        const result = await response.getCharacterById(id);
        if (!cancelled) setCharacter(result);
      } catch {
        if (!cancelled) setError("Failed to load character");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchCharacter();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return { character, loading, error };
}
