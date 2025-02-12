import { generateClient } from "aws-amplify/api";
import { spotifyUserTokensByUserId } from "../graphql/queries";

const client = generateClient();

/**
 * Checks if a user exists in the Spotify AppSync table.
 * @param {string} userId - The user's unique ID.
 * @returns {Promise<boolean>} - Returns true if the user exists, false otherwise.
 */
export const checkIfUserExistsInSpotifyTable = async (userId: string): Promise<boolean> => {
  console.log("🔍 Checking if user exists in Spotify table via GraphQL...");

  try {
    const response = await client.graphql({
      query: spotifyUserTokensByUserId,
      variables: { userId, limit: 1 },
    });

    const items = response.data?.spotifyUserTokensByUserId?.items || [];

    if (items.length === 0) {
      console.warn("❌ User not found in Spotify table.");
      return false;
    }

    console.log("✅ User exists and has a refresh token.");
    return true;
  } catch (error) {
    console.error("❌ Error checking user via GraphQL:", error);
    return false;
  }
};


const API_GATEWAY_URL = "https://t1ihagcn2k.execute-api.us-east-1.amazonaws.com/dev/auth";

/**
 * Fetches the top artists for a user from the backend.
 * @param {string} userId - The user's unique ID.
 * @param {string} authToken - The user's authentication token.
 * @returns {Promise<{ name: string; image: string }[]>} - The list of top artists.
 */
export const fetchTopArtists = async (userId: string, authToken: string): Promise<{ name: string; image: string }[]> => {
  console.log("📡 Fetching top artists from Lambda function...");

  try {
    const response = await fetch(API_GATEWAY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken,
      },
      body: JSON.stringify({
        action: "getTopArtists",
        userId,
      }),
    });

    if (!response.ok) {
      console.error("❌ Error fetching top artists. Status:", response.status);
      return [];
    }

    const data = await response.json();
    console.log("✅ Successfully fetched top artists!");
    return data;
  } catch (error) {
    console.error("❌ Error fetching top artists from backend:", error);
    return [];
  }
};
