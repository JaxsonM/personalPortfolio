import React, { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/api";
import { getCurrentUser } from "@aws-amplify/auth";
import { Authenticator, Button } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { createSpotifyUserToken } from "../graphql/mutations";
import { spotifyUserTokensByUserId } from "../graphql/queries"; 

const API_URL = "https://api.spotify.com/v1/me/top/artists?limit=10";
const REDIRECT_URI = encodeURIComponent("http://localhost:3000/callback");
const CLIENT_ID = "00ed30d4fa214614be034225cd52f0fb";
const TOKEN_REFRESH_URL = "https://accounts.spotify.com/api/token";

// ✅ Create GraphQL Client
const client = generateClient();

const SpotifyStats: React.FC = () => {
  const [topArtists, setTopArtists] = useState<{ name: string; image: string }[]>([]);
  const [user, setUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const authUser = await getCurrentUser();
        setUser(authUser);
      } catch {
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (!user) return;

    

    const fetchTokensFromDB = async () => {
      try {
        console.log("Fetching tokens for user:", user.username);
    
        const result = await client.graphql({
          query: spotifyUserTokensByUserId, 
          variables: { userId: "jaxson" },
        });
    
        console.log("DynamoDB Query Result:", JSON.stringify(result, null, 2)); // 🔍 Log Full Response
    
        const tokens = result.data?.spotifyUserTokensByUserId?.items || [];
        
        if (tokens.length > 0) {
          setAccessToken(tokens[0]?.accessToken || null);
          setRefreshToken(tokens[0]?.refreshToken || null);
        } else {
          console.log("No token found for this user.");
          redirectToSpotifyAuth();
        }
      } catch (error) {
        console.error("Error fetching tokens from DynamoDB:", error);
      }
    };
    

    console.log("LOGGING HERE")
    fetchTokensFromDB();
  }, [user]);

  const redirectToSpotifyAuth = () => {
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user-top-read&response_type=code&show_dialog=true`;
  };

  const refreshAccessToken = async () => {
    // if (!refreshToken) {
    //   console.error("No refresh token available.");
    //   redirectToSpotifyAuth();
    //   return;
    // }

    // console.log("Refreshing Spotify token...");
    // const authHeader = btoa(`${CLIENT_ID}:${process.env.REACT_APP_SPOTIFY_CLIENT_SECRET}`);
    // const response = await fetch(TOKEN_REFRESH_URL, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/x-www-form-urlencoded",
    //     Authorization: `Basic ${authHeader}`,
    //   },
    //   body: new URLSearchParams({
    //     grant_type: "refresh_token",
    //     refresh_token: refreshToken,
    //   }),
    // });

    // if (!response.ok) {
    //   console.error("Failed to refresh access token.");
    //   redirectToSpotifyAuth();
    //   return;
    // }

    // const data = await response.json();
    // const newAccessToken = data.access_token;

    // // Update state and DynamoDB
    // setAccessToken(newAccessToken);

    // try {
    //   await client.graphql({
    //     query: createSpotifyUserToken,
    //     variables: {
    //       input: {
    //         userId: user.username,
    //         accessToken: newAccessToken,
    //         refreshToken,
    //       },
    //     },
    //   });
    //   console.log("Token successfully refreshed and stored in DynamoDB.");
    // } catch (error) {
    //   console.error("Error storing refreshed token:", error);
    // }
  };

  const fetchTopArtists = async (): Promise<void> => {
    if (!accessToken) return;
    console.log("Fetching top artists with accescode: ", accessToken);
  
    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
  
      if (response.status === 401) {
        console.warn("Spotify token expired. Attempting refresh...");
        // await refreshAccessToken();
        // return fetchTopArtists(); // Retry request after refreshing token
      }
  
      const data = await response.json();
      if (data.items) {
        setTopArtists(
          data.items.map((artist: any) => ({
            name: artist.name,
            image: artist.images[0]?.url || "",
          }))
        );
      }
    } catch (err) {
      console.error("Error fetching top artists:", err);
    }
  };
  

  useEffect(() => {
    if (accessToken) {
      fetchTopArtists();
    }
  }, [accessToken]);

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
