import { useState, useEffect, useCallback } from "react";
import type { Episode, ApiResponse } from "@/lib/api";
import { getEpisodes } from "@/lib/api";

export function useEpisodes(
  page: number = 1,
  name?: string,
  episode?: string
) {
  const [data, setData] = useState<ApiResponse<Episode> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEpisodes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getEpisodes(page, name, episode);
      setData(response);
    } catch {
      setError("Failed to load episodes");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [page, name, episode]);

  useEffect(() => {
    fetchEpisodes();
  }, [fetchEpisodes]);

  return { data, loading, error, refetch: fetchEpisodes };
}

export function useEpisodeById(id: number) {
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchEpisode() {
      setLoading(true);
      setError(null);
      try {
        const response = await import("@/lib/api");
        const result = await response.getEpisodeById(id);
        if (!cancelled) setEpisode(result);
      } catch {
        if (!cancelled) setError("Failed to load episode");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchEpisode();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return { episode, loading, error };
}
