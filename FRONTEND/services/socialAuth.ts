import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import * as Crypto from "expo-crypto";

// Complete the auth session
WebBrowser.maybeCompleteAuthSession();

// Google OAuth configuration
const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID"; // Replace with your Google Client ID
const GOOGLE_REDIRECT_URI = AuthSession.makeRedirectUri({
  scheme: "your-app-scheme", // Replace with your app scheme
});

// Apple OAuth configuration
const APPLE_CLIENT_ID = "YOUR_APPLE_CLIENT_ID"; // Replace with your Apple Client ID
const APPLE_REDIRECT_URI = AuthSession.makeRedirectUri({
  scheme: "your-app-scheme", // Replace with your app scheme
});

export interface SocialAuthResult {
  success: boolean;
  user?: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
  };
  error?: string;
}

export const googleSignIn = async (): Promise<SocialAuthResult> => {
  try {
    // Create auth request
    const request = new AuthSession.AuthRequest({
      clientId: GOOGLE_CLIENT_ID,
      scopes: ["openid", "profile", "email"],
      redirectUri: GOOGLE_REDIRECT_URI,
      responseType: AuthSession.ResponseType.Code,
      extraParams: {
        access_type: "offline",
      },
    });

    // Start auth session
    const result = await request.promptAsync({
      authorizationEndpoint: "https://accounts.google.com/oauth/authorize",
    });

    if (result.type === "success" && result.params.code) {
      // Exchange code for tokens
      const tokenResponse = await AuthSession.exchangeCodeAsync(
        {
          clientId: GOOGLE_CLIENT_ID,
          code: result.params.code,
          redirectUri: GOOGLE_REDIRECT_URI,
          extraParams: {
            code_verifier: request.codeVerifier || "",
          },
        },
        {
          tokenEndpoint: "https://oauth2.googleapis.com/token",
        }
      );

      // Get user info
      const userInfoResponse = await fetch(
        `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenResponse.accessToken}`
      );
      const userInfo = await userInfoResponse.json();

      return {
        success: true,
        user: {
          id: userInfo.id,
          email: userInfo.email,
          name: userInfo.name,
          avatar: userInfo.picture,
        },
      };
    } else {
      return {
        success: false,
        error: "Google sign-in was cancelled or failed",
      };
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Google sign-in failed",
    };
  }
};

export const appleSignIn = async (): Promise<SocialAuthResult> => {
  try {
    // Create auth request
    const request = new AuthSession.AuthRequest({
      clientId: APPLE_CLIENT_ID,
      scopes: ["name", "email"],
      redirectUri: APPLE_REDIRECT_URI,
      responseType: AuthSession.ResponseType.Code,
      responseMode: AuthSession.ResponseMode.FormPost,
      extraParams: {
        response_mode: "form_post",
      },
    });

    // Start auth session
    const result = await request.promptAsync({
      authorizationEndpoint: "https://appleid.apple.com/auth/authorize",
    });

    if (result.type === "success" && result.params.code) {
      // Exchange code for tokens
      const tokenResponse = await AuthSession.exchangeCodeAsync(
        {
          clientId: APPLE_CLIENT_ID,
          code: result.params.code,
          redirectUri: APPLE_REDIRECT_URI,
          extraParams: {
            code_verifier: request.codeVerifier || "",
          },
        },
        {
          tokenEndpoint: "https://appleid.apple.com/auth/token",
        }
      );

      // Parse user info from ID token
      const idToken = tokenResponse.idToken;
      if (idToken) {
        // Decode JWT to get user info
        const payload = JSON.parse(
          Buffer.from(idToken.split(".")[1], "base64").toString()
        );

        return {
          success: true,
          user: {
            id: payload.sub,
            email: payload.email,
            name: payload.name || "Apple User",
            avatar: undefined, // Apple doesn't provide avatar
          },
        };
      }
    }

    return {
      success: false,
      error: "Apple sign-in was cancelled or failed",
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Apple sign-in failed",
    };
  }
};

// For development/testing purposes, you can use these mock functions
export const mockGoogleSignIn = async (): Promise<SocialAuthResult> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return {
    success: true,
    user: {
      id: "google_123",
      email: "user@gmail.com",
      name: "Google User",
      avatar:
        "https://i.pinimg.com/736x/2f/f1/23/2ff1237e3e0239caa4096bc0247ed1f1.jpg",
    },
  };
};

export const mockAppleSignIn = async (): Promise<SocialAuthResult> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return {
    success: true,
    user: {
      id: "apple_123",
      email: "user@icloud.com",
      name: "Apple User",
      avatar: undefined,
    },
  };
};
