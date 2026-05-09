import { Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import HomePage from "@/pages/Home";
import CharactersPage from "@/pages/Characters";
import CharacterDetailPage from "@/pages/CharacterDetail";
import EpisodesPage from "@/pages/Episodes";
import EpisodeDetailPage from "@/pages/EpisodeDetail";
import FavoritesPage from "@/pages/Favorites";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/characters" element={<CharactersPage />} />
        <Route path="/characters/:id" element={<CharacterDetailPage />} />
        <Route path="/episodes" element={<EpisodesPage />} />
        <Route path="/episodes/:id" element={<EpisodeDetailPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
      </Routes>
    </Layout>
  );
}
