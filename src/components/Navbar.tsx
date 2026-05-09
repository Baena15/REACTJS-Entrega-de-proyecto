import { Link, useLocation } from "react-router-dom";
import { Heart, Users, Tv } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/hooks/useFavorites";

const navLinks = [
  { to: "/characters", label: "Characters", icon: Users },
  { to: "/episodes", label: "Episodes", icon: Tv },
];

export default function Navbar() {
  const location = useLocation();
  const { characterFavorites, episodeFavorites } = useFavorites();
  const favCount = characterFavorites.length + episodeFavorites.length;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-[72px] glass portal-border-b">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <h1
            className={cn(
              "font-creepster text-2xl sm:text-3xl text-portal",
              "text-shadow-portal-sm hover:text-shadow-portal transition-all duration-300"
            )}
          >
            Rick and Morty Explorer
          </h1>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-1 sm:gap-2">
          {navLinks.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-md",
                  "font-orbitron font-medium text-xs sm:text-sm uppercase tracking-wider",
                  "transition-all duration-200",
                  isActive
                    ? "text-portal text-shadow-portal-sm"
                    : "text-starlight/70 hover:text-portal hover:text-shadow-portal-sm"
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}

          {/* Favorites link with badge */}
          <Link
            to="/favorites"
            className={cn(
              "relative flex items-center gap-1.5 px-3 py-2 rounded-md",
              "font-orbitron font-medium text-xs sm:text-sm uppercase tracking-wider",
              "transition-all duration-200",
              location.pathname === "/favorites"
                ? "text-portal text-shadow-portal-sm"
                : "text-starlight/70 hover:text-portal hover:text-shadow-portal-sm"
            )}
          >
            <Heart className="w-4 h-4" />
            <span className="hidden sm:inline">Favorites</span>
            {favCount > 0 && (
              <span
                className={cn(
                  "absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1",
                  "flex items-center justify-center",
                  "bg-crimson text-white text-[10px] font-orbitron font-bold rounded-full"
                )}
              >
                {favCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
