import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Tv, MapPin, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";
import { getTotalCounts } from "@/lib/api";
import Spinner from "@/components/Spinner";

/* ------------------------------------------------------------------ */
/*  Particle generator                                                */
/* ------------------------------------------------------------------ */
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
}

function useParticles(count: number) {
  return useMemo<Particle[]>(() => {
    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 2 + Math.random() * 6,
        color:
          Math.random() > 0.5
            ? `rgba(151, 206, 76, ${0.15 + Math.random() * 0.25})`
            : `rgba(17, 181, 228, ${0.1 + Math.random() * 0.2})`,
        duration: 6 + Math.random() * 8,
        delay: Math.random() * 5,
      });
    }
    return particles;
  }, [count]);
}

/* ------------------------------------------------------------------ */
/*  Stat counter with animation                                       */
/* ------------------------------------------------------------------ */
interface StatCounterProps {
  value: number;
  label: string;
  icon: React.ReactNode;
  delay?: number;
}

function StatCounter({ value, label, icon, delay = 0 }: StatCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!isVisible) return;
    const duration = 1500;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isVisible, value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
      }}
      className={cn(
        "flex items-center gap-3 px-5 py-4",
        "bg-nebula border border-cosmic rounded-xl",
        "hover:border-portal hover:shadow-[0_0_15px_rgba(151,206,76,0.2)]",
        "hover:-translate-y-1 transition-all duration-300"
      )}
    >
      <div className="w-10 h-10 rounded-lg bg-portal/10 flex items-center justify-center text-portal">
        {icon}
      </div>
      <div>
        <div className="font-orbitron font-black text-2xl text-portal">
          {displayValue.toLocaleString()}
        </div>
        <div className="text-asteroid text-xs font-inter">{label}</div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Floating debris                                                   */
/* ------------------------------------------------------------------ */
function FloatingDebris({
  particles,
}: {
  particles: Particle[];
}) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            filter: "blur(1px)",
          }}
          animate={{
            y: [-15, 15, -15],
            x: [-10, 10, -10],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Home Page                                                    */
/* ------------------------------------------------------------------ */
export default function HomePage() {
  const [counts, setCounts] = useState<{
    characters: number;
    episodes: number;
    locations: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const particles = useParticles(18);

  useEffect(() => {
    let cancelled = false;

    async function fetchCounts() {
      try {
        const data = await getTotalCounts();
        if (!cancelled) setCounts(data);
      } catch {
        if (!cancelled) setCounts({ characters: 0, episodes: 0, locations: 0 });
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchCounts();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="relative min-h-[100dvh] overflow-hidden flex items-center justify-center">
      {/* Background layers */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#97ce4c_0%,_transparent_70%)] opacity-[0.08]" />

      {/* Floating debris */}
      <FloatingDebris particles={particles} />

      {/* Portal vortex */}
      <motion.div
        className="absolute flex items-center justify-center pointer-events-none"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
      >
        <div
          className={cn(
            "w-[50vw] h-[50vw] max-w-[600px] max-h-[600px]",
            "rounded-[40%_60%_70%_30%/40%_50%_60%_50%]",
            "bg-[radial-gradient(circle,_#97ce4c_0%,_#1a1a24_70%)]",
            "opacity-20 animate-portal-spin"
          )}
          style={{ animationDuration: "20s" }}
        />
      </motion.div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 py-16 max-w-4xl mx-auto">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.5,
            ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
          }}
          className={cn(
            "font-creepster text-portal leading-tight",
            "text-shadow-portal",
            "text-5xl sm:text-6xl md:text-7xl lg:text-8xl"
          )}
        >
          Rick and Morty Explorer
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className={cn(
            "mt-4 font-orbitron text-starlight text-sm sm:text-base md:text-lg",
            "tracking-wide"
          )}
        >
          Wubba Lubba Dub-Dub! Explore the infinite dimensions.
        </motion.p>

        {/* Stats */}
        {loading ? (
          <div className="mt-12">
            <Spinner size="sm" />
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">
            <StatCounter
              value={counts?.characters ?? 0}
              label="Characters"
              icon={<Users className="w-5 h-5" />}
              delay={1000}
            />
            <StatCounter
              value={counts?.episodes ?? 0}
              label="Episodes"
              icon={<Tv className="w-5 h-5" />}
              delay={1200}
            />
            <StatCounter
              value={counts?.locations ?? 0}
              label="Locations"
              icon={<MapPin className="w-5 h-5" />}
              delay={1400}
            />
          </div>
        )}

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.6 }}
          className="mt-12 flex flex-col sm:flex-row items-center gap-4"
        >
          <Link
            to="/characters"
            className={cn(
              "flex items-center gap-2 px-6 py-3",
              "border-2 border-portal text-portal bg-transparent",
              "font-orbitron font-bold text-sm uppercase tracking-wider rounded",
              "transition-all duration-300",
              "hover:bg-portal hover:text-void hover:shadow-portal-glow-lg"
            )}
          >
            <Rocket className="w-4 h-4" />
            Explore Characters
          </Link>
          <Link
            to="/episodes"
            className={cn(
              "flex items-center gap-2 px-6 py-3",
              "border-2 border-portal text-portal bg-transparent",
              "font-orbitron font-bold text-sm uppercase tracking-wider rounded",
              "transition-all duration-300",
              "hover:bg-portal hover:text-void hover:shadow-portal-glow-lg"
            )}
          >
            <Tv className="w-4 h-4" />
            View Episodes
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
