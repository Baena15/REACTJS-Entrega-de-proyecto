import { useState } from "react";
import { cn } from "@/lib/utils";

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
}

export default function SafeImage({
  src,
  alt,
  className = "",
  containerClassName = "",
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  const getInitials = (name: string) => {
    const words = name.trim().split(/\s+/);
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  };

  const getColorFromName = (name: string) => {
    const colors = [
      "bg-portal/20 text-portal",
      "bg-rick-cyan/20 text-rick-cyan",
      "bg-crimson/20 text-crimson",
      "bg-morty-yellow/20 text-morty-yellow",
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  if (hasError || !src) {
    return (
      <div
        className={cn(
          "w-full h-full flex flex-col items-center justify-center bg-cosmic",
          containerClassName
        )}
      >
        <div
          className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center text-xl font-orbitron font-bold",
            getColorFromName(alt)
          )}
        >
          {getInitials(alt)}
        </div>
        <span className="text-asteroid text-xs mt-2 text-center px-2 truncate max-w-full">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setHasError(true)}
    />
  );
}
