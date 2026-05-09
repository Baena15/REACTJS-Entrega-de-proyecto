import { Rocket } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  message?: string;
  submessage?: string;
  className?: string;
}

export default function EmptyState({
  message = "Nothing here yet",
  submessage = "Try searching or explore other dimensions",
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-4 text-center",
        className
      )}
    >
      <div className="w-16 h-16 rounded-full bg-cosmic flex items-center justify-center mb-4">
        <Rocket className="w-8 h-8 text-portal" />
      </div>
      <h3 className="font-orbitron font-bold text-lg text-starlight mb-2">
        {message}
      </h3>
      <p className="text-asteroid text-sm">{submessage}</p>
    </div>
  );
}
