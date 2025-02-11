const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

const GRAPHQL_ENDPOINT = process.env.APPSYNC_GRAPHQL_ENDPOINT;
const TOKEN_REFRESH_URL = "https://accounts.spotify.com/api/token";
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_API_URL = "https://api.spotify.com/v1/me/top/artists?limit=10";

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

// ✅ Function to Fetch Top Artists from AppSync
async function fetchTopArtists(userId, authToken) {
    console.log("🔍 Fetching Spotify tokens for user:", userId);

    const query = `
    query SpotifyUserTokensByUserId($userId: String!, $limit: Int) {
        spotifyUserTokensByUserId(userId: $userId, limit: $limit) {
            items {
                id
                accessToken
                refreshToken
                expiresAt
                createdAt
                updatedAt
            }
        }
    }`;


    console.log("📡 Sending GraphQL request to fetch tokens...");

    let queryResponse;
    try {
        queryResponse = await axios.post(
            GRAPHQL_ENDPOINT,
            {
                query,
                variables: { userId, limit: 1, sortDirection: "DESC" },  // Ensure correct sorting
            },
            {
                headers: {
                    Authorization: authToken,
                    "Content-Type": "application/json",
                },
            }
        );
    } catch (error) {
        console.error("❌ GraphQL Query Failed:", error.response?.data || error.message);
        return errorResponse(500, "Failed to fetch tokens from AppSync");
    }

    console.log("📦 GraphQL Response:", JSON.stringify(queryResponse.data, null, 2));

    if (!queryResponse.data?.data?.spotifyUserTokensByUserId?.items.length) {
        console.error("❌ No Spotify token found for user");
        return errorResponse(404, "No token found for user");
    }

    let { accessToken, refreshToken, expiresAt } = queryResponse.data.data.spotifyUserTokensByUserId.items[0];

    console.log("🔄 Checking if token is expired...");
    const currentTime = Date.now();

    if (currentTime >= new Date(expiresAt).getTime()) {
        console.log("🔄 Token expired, refreshing...");

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
            console.error("❌ Failed to refresh token", refreshResponse.data);
            return errorResponse(401, "Failed to refresh token");
        }

        accessToken = refreshResponse.data.access_token;
        expiresAt = new Date(Date.now() + refreshResponse.data.expires_in * 1000).toISOString();

        console.log("✅ Token refreshed successfully");

        // 🔄 Update token in AppSync
        const mutation = `
        mutation UpdateSpotifyUserToken($input: UpdateSpotifyUserTokenInput!) {
            updateSpotifyUserToken(input: $input) {
                userId
                accessToken
                expiresAt
            }
        }`;

        await axios.post(
            GRAPHQL_ENDPOINT,
            {
                query: mutation,
                variables: { input: { userId, accessToken, expiresAt } },
            },
            {
                headers: {
                    Authorization: authToken,
                    "Content-Type": "application/json",
                },
            }
        );
    }

    console.log("📡 Fetching top artists from Spotify...");
    const response = await axios.get(SPOTIFY_API_URL, { headers: { Authorization: `Bearer ${accessToken}` } });

    return successResponse(
        response.data.items.map((artist) => ({
            name: artist.name,
            image: artist.images[0]?.url || "",
        }))
    );
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
        headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type, Authorization" },
        body: JSON.stringify(data),
    };
}

// ✅ Utility function for error response
function errorResponse(statusCode, message) {
    return {
        statusCode,
        headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type, Authorization" },
        body: JSON.stringify({ error: message }),
    };
}
