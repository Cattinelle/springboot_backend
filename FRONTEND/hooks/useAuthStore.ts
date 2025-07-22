import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  joinDate: string;
  isEmailVerified: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthActions {
  // Login
  login: (email: string, password: string) => Promise<void>;

  // Register
  register: (email: string, password: string, name: string) => Promise<void>;
  registerInitial: (
    email: string,
    name: string,
    country: string
  ) => Promise<void>;

  // Social Sign-in
  googleSignIn: () => Promise<void>;
  appleSignIn: () => Promise<void>;

  // Password Reset
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (email: string, newPassword: string) => Promise<void>;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;

  // OTP Verification
  sendOTP: (email: string) => Promise<void>;
  verifyOTP: (email: string, otp: string) => Promise<void>;

  // Logout
  logout: () => void;

  // Clear error
  clearError: () => void;

  // Set loading
  setLoading: (loading: boolean) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      setLoading: (loading) => set({ isLoading: loading }),

      clearError: () => set({ error: null }),

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          // TODO: Replace with your Spring Boot backend URL
          const response = await fetch(
            "http://your-springboot-backend.com/api/auth/login",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                // Add any additional headers like API keys if needed
              },
              body: JSON.stringify({ email, password }),
            }
          );

          const data = await response.json();

          if (!response.ok) {
            // Handle different error cases from your Spring Boot backend
            if (response.status === 404) {
              throw new Error("Email not found");
            } else if (response.status === 401) {
              throw new Error("Incorrect password");
            } else if (response.status === 403) {
              throw new Error("Account is locked or disabled");
            } else if (response.status === 422) {
              throw new Error("Email not verified");
            } else {
              throw new Error(data.message || "Login failed");
            }
          }

          // Store the JWT token
          if (data.token) {
            await AsyncStorage.setItem("authToken", data.token);
          }

          // Set user data from backend response
          const user: User = {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            avatar: data.user.avatar,
            joinDate: data.user.joinDate,
            isEmailVerified: data.user.isEmailVerified,
          };

          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error: any) {
          set({
            error: error.message || "Login failed",
            isLoading: false,
          });
        }
      },

      register: async (email: string, password: string, name: string) => {
        set({ isLoading: true, error: null });
        try {
          // TODO: Replace with your Spring Boot backend URL
          const response = await fetch(
            "http://your-springboot-backend.com/api/auth/register",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email, password, name }),
            }
          );

          const data = await response.json();

          if (!response.ok) {
            // Handle different error cases from your Spring Boot backend
            if (response.status === 409) {
              throw new Error("Email already exists");
            } else if (response.status === 400) {
              throw new Error(data.message || "Invalid registration data");
            } else {
              throw new Error(data.message || "Registration failed");
            }
          }

          // For registration, we might not want to auto-login
          // Instead, we could navigate to OTP verification
          set({ isLoading: false });

          // Return success data for the component to handle navigation
          return data;
        } catch (error: any) {
          set({
            error: error.message || "Registration failed",
            isLoading: false,
          });
          throw error; // Re-throw so component can handle
        }
      },

      registerInitial: async (email: string, name: string, country: string) => {
        set({ isLoading: true, error: null });
        try {
          // TODO: Replace with your Spring Boot backend URL
          const response = await fetch(
            "http://your-springboot-backend.com/api/auth/register-initial",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email, name, country }),
            }
          );

          const data = await response.json();

          if (!response.ok) {
            // Handle different error cases from your Spring Boot backend
            if (response.status === 409) {
              throw new Error("Email already exists");
            } else if (response.status === 400) {
              throw new Error(data.message || "Invalid registration data");
            } else {
              throw new Error(data.message || "Registration failed");
            }
          }

          // For initial registration, we don't log in yet
          // Just send OTP and wait for verification
          set({ isLoading: false });

          return data;
        } catch (error: any) {
          set({
            error: error.message || "Registration failed",
            isLoading: false,
          });
          throw error; // Re-throw so component can handle
        }
      },

      googleSignIn: async () => {
        set({ isLoading: true, error: null });
        try {
          // TODO: Implement Google Sign-in
          // This will be implemented with expo-auth-session
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Mock user data for Google sign-in
          const user: User = {
            id: "google_1",
            email: "user@gmail.com",
            name: "Google User",
            avatar:
              "https://i.pinimg.com/736x/2f/f1/23/2ff1237e3e0239caa4096bc0247ed1f1.jpg",
            joinDate: new Date().toISOString(),
            isEmailVerified: true,
          };

          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error: any) {
          set({
            error: error.message || "Google sign-in failed",
            isLoading: false,
          });
        }
      },

      appleSignIn: async () => {
        set({ isLoading: true, error: null });
        try {
          // TODO: Implement Apple Sign-in
          // This will be implemented with expo-auth-session
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Mock user data for Apple sign-in
          const user: User = {
            id: "apple_1",
            email: "user@icloud.com",
            name: "Apple User",
            avatar:
              "https://i.pinimg.com/736x/2f/f1/23/2ff1237e3e0239caa4096bc0247ed1f1.jpg",
            joinDate: new Date().toISOString(),
            isEmailVerified: true,
          };

          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error: any) {
          set({
            error: error.message || "Apple sign-in failed",
            isLoading: false,
          });
        }
      },

      forgotPassword: async (email: string) => {
        set({ isLoading: true, error: null });
        try {
          // TODO: Replace with actual API call
          // const response = await fetch('/api/auth/forgot-password', {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify({ email }),
          // });

          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));

          set({ isLoading: false });
        } catch (error: any) {
          set({
            error: error.message || "Failed to send reset email",
            isLoading: false,
          });
        }
      },

      resetPassword: async (email: string, newPassword: string) => {
        set({ isLoading: true, error: null });
        try {
          // TODO: Replace with actual API call
          // const response = await fetch('/api/auth/reset-password', {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify({ email, newPassword }),
          // });

          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));

          set({ isLoading: false });
        } catch (error: any) {
          set({
            error: error.message || "Failed to reset password",
            isLoading: false,
          });
        }
      },

      changePassword: async (currentPassword: string, newPassword: string) => {
        set({ isLoading: true, error: null });
        try {
          // TODO: Replace with actual API call
          // const response = await fetch('/api/auth/change-password', {
          //   method: 'POST',
          //   headers: {
          //     'Content-Type': 'application/json',
          //     'Authorization': `Bearer ${await AsyncStorage.getItem('authToken')}`
          //   },
          //   body: JSON.stringify({ currentPassword, newPassword }),
          // });

          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));

          set({ isLoading: false });
        } catch (error: any) {
          set({
            error: error.message || "Failed to change password",
            isLoading: false,
          });
          throw error; // Re-throw so component can handle
        }
      },

      sendOTP: async (email: string) => {
        set({ isLoading: true, error: null });
        try {
          // TODO: Replace with actual API call
          // const response = await fetch('/api/auth/send-otp', {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify({ email }),
          // });

          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));

          set({ isLoading: false });
        } catch (error: any) {
          set({
            error: error.message || "Failed to send OTP",
            isLoading: false,
          });
        }
      },

      verifyOTP: async (email: string, otp: string) => {
        set({ isLoading: true, error: null });
        try {
          // TODO: Replace with actual API call
          // const response = await fetch('/api/auth/verify-otp', {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify({ email, otp }),
          // });

          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));

          set({ isLoading: false });
        } catch (error: any) {
          set({
            error: error.message || "Invalid OTP",
            isLoading: false,
          });
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          error: null,
          isLoading: false,
        });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
