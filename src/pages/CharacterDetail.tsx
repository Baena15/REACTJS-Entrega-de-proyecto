import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Heart, Tv, MapPin, CircleUser } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCharacterById } from "@/hooks/useCharacters";
import { useFavorites } from "@/hooks/useFavorites";
import { getMultipleEpisodes } from "@/lib/api";
import type { Episode } from "@/lib/api";
import Spinner from "@/components/Spinner";
import EmptyState from "@/components/EmptyState";
import SafeImage from "@/components/SafeImage";

const statusColors: Record<string, string> = {
  Alive: "bg-rick-cyan",
  Dead: "bg-crimson",
  unknown: "bg-morty-yellow",
};

export default function CharacterDetailPage() {
  const { id } = useParams<{ id: string }>();
  const characterId = Number(id);
  const { character, loading, error } = useCharacterById(characterId);
  const { isCharacterFavorite, toggleCharacterFavorite } = useFavorites();

  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [episodesLoading, setEpisodesLoading] = useState(false);

  useEffect(() => {
    if (!character) return;

    const episodeIds = character.episode
      .map((url) => {
        const match = url.match(/\/episode\/(\d+)$/);
        return match ? Number(match[1]) : null;
      })
      .filter((id): id is number => id !== null);

    if (episodeIds.length === 0) {
      setEpisodes([]);
      return;
    }

    let cancelled = false;
    setEpisodesLoading(true);

    getMultipleEpisodes(episodeIds)
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
        if (!cancelled) setEpisodesLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [character]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60dvh]">
        <Spinner />
      </div>
    );
  }

  if (error || !character) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EmptyState
          message="Character not found"
          submessage="This character may be lost in another dimension"
        />
      </div>
    );
  }

  const fav = isCharacterFavorite(character.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back link */}
      <Link
        to="/characters"
        className={cn(
          "inline-flex items-center gap-2 text-asteroid text-sm",
          "hover:text-portal transition-colors mb-6"
        )}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Characters
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Image column */}
        <div className="md:col-span-1">
          <div className="relative rounded-xl overflow-hidden aspect-square bg-nebula">
            <SafeImage
              src={character.image}
              alt={character.name}
              className="w-full h-full object-cover"
              containerClassName="aspect-square"
            />
          </div>
        </div>

        {/* Info column */}
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-creepster text-4xl text-portal text-shadow-portal-sm">
                {character.name}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <span
                  className={cn(
                    "w-2.5 h-2.5 rounded-full",
                    statusColors[character.status] || "bg-asteroid"
                  )}
                />
                <span className="text-starlight text-sm font-inter">
                  {character.status} — {character.species}
                </span>
              </div>
            </div>
            <button
              onClick={() => toggleCharacterFavorite(character.id)}
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center",
                "border border-cosmic transition-all duration-200 hover:scale-110",
                fav
                  ? "bg-crimson border-crimson"
                  : "bg-cosmic hover:border-portal"
              )}
            >
              <Heart
                className={cn(
                  "w-5 h-5",
                  fav ? "fill-white text-white" : "text-asteroid"
                )}
              />
            </button>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DetailCard
              icon={<CircleUser className="w-5 h-5" />}
              label="Gender"
              value={character.gender}
            />
            <DetailCard
              icon={<CircleUser className="w-5 h-5" />}
              label="Type"
              value={character.type || "—"}
            />
            <DetailCard
              icon={<MapPin className="w-5 h-5" />}
              label="Origin"
              value={character.origin.name}
            />
            <DetailCard
              icon={<MapPin className="w-5 h-5" />}
              label="Location"
              value={character.location.name}
            />
          </div>

          {/* Episodes */}
          <div className="pt-4">
            <h2 className="font-orbitron font-bold text-starlight text-lg mb-3 flex items-center gap-2">
              <Tv className="w-5 h-5 text-portal" />
              Appears in {character.episode.length} episodes
            </h2>

            {episodesLoading ? (
              <div className="flex justify-center py-6">
                <Spinner size="sm" />
              </div>
            ) : episodes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {episodes.map((ep) => (
                  <Link
                    key={ep.id}
                    to={`/episodes/${ep.id}`}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 rounded-lg",
                      "bg-cosmic border border-cosmic",
                      "hover:border-portal hover:bg-nebula transition-all duration-200"
                    )}
                  >
                    <span className="font-orbitron font-black text-sm text-portal">
                      {ep.episode}
                    </span>
                    <span className="text-starlight text-sm font-inter truncate">
                      {ep.name}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-asteroid text-sm">
                No episode data available.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="p-4 bg-nebula rounded-lg border border-cosmic">
      <div className="flex items-center gap-2 text-portal mb-1">{icon}</div>
      <p className="text-asteroid text-xs font-orbitron uppercase tracking-wider">
        {label}
      </p>
      <p className="text-starlight text-sm font-inter mt-0.5">{value}</p>
    </div>
  );
}
