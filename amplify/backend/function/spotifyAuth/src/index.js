const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

exports.handler = async (event) => {
    console.log("🚀 Lambda Invoked - Event Received:");
    console.log(JSON.stringify(event, null, 2));

    const GRAPHQL_ENDPOINT = process.env.APPSYNC_GRAPHQL_ENDPOINT;

    // ✅ Handle CORS Preflight (OPTIONS request)
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
        
        if (!authToken) {
            console.error("❌ Missing Authorization header");
            return {
                statusCode: 400,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, Authorization",
                },
                body: JSON.stringify({ error: "Missing Authorization token in headers" }),
            };
        }

        console.log("🔑 Received Authorization Token (JWT - trimmed):", authToken.substring(0, 20) + "...");

        // ✅ Parse incoming request body
        let body;
        try {
            body = JSON.parse(event.body);
        } catch (parseError) {
            console.error("❌ Error parsing request body:", parseError.message);
            return {
                statusCode: 400,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, Authorization",
                },
                body: JSON.stringify({ error: "Invalid JSON body" }),
            };
        }

        const { code, userId } = body; // Expect userId & code from frontend

        console.log("🔍 Extracted Parameters:");
        console.log("  - Code:", code);
        console.log("  - User ID:", userId);

        if (!code || !userId) {
            console.error("❌ Missing required fields:", { code, userId });
            return {
                statusCode: 400,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, Authorization",
                },
                body: JSON.stringify({ error: "Missing auth code or user ID" }),
            };
        }

        console.log("🔄 Requesting Spotify tokens...");

        // ✅ Get Spotify tokens
        const tokenResponse = await axios.post(
            "https://accounts.spotify.com/api/token",
            new URLSearchParams({
                grant_type: "authorization_code",
                code,
                redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
                client_id: process.env.SPOTIFY_CLIENT_ID,
                client_secret: process.env.SPOTIFY_CLIENT_SECRET
            }).toString(),
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );

        if (tokenResponse.status !== 200) {
            console.error("❌ Failed to get tokens from Spotify", tokenResponse.data);
            throw new Error("Failed to retrieve tokens");
        }

        const { access_token, refresh_token, expires_in } = tokenResponse.data;
        const expiresAt = new Date(Date.now() + expires_in * 1000).toISOString();

        console.log("✅ Tokens received from Spotify.");
        console.log("  - Access Token (trimmed):", access_token.substring(0, 20) + "...");
        console.log("  - Refresh Token (trimmed):", refresh_token.substring(0, 20) + "...");
        console.log("  - Expires At (ISO-8601 for AWSDateTime):", expiresAt);

        console.log("🚀 Sending Mutation to AppSync...");

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
                        expiresAt: expiresAt
                    }
                }
            },
            {
                headers: {
                    "Authorization": authToken, 
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("✅ Token stored via AppSync GraphQL.");

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
            body: JSON.stringify({ message: "Token stored successfully" }),
        };

    } catch (error) {
        console.error("❌ Error processing request:", error.message);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
            body: JSON.stringify({ error: error.message })
        };
    }
};
