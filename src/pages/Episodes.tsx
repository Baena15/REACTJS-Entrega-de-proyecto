import { useState, useEffect } from "react";
import type { Episode } from "@/lib/api";
import { useEpisodes } from "@/hooks/useEpisodes";
import { useFavorites } from "@/hooks/useFavorites";
import EpisodeCard from "@/components/EpisodeCard";
import Spinner from "@/components/Spinner";
import EmptyState from "@/components/EmptyState";
import LoadMoreButton from "@/components/LoadMoreButton";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function EpisodesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [allEpisodes, setAllEpisodes] = useState<Episode[]>([]);

  const { data, loading, error } = useEpisodes(page, search);
  const { toggleEpisodeFavorite, isEpisodeFavorite } = useFavorites();

  // Accumulate episodes on load-more; reset on new search
  useEffect(() => {
    if (data?.results) {
      if (page === 1) {
        setAllEpisodes(data.results);
      } else {
        setAllEpisodes((prev) => {
          const existingIds = new Set(prev.map((e) => e.id));
          const newOnes = data.results.filter((e) => !existingIds.has(e.id));
          return [...prev, ...newOnes];
        });
      }
    }
  }, [data, page]);

  const episodes = allEpisodes;
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

  if (error && episodes.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EmptyState message="Failed to load episodes" submessage={error} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-creepster text-4xl text-portal text-shadow-portal-sm mb-2">
          Episodes
        </h1>
        <p className="text-asteroid font-inter text-sm">
          Browse all episodes from across the seasons
        </p>
      </div>

      {/* Search */}
      <div className="mb-8 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-asteroid" />
          <input
            type="text"
            placeholder="Search episodes..."
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
      </div>

      {/* Episodes list */}
      {episodes.length > 0 ? (
        <>
          <div className="space-y-3">
            {episodes.map((ep) => (
              <EpisodeCard
                key={ep.id}
                episode={ep}
                isFavorite={isEpisodeFavorite(ep.id)}
                onToggleFavorite={toggleEpisodeFavorite}
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
          message="No episodes found"
          submessage="Try adjusting your search"
        />
      )}
    </div>
  );
}
