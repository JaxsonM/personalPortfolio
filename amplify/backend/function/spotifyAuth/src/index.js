const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

const GRAPHQL_ENDPOINT = process.env.APPSYNC_GRAPHQL_ENDPOINT;
const TOKEN_REFRESH_URL = "https://accounts.spotify.com/api/token";
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_API_URL = "https://api.spotify.com/v1/me/top/artists?limit=40";

exports.handler = async (event) => {
    console.log("🚀 Lambda Invoked - Event Received:");
    console.log(JSON.stringify(event, null, 2));

    if (event.httpMethod === "OPTIONS") {
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
            body: JSON.stringify({ message: "CORS preflight successful" }),
        };
    }

    try {
        const authToken = event.headers?.Authorization || event.headers?.authorization;
        if (!authToken) return errorResponse(400, "Missing Authorization token in headers");

        console.log("🔑 Received Authorization Token (JWT - trimmed):", authToken.substring(0, 20) + "...");

        let body;
        try {
            body = JSON.parse(event.body);
        } catch (parseError) {
            return errorResponse(400, "Invalid JSON body");
        }

        const { action, userId, code } = body;
        if (!userId) return errorResponse(400, "Missing user ID");

        switch (action) {
            case "exchangeCode":
                return await exchangeSpotifyCode(userId, code, authToken);
            case "getTopArtists":
                return await fetchTopArtists(userId, authToken);
            default:
                return errorResponse(400, "Invalid action");
        }
    } catch (error) {
        console.error("❌ Error processing request:", error.message);
        return errorResponse(500, error.message);
    }
};

