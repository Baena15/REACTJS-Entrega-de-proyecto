import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface LoadMoreButtonProps {
  onClick: () => void;
  loading?: boolean;
  className?: string;
}

export default function LoadMoreButton({
  onClick,
  loading = false,
  className,
}: LoadMoreButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={cn(
        "flex items-center justify-center gap-2 mx-auto px-8 py-3",
        "border-2 border-portal text-portal bg-transparent",
        "font-orbitron font-bold text-sm uppercase tracking-wider",
        "rounded transition-all duration-300",
        "hover:bg-portal hover:text-void hover:shadow-portal-glow",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
    >
      {loading ? (
        <div className="w-5 h-5 rounded-full border-2 border-transparent border-t-portal animate-ring-rotate" />
      ) : (
        <>
          <span>Load More</span>
          <ChevronDown className="w-4 h-4" />
        </>
      )}
    </button>
  );
}
