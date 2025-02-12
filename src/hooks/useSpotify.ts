import { useEffect, useState } from "react";
import { getCurrentUser } from "@aws-amplify/auth";
import { getCognitoAuthToken } from "../services/authService";
import { checkIfUserExistsInSpotifyTable, fetchTopArtists } from "../services/spotifyService";

const CLIENT_ID = "00ed30d4fa214614be034225cd52f0fb";
const REDIRECT_URI = encodeURIComponent("http://jaxsoncodes.com/callback");

/**
 * Custom hook for fetching authenticated Spotify user data.
 */
export const useSpotify = () => {
  const [user, setUser] = useState<any>(null);
  const [topArtists, setTopArtists] = useState<{ name: string; image: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Redirects the user to the Spotify authentication page.
   */
  const redirectToSpotifyAuth = () => {
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user-top-read&response_type=code&show_dialog=true`;
  };

  useEffect(() => {
    const fetchUserAndArtists = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log("🔄 Fetching authenticated user...");
        const authUser = await getCurrentUser();
        setUser(authUser);

        if (!authUser) {
          console.warn("⚠️ No authenticated user found!");
          return;
        }

        console.log("✅ User found:", authUser.username);
        console.log("🔄 Checking if user exists in Spotify table...");

        const authToken = await getCognitoAuthToken();
        if (!authToken) {
          setError("Failed to retrieve authentication token.");
          return;
        }

        const userExists = await checkIfUserExistsInSpotifyTable(authUser.username);
        if (!userExists) {
          console.warn("🚨 User does not exist in Spotify table or is missing a refresh token. Redirecting...");
          redirectToSpotifyAuth();
          return;
        }

        console.log("🔄 Fetching top artists from backend...");
        const artists = await fetchTopArtists(authUser.username, authToken);
        setTopArtists(artists);
      } catch (error) {
        console.error("❌ Error fetching user or top artists:", error);
        setError("An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndArtists();
  }, []);

  return { user, topArtists, loading, error };
};
