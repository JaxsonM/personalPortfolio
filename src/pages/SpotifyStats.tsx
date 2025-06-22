import React, { useEffect, useState, useCallback } from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import { Hub } from "@aws-amplify/core";
import "@aws-amplify/ui-react/styles.css";
import { getCurrentUser, signOut } from "@aws-amplify/auth";
import { useSpotify } from "../hooks/useSpotify";

const SpotifyStats: React.FC = () => {
  const { topArtists, loading, error } = useSpotify();
  const [authUser, setAuthUser] = useState<any>(null);
  const [showSignIn, setShowSignIn] = useState(false);

  const fetchUser = useCallback(async () => {
    try {
      const userData = await getCurrentUser();
      setAuthUser(userData);
    } catch {
      setAuthUser(null);
    }
  }, []);

  // 1) On mount, load any existing session
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // 2) Auto‐close the modal whenever we successfully get a user
  useEffect(() => {
    if (authUser) {
      setShowSignIn(false);
    }
  }, [authUser]);

  // 3) Listen for Amplify Auth events (signedIn / signedOut)
  useEffect(() => {
    const listener = ({ payload: { event } }: any) => {
      if (event === "signedIn") {
        setShowSignIn(false);
        // reload so fetchUser() runs again and your UI updates
        window.location.reload();
      }
      if (event === "signOut") {
        setAuthUser(null);
      }
    };
    const remove = Hub.listen("auth", listener);
    return () => remove(); // clean up
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setAuthUser(null);
  };

  const placeholderArtists = [
    { name: "Artist One", image: "/placeholder1.png" },
    { name: "Artist Two", image: "/placeholder2.png" },
    { name: "Artist Three", image: "/placeholder3.png" },
    { name: "Artist Four", image: "/placeholder4.png" },
    { name: "Artist Five", image: "/placeholder5.png" },
    { name: "Artist Six", image: "/placeholder6.png" },
  ];

  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-gray-900 text-white relative">
      {/* Sign-In Modal */}
      {showSignIn && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-70 z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <Authenticator />
            <button
              onClick={() => setShowSignIn(false)}
              className="mt-4 bg-red-500 px-4 py-2 rounded hover:bg-red-600 w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Navbar */}
      <header className="w-full max-w-4xl flex justify-between items-center py-4 px-6 bg-gray-800 rounded-lg shadow-lg mb-6">
        <h1 className="text-2xl font-bold">Spotify Stats</h1>
        <div className="flex items-center gap-3">
          {authUser ? (
            <>
              <img
                src="/default-avatar.png"
                alt="User Avatar"
                className="w-10 h-10 rounded-full border-2 border-white"
              />
              <p>Signed in as {authUser.username}</p>
              <button
                onClick={handleSignOut}
                className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
              >
                Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowSignIn(true)}
              className="bg-green-500 px-4 py-2 rounded hover:bg-green-600"
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      {/* Welcome */}
      <section className="w-full max-w-4xl text-center py-6">
        <h2 className="text-3xl font-bold">Your Spotify Stats</h2>
        <p className="text-gray-400 mt-2">
          {authUser
            ? "View your top artists, tracks, and more!"
            : "Sign in to see personalized Spotify stats."}
        </p>
      </section>

      {/* Error */}
      {error && authUser && (
        <div className="bg-red-700 text-white p-3 rounded-md max-w-md text-center mb-6">
          {error}
        </div>
      )}

      {/* Top Artists */}
      <section className="w-full max-w-4xl bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold mb-4">Top Artists</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {authUser ? (
            loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-24 bg-gray-600 animate-pulse rounded-lg"
                />
              ))
            ) : topArtists.length > 0 ? (
              topArtists.map((artist, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center bg-gray-700 p-4 rounded-lg hover:scale-105 transition"
                >
                  <img
                    src={artist.image}
                    alt={artist.name}
                    className="w-24 h-24 rounded-full mb-2"
                  />
                  <p className="text-center text-gray-300">{artist.name}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400">
                No top artists found.
              </p>
            )
          ) : (
            placeholderArtists.map((artist, i) => (
              <div
                key={i}
                className="flex flex-col items-center bg-gray-700 p-4 rounded-lg hover:scale-105 transition"
              >
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="w-24 h-24 rounded-full mb-2"
                />
                <p className="text-center text-gray-300">{artist.name}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default SpotifyStats;
