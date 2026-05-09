import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Trash2, Users, Tv } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/hooks/useFavorites";
import { getMultipleCharacterByIds, getMultipleEpisodes } from "@/lib/api";
import type { Character, Episode } from "@/lib/api";
import Spinner from "@/components/Spinner";
import EmptyState from "@/components/EmptyState";

export default function FavoritesPage() {
  const {
    characterFavorites,
    episodeFavorites,
    removeCharacterFavorite,
    removeEpisodeFavorite,
  } = useFavorites();

  const [characters, setCharacters] = useState<Character[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loadingChars, setLoadingChars] = useState(false);
  const [loadingEps, setLoadingEps] = useState(false);
  const [activeTab, setActiveTab] = useState<"characters" | "episodes">("characters");

  // Fetch favorite characters
  useEffect(() => {
    if (characterFavorites.length === 0) {
      setCharacters([]);
      return;
    }
    let cancelled = false;
    setLoadingChars(true);
    getMultipleCharacterByIds(characterFavorites)
      .then((data) => {
        if (!cancelled) {
          const arr = Array.isArray(data) ? data : [data];
          setCharacters(arr);
        }
      })
      .catch(() => {
        if (!cancelled) setCharacters([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingChars(false);
      });
    return () => {
      cancelled = true;
    };
  }, [characterFavorites]);

  // Fetch favorite episodes
  useEffect(() => {
    if (episodeFavorites.length === 0) {
      setEpisodes([]);
      return;
    }
    let cancelled = false;
    setLoadingEps(true);
    getMultipleEpisodes(episodeFavorites)
      .then((data) => {
        if (!cancelled) {
          const arr = Array.isArray(data) ? data : [data];
          setEpisodes(arr);
        }
      })
      .catch(() => {
        if (!cancelled) setEpisodes([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingEps(false);
      });
    return () => {
      cancelled = true;
    };
  }, [episodeFavorites]);

  const totalFavs = characterFavorites.length + episodeFavorites.length;
  const isLoading = activeTab === "characters" ? loadingChars : loadingEps;

  if (totalFavs === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-creepster text-4xl text-portal text-shadow-portal-sm mb-2">
            Favorites
          </h1>
          <p className="text-asteroid font-inter text-sm">
            Your saved characters and episodes
          </p>
        </div>
        <EmptyState
          message="No favorites yet"
          submessage="Start exploring and save your favorite characters and episodes"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-creepster text-4xl text-portal text-shadow-portal-sm mb-2">
          Favorites
        </h1>
        <p className="text-asteroid font-inter text-sm">
          {totalFavs} saved item{totalFavs !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab("characters")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg font-orbitron text-xs uppercase tracking-wider transition-all",
            activeTab === "characters"
              ? "bg-portal text-void font-bold"
              : "bg-cosmic text-asteroid hover:text-starlight"
          )}
        >
          <Users className="w-4 h-4" />
          Characters ({characterFavorites.length})
        </button>
        <button
          onClick={() => setActiveTab("episodes")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg font-orbitron text-xs uppercase tracking-wider transition-all",
            activeTab === "episodes"
              ? "bg-portal text-void font-bold"
              : "bg-cosmic text-asteroid hover:text-starlight"
          )}
        >
          <Tv className="w-4 h-4" />
          Episodes ({episodeFavorites.length})
        </button>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center items-center min-h-[30dvh]">
          <Spinner />
        </div>
      )}

      {/* Characters tab */}
      {!isLoading && activeTab === "characters" && (
        <>
          {characters.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {characters.map((char) => (
                <div key={char.id} className="relative group">
                  <Link to={`/characters/${char.id}`}>
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-nebula transition-all duration-300 group-hover:shadow-portal-glow">
                      <img
                        src={char.image}
                        alt={char.name}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-nebula via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="font-orbitron font-bold text-starlight text-base truncate group-hover:text-portal transition-colors">
                          {char.name}
                        </h3>
                        <p className="text-asteroid text-xs mt-1">
                          {char.status} — {char.species}
                        </p>
                      </div>
                    </div>
                  </Link>
                  <button
                    onClick={() => removeCharacterFavorite(char.id)}
                    className={cn(
                      "absolute top-3 right-3 z-10 w-9 h-9 rounded-full",
                      "flex items-center justify-center",
                      "bg-crimson/80 backdrop-blur-sm transition-all duration-200",
                      "hover:scale-110 hover:bg-crimson"
                    )}
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              message="No favorite characters"
              submessage="Go to the Characters page to add some"
            />
          )}
        </>
      )}

      {/* Episodes tab */}
      {!isLoading && activeTab === "episodes" && (
        <>
          {episodes.length > 0 ? (
            <div className="space-y-3">
              {episodes.map((ep) => (
                <div key={ep.id} className="relative group">
                  <Link to={`/episodes/${ep.id}`}>
                    <div className="flex items-center gap-4 px-5 py-4 rounded-lg bg-cosmic transition-all duration-300 group-hover:bg-nebula group-hover:border-l-4 group-hover:border-l-portal">
                      <span className="font-orbitron font-black text-2xl text-portal tracking-tight">
                        {ep.episode}
                      </span>
                      <div className="w-px h-10 bg-cosmic" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-orbitron font-bold text-starlight text-sm truncate group-hover:text-portal transition-colors">
                          {ep.name}
                        </h3>
                        <p className="text-asteroid text-xs mt-0.5">{ep.air_date}</p>
                      </div>
                    </div>
                  </Link>
                  <button
                    onClick={() => removeEpisodeFavorite(ep.id)}
                    className={cn(
                      "absolute top-1/2 -translate-y-1/2 right-4 z-10 w-9 h-9 rounded-full",
                      "flex items-center justify-center",
                      "bg-crimson/80 backdrop-blur-sm transition-all duration-200",
                      "hover:scale-110 hover:bg-crimson opacity-0 group-hover:opacity-100"
                    )}
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              message="No favorite episodes"
              submessage="Go to the Episodes page to add some"
            />
          )}
        </>
      )}
    </div>
  );
}
