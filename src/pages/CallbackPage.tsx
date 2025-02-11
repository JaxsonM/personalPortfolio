import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, fetchAuthSession } from "@aws-amplify/auth";

// API Gateway URL that handles the Spotify OAuth token exchange
const API_GATEWAY_URL = "https://t1ihagcn2k.execute-api.us-east-1.amazonaws.com/dev/auth";

const CallbackPage = () => {
  const navigate = useNavigate();

  async function getAuthToken(): Promise<string | null> {
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
  }

  useEffect(() => {
    console.log("Entered callback page");

    const fetchUserAndSaveToken = async () => {
        try {
            const authUser = await getCurrentUser();
            const authToken = await getAuthToken();
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get("code");

            if (code && authUser && authToken) {
                console.log("Code Grabbed:", code);

                fetch(API_GATEWAY_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": authToken,
                    },
                    body: JSON.stringify({
                        action: "exchangeCode",
                        userId: authUser.username,
                        code: code,
                    }),
                })
                    .then((res) => res.json())
                    .then(() => {
                        console.log("Token successfully stored in DynamoDB.");
                        navigate("/spotifystats");
                    })
                    .catch((err) => {
                        console.error("Error storing token:", err);
                        navigate("/");
                    });
            } else {
                console.error("Missing code, user, or authToken.");
                navigate("/");
            }
        } catch (error) {
            console.error("Error getting user:", error);
            navigate("/");
        }
    };

    fetchUserAndSaveToken();
}, [navigate]);


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <p>Authenticating with Spotify...</p>
    </div>
  );
};

export default CallbackPage;