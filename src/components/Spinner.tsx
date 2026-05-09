import { cn } from "@/lib/utils";

interface SpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "w-6 h-6",
  md: "w-12 h-12",
  lg: "w-20 h-20",
};

export default function Spinner({ className, size = "md" }: SpinnerProps) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className={cn("relative", sizeMap[size])}>
        <div
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-portal animate-ring-rotate"
          style={{ animationDuration: "1s" }}
        />
        <div
          className="absolute inset-1 rounded-full border-2 border-transparent border-t-rick-cyan animate-ring-rotate"
          style={{ animationDuration: "1.5s", animationDirection: "reverse" }}
        />
        <div
          className="absolute inset-2 rounded-full border-2 border-transparent border-t-portal/60 animate-ring-rotate"
          style={{ animationDuration: "0.8s" }}
        />
      </div>
    </div>
  );
}
