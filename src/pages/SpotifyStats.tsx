import React, { useEffect, useState } from "react";
import { getCurrentUser, fetchAuthSession } from "@aws-amplify/auth";
import { Authenticator, Button } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

const API_GATEWAY_URL = "https://t1ihagcn2k.execute-api.us-east-1.amazonaws.com/dev/auth";

const API_URL = "https://api.spotify.com/v1/me/top/artists?limit=10";
const REDIRECT_URI = encodeURIComponent("http://localhost:3000/callback");
//const REDIRECT_URI = encodeURIComponent("http://jaxsoncodes/callback");
const CLIENT_ID = "00ed30d4fa214614be034225cd52f0fb";

const SpotifyStats: React.FC = () => {
  const [topArtists, setTopArtists] = useState<{ name: string; image: string }[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUserAndArtists = async () => {
      try {
        console.log("🔄 Fetching authenticated user...");
        const authUser = await getCurrentUser();
        setUser(authUser);

        if (!authUser) {
          console.warn("⚠️ No authenticated user found!");
          return;
        }

        console.log("✅ User found:", authUser.username);
        console.log("🔄 Fetching top artists from backend...");

        const authToken = await getAuthToken();
        if (!authToken) {
          console.error("❌ Failed to retrieve authentication token.");
          return;
        }
        

        await fetchTopArtists(authUser.username, authToken);
      } catch (error) {
        console.error("❌ Error fetching user or top artists:", error);
      }
    };

    fetchUserAndArtists();
  }, []);

  const getAuthToken = async (): Promise<string | null> => {
    try {
      const session = await fetchAuthSession();
      if (!session.tokens || !session.tokens.idToken) {
        console.error("No ID token found in session");
        return null;
      }
      return session.tokens.idToken.toString(); // Convert JWT to string
    } catch (error) {
      console.error("Error fetching auth token:", error);
      return null;
    }
  };
  const redirectToSpotifyAuth = () => {
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user-top-read&response_type=code&show_dialog=true`;
  };


  const fetchTopArtists = async (userId: string, authToken: string): Promise<void> => {
    console.log("📡 Fetching top artists from Lambda function...");
    //redirectToSpotifyAuth();

    try {
      const response = await fetch(API_GATEWAY_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken, // Pass Cognito auth token
        },
        body: JSON.stringify({
          action: "getTopArtists",
          userId,
        }),
      });

      if (!response.ok) {
        console.error("❌ Error fetching top artists. Status:", response.status);
        return;
      }

      const data = await response.json();
      setTopArtists(data);
      console.log("✅ Successfully fetched top artists!");
    } catch (err) {
      console.error("❌ Error fetching top artists from backend:", err);
    }
  };

  return (
    <Authenticator>
      {({ signOut }) => (
        <div className="flex flex-col items-center p-6 min-h-screen bg-gray-900 text-white">
          <header className="w-full max-w-4xl text-center py-6">
            <h1 className="text-3xl font-bold">Your Spotify Stats</h1>
            <p className="text-gray-400 mt-2">View your top artists, tracks, and more!</p>
          </header>

          {/* Authentication Section */}
          <div className="mb-6">
            <p className="text-gray-300">Signed in as {user?.username}</p>
            <Button onClick={signOut} className="bg-red-500 px-4 py-2 rounded mt-2 hover:bg-red-600">
              Sign Out
            </Button>
          </div>

          {/* Top Artists Section */}
          <section className="w-full max-w-4xl bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
            <h2 className="text-2xl font-semibold mb-4">Top Artists</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {topArtists.length > 0 ? (
                topArtists.map((artist, index) => (
                  <div key={index} className="flex flex-col items-center bg-gray-700 p-4 rounded-lg">
                    <img src={artist.image} alt={artist.name} className="w-24 h-24 rounded-full mb-2" />
                    <p className="text-center text-gray-300">{artist.name}</p>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400">Login to see your top artists.</p>
              )}
            </div>
          </section>
        </div>
      )}
    </Authenticator>
  );
};

export default SpotifyStats;
