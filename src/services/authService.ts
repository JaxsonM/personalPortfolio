import { fetchAuthSession } from "@aws-amplify/auth";

/**
 * Retrieves the Cognito authentication token (ID token) for the current session.
 * @returns {Promise<string | null>} The Cognito ID token as a string, or null if unavailable.
 */
export const getCognitoAuthToken = async (): Promise<string | null> => {
  try {
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken?.toString();

    if (!idToken) {
      console.error("❌ No ID token found in session.");
      return null;
    }

    return idToken;
  } catch (error) {
    console.error("❌ Error fetching Cognito authentication token:", error);
    return null;
  }
};