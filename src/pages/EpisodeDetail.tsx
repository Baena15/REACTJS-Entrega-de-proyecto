import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEpisodeById } from "@/hooks/useEpisodes";
import Spinner from "@/components/Spinner";
import EmptyState from "@/components/EmptyState";
import SafeImage from "@/components/SafeImage";

export default function EpisodeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const episodeId = Number(id);
  const { episode, loading, error } = useEpisodeById(episodeId);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60dvh]">
        <Spinner />
      </div>
    );
  }

  if (error || !episode) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EmptyState
          message="Episode not found"
          submessage="This episode may be lost in another dimension"
        />
      </div>
    );
  }

  // Parse character IDs from URLs
  const characterIds = episode.characters
    .map((url) => {
      const match = url.match(/\/character\/(\d+)$/);
      return match ? Number(match[1]) : null;
    })
    .filter((id): id is number => id !== null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back link */}
      <Link
        to="/episodes"
        className={cn(
          "inline-flex items-center gap-2 text-asteroid text-sm",
          "hover:text-portal transition-colors mb-6"
        )}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Episodes
      </Link>

      {/* Episode Header */}
      <div className="bg-nebula rounded-xl border border-cosmic p-6 sm:p-8 mb-8">
        <div className="flex items-center gap-4 mb-4">
          <span className="font-orbitron font-black text-4xl sm:text-5xl text-portal">
            {episode.episode}
          </span>
        </div>
        <h1 className="font-creepster text-3xl sm:text-4xl text-portal text-shadow-portal-sm mb-4">
          {episode.name}
        </h1>
        <div className="flex items-center gap-2 text-asteroid text-sm">
          <Calendar className="w-4 h-4" />
          <span>{episode.air_date}</span>
        </div>
      </div>

      {/* Characters in this episode */}
      <div className="mb-6">
        <h2 className="font-orbitron font-bold text-starlight text-lg mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-portal" />
          Characters in this episode
          <span className="text-asteroid text-sm font-inter font-normal">
            ({characterIds.length})
          </span>
        </h2>
      </div>

      {/* Character grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {characterIds.map((charId) => (
          <CharacterThumb key={charId} id={charId} />
        ))}
      </div>
    </div>
  );
}

function CharacterThumb({ id }: { id: number }) {
  const [charData, setCharData] = useState<{ name: string; image: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`https://rickandmortyapi.com/api/character/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) {
          setCharData({ name: data.name, image: data.image });
        }
      })
      .catch(() => {
        if (!cancelled) setCharData({ name: "Unknown", image: "" });
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (!charData) {
    return (
      <Link to={`/characters/${id}`}>
        <div className="aspect-square rounded-lg bg-cosmic animate-pulse" />
      </Link>
    );
  }

  return (
    <Link to={`/characters/${id}`} className="group">
      <div className="aspect-square rounded-lg overflow-hidden bg-cosmic">
        <SafeImage
          src={charData.image || ""}
          alt={charData.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          containerClassName="aspect-square"
        />
      </div>
      <p className="text-starlight text-xs font-inter mt-1 truncate group-hover:text-portal transition-colors">
        {charData.name}
      </p>
    </Link>
  );
}
