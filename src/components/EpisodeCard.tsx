import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Episode } from "@/lib/api";

interface EpisodeCardProps {
  episode: Episode;
  isFavorite?: boolean;
  onToggleFavorite?: (id: number) => void;
  className?: string;
}

export default function EpisodeCard({
  episode,
  isFavorite = false,
  onToggleFavorite,
  className,
}: EpisodeCardProps) {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite?.(episode.id);
  };

  return (
    <Link to={`/episodes/${episode.id}`} className="block group">
      <div
        className={cn(
          "relative flex items-center gap-4 px-5 py-4 rounded-lg",
          "bg-cosmic transition-all duration-300",
          "border-l-0 group-hover:border-l-4 group-hover:border-l-portal group-hover:bg-nebula",
          className
        )}
      >
        {/* Favorite button */}
        {onToggleFavorite && (
          <button
            onClick={handleFavoriteClick}
            className={cn(
              "absolute top-3 right-3 z-10 w-8 h-8 rounded-full",
              "flex items-center justify-center",
              "bg-void/60 backdrop-blur-sm transition-all duration-200",
              "hover:scale-110"
            )}
          >
            <Heart
              className={cn(
                "w-4 h-4 transition-colors duration-200",
                isFavorite ? "fill-crimson text-crimson" : "text-starlight/70"
              )}
            />
          </button>
        )}

        {/* Episode Code */}
        <div className="flex-shrink-0">
          <span className="font-orbitron font-black text-2xl text-portal tracking-tight">
            {episode.episode}
          </span>
        </div>

        {/* Divider */}
        <div className="w-px h-10 bg-cosmic group-hover:bg-portal/30 transition-colors" />

        {/* Episode Info */}
        <div className="flex-1 min-w-0 pr-8">
          <h3 className="font-orbitron font-bold text-starlight text-sm truncate group-hover:text-portal transition-colors">
            {episode.name}
          </h3>
          <p className="text-asteroid text-xs mt-0.5">{episode.air_date}</p>
        </div>
      </div>
    </Link>
  );
}