// ✅ Function to Retrieve Access Token from AppSync
async function getAccessToken(userId, authToken) {
    console.log("🔍 Fetching Spotify tokens for user:", userId);

    const query = `
    query SpotifyUserTokensByUserId($userId: String!, $limit: Int) {
        spotifyUserTokensByUserId(userId: $userId, limit: $limit) {
            items {
                id
                accessToken
                refreshToken
                expiresAt
            }
        }
    }`;

    console.log("📡 Sending GraphQL request to fetch tokens...");

    let queryResponse;
    try {
        queryResponse = await axios.post(
            GRAPHQL_ENDPOINT,
            { query, variables: { userId, limit: 1 } },
            { headers: { Authorization: authToken, "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("❌ GraphQL Query Failed:", error.response?.data || error.message);
        return null;
    }

    console.log("📦 GraphQL Response:", JSON.stringify(queryResponse.data, null, 2));

    if (!queryResponse.data?.data?.spotifyUserTokensByUserId?.items.length) {
        console.error("❌ No Spotify token found for user");
        return null;
    }

    let { accessToken, refreshToken, expiresAt } = queryResponse.data.data.spotifyUserTokensByUserId.items[0];

    return accessToken;
}


// ✅ Function to Fetch Top Artists
async function fetchTopArtists(userId, authToken) {
    console.log("📡 Fetching top artists for user:", userId);

    let accessToken = await getAccessToken(userId, authToken);
    if (!accessToken) return errorResponse(404, "No valid access token found");
    console.log("✅ Access token secured.");

    try {
        console.log("🎵 Fetching top artists from Spotify...");
        const response = await axios.get(SPOTIFY_API_URL, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        return successResponse(
            response.data.items.map((artist) => ({
                name: artist.name,
                image: artist.images[0]?.url || "",
            }))
        );
    } catch (error) {
        if (error.response && error.response.status === 401) {
            console.warn("⚠️ Access token expired! Attempting to refresh...");

            accessToken = await refreshSpotifyToken(userId, authToken);
            if (!accessToken) return errorResponse(401, "Failed to refresh access token");
            console.log("NEWWWW TOKEN HERE NEW REQUEST WITH NEW TOKEN")
            console.log("New access token:", accessToken);

            console.log("🔄 Retrying request with new access token...");
            try {
                const retryResponse = await axios.get(SPOTIFY_API_URL, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });

                return successResponse(
                    retryResponse.data.items.map((artist) => ({
                        name: artist.name,
                        image: artist.images[0]?.url || "",
                    }))
                );
            } catch (retryError) {
                console.error("❌ Failed even after token refresh:", retryError.message);
                return errorResponse(500, "Failed to fetch top artists after token refresh");
            }
        }

        console.error("❌ Error fetching top artists:", error.message);
        return errorResponse(500, "Error fetching top artists");
    }
}

// ✅ Function to Get Refresh Token
async function getRefreshToken(userId, authToken) {
    console.log(`🔍 Retrieving refresh token for user: ${userId}`);

    const query = `
    query SpotifyUserTokensByUserId($userId: String!, $limit: Int) {
        spotifyUserTokensByUserId(userId: $userId, limit: $limit) {
            items {
                accessToken
                refreshToken
                expiresAt
            }
        }
    }`;

    try {
        const response = await axios.post(
            GRAPHQL_ENDPOINT,
            {
                query,
                variables: { userId, limit: 1 },
            },
            {
                headers: {
                    Authorization: authToken,
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.data?.data?.spotifyUserTokensByUserId?.items.length) {
            console.error("❌ No stored refresh token found for user");
            return null;
        }

        const { refreshToken } = response.data.data.spotifyUserTokensByUserId.items[0];

        if (!refreshToken) {
            console.error("❌ Missing refresh token in stored data");
            return null;
        }

        console.log("✅ Refresh token retrieved successfully");
        return refreshToken;
    } catch (error) {
        console.error("❌ Failed to fetch refresh token:", error.response?.data || error.message);
        return null;
    }
}

// ✅ Function to Update Access Token in AppSync
async function updateAccessToken(userId, newAccessToken, newExpiresAt, authToken) {
    console.log(`🔄 Updating access token for user: ${userId}`);

    // Fetch the ID of the existing record first
    const query = `
    query SpotifyUserTokensByUserId($userId: String!, $limit: Int) {
        spotifyUserTokensByUserId(userId: $userId, limit: $limit) {
            items {
                id
                accessToken
                refreshToken
                expiresAt
            }
        }
    }`;

    let queryResponse;
    try {
        queryResponse = await axios.post(
            GRAPHQL_ENDPOINT,
            { query, variables: { userId, limit: 1 } },
            { headers: { Authorization: authToken, "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("❌ Failed to fetch existing token ID:", error.response?.data || error.message);
        return null;
    }

    if (!queryResponse.data?.data?.spotifyUserTokensByUserId?.items.length) {
        console.error("❌ No existing token found to update.");
        return null;
    }

    const existingTokenId = queryResponse.data.data.spotifyUserTokensByUserId.items[0].id;

    console.log("🆔 Existing token ID:", existingTokenId);

    // Update the token in AppSync
    const mutation = `
    mutation UpdateSpotifyUserToken($input: UpdateSpotifyUserTokenInput!) {
        updateSpotifyUserToken(input: $input) {
            id
            userId
            accessToken
            expiresAt
        }
    }`;

    try {
        const mutationResponse = await axios.post(
            GRAPHQL_ENDPOINT,
            {
                query: mutation,
                variables: { input: { id: existingTokenId, userId, accessToken: newAccessToken, expiresAt: newExpiresAt } },
            },
            {
                headers: { Authorization: authToken, "Content-Type": "application/json" },
            }
        );

        console.log("✅ Access token updated successfully in AppSync!", mutationResponse.data);
        return newAccessToken;
    } catch (error) {
        console.error("❌ Failed to update access token in AppSync:", error.response?.data || error.message);
        return null;
    }
}


// ✅ Function to Refresh Spotify Access Token
// ✅ Function to Refresh Spotify Access Token
async function refreshSpotifyToken(userId, authToken) {
    console.log(`🔄 Refreshing Spotify token for user: ${userId}`);

    const refreshToken = await getRefreshToken(userId, authToken);
    if (!refreshToken) return null;

    try {
        const refreshResponse = await axios.post(
            TOKEN_REFRESH_URL,
            new URLSearchParams({
                grant_type: "refresh_token",
                refresh_token: refreshToken,
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
            }).toString(),
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );

        if (refreshResponse.status !== 200) {
            console.error("❌ Token refresh failed:", refreshResponse.data);
            return null;
        }

        const newAccessToken = refreshResponse.data.access_token;
        const newExpiresAt = new Date(Date.now() + refreshResponse.data.expires_in * 1000).toISOString();

        console.log("✅ New Access Token successfully refreshed!");

        const updatedToken = await updateAccessToken(userId, newAccessToken, newExpiresAt, authToken);

        if (!updatedToken) {
            console.error("❌ Token update failed. This may cause repeated refreshes.");
        } else {
            console.log("🔄 Token should now be persisted correctly.");
        }

        return updatedToken;
    } catch (error) {
        console.error("❌ Failed to refresh token:", error.response?.data || error.message);
        return null;
    }
}



// ✅ Function to Exchange Spotify Code for Access Token
async function exchangeSpotifyCode(userId, code, authToken) {
    if (!code) return errorResponse(400, "Missing auth code");

    console.log("🔄 Requesting Spotify tokens...");
    const tokenResponse = await axios.post(
        TOKEN_REFRESH_URL,
        new URLSearchParams({
            grant_type: "authorization_code",
            code,
            redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
        }).toString(),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
    console.log("Response from code exchange:", tokenResponse);

    if (tokenResponse.status !== 200) {
        return errorResponse(500, "Failed to retrieve tokens from Spotify");
    }

    const { access_token, refresh_token, expires_in } = tokenResponse.data;
    const expiresAt = new Date(Date.now() + expires_in * 1000).toISOString();

    console.log("✅ Tokens received and being stored...");

    const mutation = `
    mutation CreateSpotifyUserToken($input: CreateSpotifyUserTokenInput!) {
        createSpotifyUserToken(input: $input) {
            id
            userId
            accessToken
            refreshToken
            expiresAt
        }
    }`;

    await axios.post(
        GRAPHQL_ENDPOINT,
        {
            query: mutation,
            variables: {
                input: {
                    id: uuidv4(),
                    userId,
                    accessToken: access_token,
                    refreshToken: refresh_token,
                    expiresAt: expiresAt,
                },
            },
        },
        {
            headers: {
                Authorization: authToken,
                "Content-Type": "application/json",
            },
        }
    );

    return successResponse({ message: "Token stored successfully" });
}

// ✅ Utility function for success response
function successResponse(data) {
    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
        body: JSON.stringify(data),
    };
}

// ✅ Utility function for error response
function errorResponse(statusCode, message) {
    return {
        statusCode,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
        body: JSON.stringify({ error: message }),
    };
}
