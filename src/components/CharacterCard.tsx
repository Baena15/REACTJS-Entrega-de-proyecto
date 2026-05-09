import { useState, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Character } from "@/lib/api";
import SafeImage from "@/components/SafeImage";

interface CharacterCardProps {
  character: Character;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
}

const statusColors: Record<string, string> = {
  Alive: "bg-rick-cyan",
  Dead: "bg-crimson",
  unknown: "bg-morty-yellow",
};

export default function CharacterCard({
  character,
  isFavorite,
  onToggleFavorite,
}: CharacterCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setTilt({
        x: y * -10,
        y: x * 10,
      });
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleFavoriteClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onToggleFavorite(character.id);
    },
    [character.id, onToggleFavorite]
  );

  return (
    <Link to={`/characters/${character.id}`} className="block group">
      <div
        ref={cardRef}
        className={cn(
          "relative aspect-[3/4] rounded-xl overflow-hidden",
          "bg-nebula transition-all duration-300",
          isHovered && "shadow-portal-glow"
        )}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(600px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: isHovered ? "box-shadow 300ms" : "transform 300ms, box-shadow 300ms",
        }}
      >
        {/* Image */}
        <SafeImage
          src={character.image}
          alt={character.name}
          className="absolute inset-0 w-full h-full object-cover"
          containerClassName="absolute inset-0"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-nebula via-transparent to-transparent" />

        {/* Favorite button */}
        <button
          onClick={handleFavoriteClick}
          className={cn(
            "absolute top-3 right-3 z-10 w-9 h-9 rounded-full",
            "flex items-center justify-center",
            "bg-void/60 backdrop-blur-sm transition-all duration-200",
            "hover:scale-110"
          )}
        >
          <Heart
            className={cn(
              "w-5 h-5 transition-colors duration-200",
              isFavorite ? "fill-crimson text-crimson" : "text-starlight/70"
            )}
          />
        </button>

        {/* Info box */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3
            className={cn(
              "font-orbitron font-bold text-starlight text-base truncate",
              "transition-colors duration-300",
              isHovered && "text-portal"
            )}
          >
            {character.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={cn(
                "w-2 h-2 rounded-full",
                statusColors[character.status] || "bg-asteroid"
              )}
            />
            <span className="text-asteroid text-xs">
              {character.status} — {character.species}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
