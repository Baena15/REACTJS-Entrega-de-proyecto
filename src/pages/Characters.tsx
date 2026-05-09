import { useState, useEffect } from "react";
import type { Character } from "@/lib/api";
import { useCharacters } from "@/hooks/useCharacters";
import { useFavorites } from "@/hooks/useFavorites";
import CharacterCard from "@/components/CharacterCard";
import Spinner from "@/components/Spinner";
import EmptyState from "@/components/EmptyState";
import LoadMoreButton from "@/components/LoadMoreButton";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";

const statusOptions = ["", "Alive", "Dead", "unknown"];
const speciesOptions = [
  "",
  "Human",
  "Alien",
  "Humanoid",
  "Mythological",
  "Robot",
  "Cronenberg",
  "Animal",
  "Disease",
  "Poopybutthole",
  "unknown",
];

export default function CharactersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [species, setSpecies] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [allCharacters, setAllCharacters] = useState<Character[]>([]);

  const { data, loading, error } = useCharacters(page, search, status, species);
  const { toggleCharacterFavorite, isCharacterFavorite } = useFavorites();

  // Accumulate characters on load-more; reset on new search/filters
  useEffect(() => {
    if (data?.results) {
      if (page === 1) {
        setAllCharacters(data.results);
      } else {
        setAllCharacters((prev) => {
          const existingIds = new Set(prev.map((c) => c.id));
          const newOnes = data.results.filter((c) => !existingIds.has(c.id));
          return [...prev, ...newOnes];
        });
      }
    }
  }, [data, page]);

  const characters = allCharacters;
  const hasNextPage = data?.info?.next !== null;

  const handleSearch = () => {
    setPage(1);
    setSearch(searchInput);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearch("");
    setPage(1);
  };

  const handleLoadMore = () => {
    if (hasNextPage) {
      setPage((p) => p + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  if (error && characters.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EmptyState
          message="Failed to load characters"
          submessage={error}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-creepster text-4xl text-portal text-shadow-portal-sm mb-2">
          Characters
        </h1>
        <p className="text-asteroid font-inter text-sm">
          Browse all characters from the multiverse
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-asteroid" />
            <input
              type="text"
              placeholder="Search characters..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className={cn(
                "w-full pl-10 pr-10 py-2.5 bg-cosmic border border-cosmic rounded-lg",
                "text-starlight text-sm font-inter",
                "placeholder:text-asteroid/60",
                "focus:outline-none focus:border-portal focus:shadow-[0_0_10px_rgba(151,206,76,0.3)]",
                "transition-all duration-200"
              )}
            />
            {searchInput && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-asteroid hover:text-starlight"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            onClick={handleSearch}
            className={cn(
              "px-4 py-2.5 bg-portal text-void font-orbitron font-bold text-xs uppercase rounded-lg",
              "hover:bg-portal/90 transition-colors"
            )}
          >
            Search
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2.5",
              "border border-cosmic text-starlight font-orbitron text-xs uppercase rounded-lg",
              "hover:border-portal hover:text-portal transition-colors",
              showFilters && "border-portal text-portal"
            )}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="flex flex-wrap gap-3 p-4 bg-nebula rounded-lg border border-cosmic">
            <div className="flex items-center gap-2">
              <label className="text-asteroid text-xs font-orbitron uppercase">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-2 bg-cosmic border border-cosmic rounded text-starlight text-sm font-inter focus:outline-none focus:border-portal"
              >
                <option value="">All</option>
                {statusOptions.slice(1).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-asteroid text-xs font-orbitron uppercase">
                Species
              </label>
              <select
                value={species}
                onChange={(e) => {
                  setSpecies(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-2 bg-cosmic border border-cosmic rounded text-starlight text-sm font-inter focus:outline-none focus:border-portal"
              >
                <option value="">All</option>
                {speciesOptions.slice(1).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Character Grid */}
      {characters.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {characters.map((char) => (
              <CharacterCard
                key={char.id}
                character={char}
                isFavorite={isCharacterFavorite(char.id)}
                onToggleFavorite={toggleCharacterFavorite}
              />
            ))}
          </div>

          {/* Load More */}
          {hasNextPage && (
            <div className="mt-10">
              <LoadMoreButton onClick={handleLoadMore} loading={loading} />
            </div>
          )}
        </>
      ) : loading ? (
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      ) : (
        <EmptyState
          message="No characters found"
          submessage="Try adjusting your search or filters"
        />
      )}
    </div>
  );
}
