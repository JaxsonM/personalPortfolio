import React, { useEffect, useState } from "react";
import { Authenticator, Button } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { getCurrentUser, signOut } from "@aws-amplify/auth";
import { useSpotify } from "../hooks/useSpotify";

const SpotifyStats: React.FC = () => {
  const { user, topArtists, loading, error } = useSpotify();
  const [authUser, setAuthUser] = useState<any>(null);
  const [showSignIn, setShowSignIn] = useState(false);

  const placeholderArtists = [
    { name: "Artist One", image: "/placeholder1.png" },
    { name: "Artist Two", image: "/placeholder2.png" },
    { name: "Artist Three", image: "/placeholder3.png" },
    { name: "Artist Four", image: "/placeholder4.png" },
    { name: "Artist Five", image: "/placeholder5.png" },
    { name: "Artist Six", image: "/placeholder6.png" },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log("🔄 Fetching authenticated user...");
        const userData = await getCurrentUser();
        console.log("✅ Authenticated User:", userData);
        setAuthUser(userData);
      } catch (error) {
        console.error("⚠️ No authenticated user found:", error);
        setAuthUser(null);
      }
    };

    fetchUser();
  }, []);

  // Handle user sign out
  const handleSignOut = async () => {
    try {
      await signOut();
      console.log("👋 User signed out successfully!");
      setAuthUser(null); // Clear user state after sign out
    } catch (error) {
      console.error("⚠️ Error signing out:", error);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-gray-900 text-white relative">
      {/* Sign-In Modal (Overlay) */}
      {showSignIn && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-70 z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg relative z-50 w-96">
            <Authenticator />
            <button
              onClick={() => setShowSignIn(false)}
              className="mt-4 bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition duration-200 w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Navbar */}
      <header className="w-full max-w-4xl flex justify-between items-center py-4 px-6 bg-gray-800 rounded-lg shadow-lg z-10">
        <h1 className="text-2xl font-bold">Spotify Stats</h1>
        <div className="flex items-center gap-3">
          {authUser ? (
            <>
              <img
                src={user?.avatar || "/default-avatar.png"}
                alt="User Avatar"
                className="w-10 h-10 rounded-full border-2 border-white"
              />
              <p className="text-gray-300">Signed in as {authUser?.username}</p>
              <Button
                onClick={handleSignOut} // Correctly triggers sign out
                className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition duration-200"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setShowSignIn(true)}
              className="bg-green-500 px-4 py-2 rounded hover:bg-green-600 transition duration-200"
            >
              Sign In
            </Button>
          )}
        </div>
      </header>

      {/* Welcome Section */}
      <section className="w-full max-w-4xl text-center py-6">
        <h1 className="text-3xl font-bold">Your Spotify Stats</h1>
        <p className="text-gray-400 mt-2">
          {authUser
            ? "View your top artists, tracks, and more!"
            : "Sign in to see personalized Spotify stats."}
        </p>
      </section>

      {/* Error Handling */}
      {error && authUser && (
        <div className="bg-red-700 text-white p-3 rounded-md w-full max-w-md text-center">
          {error}
        </div>
      )}

      {/* Top Artists Section */}
      <section className="w-full max-w-4xl bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-2xl font-semibold mb-4">Top Artists</h2>

        {authUser ? (
          loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-24 h-24 bg-gray-600 animate-pulse rounded-lg"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {topArtists.length > 0 ? (
                topArtists.map((artist, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center bg-gray-700 p-4 rounded-lg transform transition-transform duration-200 hover:scale-105"
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
                  No top artists found. Try again later.
                </p>
              )}
            </div>
          )
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {placeholderArtists.map((artist, index) => (
              <div
                key={index}
                className="flex flex-col items-center bg-gray-700 p-4 rounded-lg transform transition-transform duration-200 hover:scale-105"
              >
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="w-24 h-24 rounded-full mb-2"
                />
                <p className="text-center text-gray-300">{artist.name}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default SpotifyStats;
