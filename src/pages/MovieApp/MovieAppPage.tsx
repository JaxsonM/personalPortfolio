// src/pages/MovieApp/MovieAppPage.tsx
import React, { useState } from "react";
import { get } from '@aws-amplify/api-rest';


interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
}

const API_NAME = "tmdbApi";
const API_PATH = "/tmdbsearch";

const MovieAppPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError(null);

    try {
        const response = await get({
            apiName: API_NAME,
            path: `${API_PATH}?query=${encodeURIComponent(searchTerm)}`,
          });
          console.log(response)
      const parsed = typeof response === "string" ? JSON.parse(response) : response;

      setResults(parsed.results || []);
    } catch (err) {
      console.error("TMDb search failed:", err);
      setError("Failed to fetch movie data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🎬 Search for Movies</h1>

      <div className="flex items-center gap-2 mb-4">
        <input
          className="border px-3 py-2 rounded w-full"
          placeholder="Type a movie name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <ul className="grid grid-cols-2 gap-4">
        {results.map((movie) => (
          <li key={movie.id} className="border p-3 rounded">
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                  : "/placeholder-movie.png"
              }
              alt={movie.title}
              className="w-full h-auto mb-2"
            />
            <h2 className="font-semibold">{movie.title}</h2>
            <p className="text-sm text-gray-600 line-clamp-3">
              {movie.overview}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MovieAppPage;
