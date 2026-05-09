const API_BASE_URL = "https://rickandmortyapi.com/api";

export interface Character {
  id: number;
  name: string;
  status: "Alive" | "Dead" | "unknown";
  species: string;
  type: string;
  gender: string;
  origin: {
    name: string;
    url: string;
  };
  location: {
    name: string;
    url: string;
  };
  image: string;
  episode: string[];
  url: string;
  created: string;
}

export interface Episode {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  characters: string[];
  url: string;
  created: string;
}

export interface Location {
  id: number;
  name: string;
  type: string;
  dimension: string;
  residents: string[];
  url: string;
  created: string;
}

export interface ApiResponse<T> {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: T[];
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
}

export function getCharacters(
  page: number = 1,
  name?: string,
  status?: string,
  species?: string
): Promise<ApiResponse<Character>> {
  const params = new URLSearchParams();
  params.set("page", String(page));
  if (name) params.set("name", name);
  if (status) params.set("status", status);
  if (species) params.set("species", species);
  return fetchJson<ApiResponse<Character>>(
    `${API_BASE_URL}/character?${params.toString()}`
  );
}

export function getCharacterById(id: number): Promise<Character> {
  return fetchJson<Character>(`${API_BASE_URL}/character/${id}`);
}

export function getMultipleCharacterByIds(ids: number[]): Promise<Character[] | Character> {
  if (ids.length === 0) return Promise.resolve([]);
  return fetchJson<Character[] | Character>(`${API_BASE_URL}/character/${ids.join(",")}`);
}

export function getEpisodes(
  page: number = 1,
  name?: string,
  episode?: string
): Promise<ApiResponse<Episode>> {
  const params = new URLSearchParams();
  params.set("page", String(page));
  if (name) params.set("name", name);
  if (episode) params.set("episode", episode);
  return fetchJson<ApiResponse<Episode>>(
    `${API_BASE_URL}/episode?${params.toString()}`
  );
}

export function getEpisodeById(id: number): Promise<Episode> {
  return fetchJson<Episode>(`${API_BASE_URL}/episode/${id}`);
}

export function getMultipleEpisodes(ids: number[]): Promise<Episode[] | Episode> {
  if (ids.length === 0) return Promise.resolve([]);
  return fetchJson<Episode[] | Episode>(`${API_BASE_URL}/episode/${ids.join(",")}`);
}

export async function getTotalCounts(): Promise<{
  characters: number;
  episodes: number;
  locations: number;
}> {
  const [charRes, epRes, locRes] = await Promise.all([
    fetchJson<ApiResponse<Character>>(`${API_BASE_URL}/character`).catch(() => null),
    fetchJson<ApiResponse<Episode>>(`${API_BASE_URL}/episode`).catch(() => null),
    fetchJson<ApiResponse<Location>>(`${API_BASE_URL}/location`).catch(() => null),
  ]);

  return {
    characters: charRes?.info?.count ?? 0,
    episodes: epRes?.info?.count ?? 0,
    locations: locRes?.info?.count ?? 0,
  };
}
