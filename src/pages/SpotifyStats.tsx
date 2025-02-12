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

          {/* Error Handling */}
          {error && <p className="text-red-400 text-center">{error}</p>}

          {/* Top Artists Section */}
          <section className="w-full max-w-4xl bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
            <h2 className="text-2xl font-semibold mb-4">Top Artists</h2>

            {loading ? (
              <p className="text-center text-gray-400">Loading...</p>
            ) : (
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
            )}
          </section>
        </div>
      )}
    </Authenticator>
  );
};

export default SpotifyStats;
