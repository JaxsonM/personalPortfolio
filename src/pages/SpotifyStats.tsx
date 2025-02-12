import React from "react";
import { Authenticator, Button } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { useSpotify } from "../hooks/useSpotify";

const SpotifyStats: React.FC = () => {
  const { user, topArtists, loading, error } = useSpotify();

  return (
    <Authenticator>
      {({ signOut }) => (
        <div className="flex flex-col items-center p-6 min-h-screen bg-gray-900 text-white">
          {/* Navbar */}
          <header className="w-full max-w-4xl flex justify-between items-center py-4 px-6 bg-gray-800 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold">Spotify Stats</h1>
            {/* Authentication Section */}
          <div className="flex items-center gap-3 ">
            <img
              src={user?.avatar || "/default-avatar.png"}
              alt="User Avatar"
              className="w-10 h-10 rounded-full border-2 border-white"
            />
            <p className="text-gray-300">Signed in as {user?.username}</p>
          </div>
            <Button onClick={signOut} className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition duration-200">
              Sign Out
            </Button>
          </header>

          {/* Welcome Section */}
          <section className="w-full max-w-4xl text-center py-6">
            <h1 className="text-3xl font-bold">Your Spotify Stats</h1>
            <p className="text-gray-400 mt-2">View your top artists, tracks, and more!</p>
          </section>

          

          {/* Error Handling */}
          {error && (
            <div className="bg-red-700 text-white p-3 rounded-md w-full max-w-md text-center">
              {error}
            </div>
          )}

          {/* Top Artists Section */}
          <section className="w-full max-w-4xl bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
            <h2 className="text-2xl font-semibold mb-4">Top Artists</h2>

            {loading ? (
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
                      <img src={artist.image} alt={artist.name} className="w-24 h-24 rounded-full mb-2" />
                      <p className="text-center text-gray-300">{artist.name}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-400">Login to see your top artists.</p>
                )}
              </div>
            )}
          </section>

          {/* Future Sections Placeholders */}
          <section className="w-full max-w-4xl bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
            <h2 className="text-2xl font-semibold mb-4">Top Tracks</h2>
            <p className="text-gray-400">Coming Soon...</p>
          </section>

          <section className="w-full max-w-4xl bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
            <h2 className="text-2xl font-semibold mb-4">Listening History</h2>
            <p className="text-gray-400">Coming Soon...</p>
          </section>
        </div>
      )}
    </Authenticator>
  );
};

export default SpotifyStats;
