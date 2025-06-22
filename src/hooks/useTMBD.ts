import { useState } from "react";

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export function useTMDb() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchMovies = async (query: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
      );

      if (!res.ok) throw new Error("Failed to fetch movie data");

      const data = await res.json();
      console.log("🔍 Full TMDb API response:", data);
      setResults(data.results);
    } catch (err) {
      console.error(err);
      setError("Error fetching movies.");
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, error, searchMovies };
}
