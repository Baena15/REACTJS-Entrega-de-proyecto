export default function Footer() {
  return (
    <footer className="w-full bg-void border-t border-cosmic py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-asteroid text-sm font-inter">
          Data provided by{" "}
          <a
            href="https://rickandmortyapi.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-portal hover:text-shadow-portal-sm transition-all duration-200"
          >
            Rick and Morty API
          </a>
        </p>
        <p className="text-asteroid/50 text-xs mt-2 font-inter">
          A fan-made explorer for the multiverse
        </p>
      </div>
    </footer>
  );
}
