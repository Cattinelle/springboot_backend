import AsyncStorage from "@react-native-async-storage/async-storage";

// TODO: Update this with your actual Spring Boot backend URL
const API_BASE_URL = "http://your-springboot-backend.com/api";

// Environment-based configuration
const getApiConfig = () => {
  if (__DEV__) {
    return {
      baseUrl: "http://localhost:8080/api", // For local development
    };
  }
  return {
    baseUrl: "https://api.yourapp.com/api", // For production
  };
};

export const fetchBooks = async () => {
  const response = await fetch("/api/books");
  if (!response.ok) throw new Error("Failed to fetch books");
  const books = await response.json();
  return books;
};

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = getApiConfig().baseUrl;
  }

  /**
   * Generic request method with authentication and error handling
   */
  private async request(endpoint: string, options: RequestInit = {}) {
    try {
      // Get stored token
      const token = await AsyncStorage.getItem("authToken");

      const config: RequestInit = {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
        ...options,
      };

      const response = await fetch(`${this.baseUrl}${endpoint}`, config);
      const data = await response.json();

      // Handle different HTTP status codes
      if (!response.ok) {
        this.handleApiError(response, data);
      }

      return data;
    } catch (error: any) {
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        throw new Error("Network error. Please check your connection.");
      }
      throw error;
    }
  }

  /**
   * Handle API errors based on HTTP status codes
   */
  private handleApiError(response: Response, data: any) {
    switch (response.status) {
      case 400:
        throw new Error(data.message || "Invalid request data");
      case 401:
        // Token might be expired, try to refresh
        this.handleTokenExpiration();
        throw new Error("Invalid credentials");
      case 403:
        throw new Error("Account is locked or disabled");
      case 404:
        throw new Error("Email not found");
      case 409:
        throw new Error("Email already exists");
      case 422:
        throw new Error("Email not verified");
      case 429:
        throw new Error("Too many requests. Please try again later.");
      case 500:
        throw new Error("Server error. Please try again later.");
      case 503:
        throw new Error("Service temporarily unavailable");
      default:
        throw new Error(data.message || "Request failed");
    }
  }

  /**
   * Handle token expiration by attempting to refresh
   */
  private async handleTokenExpiration() {
    try {
      const refreshToken = await AsyncStorage.getItem("refreshToken");
      if (refreshToken) {
        const response = await fetch(`${this.baseUrl}/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });

        if (response.ok) {
          const data = await response.json();
          await AsyncStorage.setItem("authToken", data.token);
          return data.token;
        }
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
    }

    // If refresh fails, logout user
    await this.logout();
  }

  /**
   * Authentication endpoints
   */
  async login(email: string, password: string) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async register(email: string, password: string, name: string) {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    });
  }

  async registerInitial(email: string, name: string, country: string) {
    return this.request("/auth/register-initial", {
      method: "POST",
      body: JSON.stringify({ email, name, country }),
    });
  }

  async forgotPassword(email: string) {
    return this.request("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(email: string, newPassword: string) {
    return this.request("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ email, newPassword }),
    });
  }

  async sendOTP(email: string) {
    return this.request("/auth/send-otp", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  async verifyOTP(email: string, otp: string) {
    return this.request("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    });
  }

  async socialLogin(provider: "google" | "apple", token: string) {
    return this.request("/auth/social-login", {
      method: "POST",
      body: JSON.stringify({ provider, token }),
    });
  }

  /**
   * User management endpoints
   */

  //get all books

  async getUserProfile() {
    return this.request("/users/profile");
  }

  async updateUserProfile(profileData: {
    name?: string;
    bio?: string;
    country?: string;
    avatar?: string;
  }) {
    return this.request("/users/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return this.request("/users/change-password", {
      method: "PUT",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  async updateProfile(profileData: {
    name?: string;
    bio?: string;
    country?: string;
    phone?: string;
    dob?: string;
    avatar?: string;
  }) {
    return this.request("/users/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  }

  async uploadAvatar(imageData: string) {
    return this.request("/users/avatar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageData }),
    });
  }

  /**
   * Book management endpoints
   */

  // getBooks can fetch books with optional category filtering and supports pagination via page and size parameters.
  async getBooks(category?: string, page: number = 0, size: number = 20) {
    const params = new URLSearchParams();
    if (category) params.append("category", category);
    params.append("page", page.toString());
    params.append("size", size.toString());

    return this.request(`/books?${params.toString()}`);
  }

  async getBookById(id: string) {
    return this.request(`/books/${id}`);
  }
  // getAllBooks fetches all books without any filters or pagination.
  async getAllBooks() {
    return this.request("/books");
  }

  // addToFavorites adds a book to the user's favorites list.
  async addToFavorites(bookId: string) {
    return this.request("/users/favorites", {
      method: "POST",
      body: JSON.stringify({ bookId }),
    });
  }

  async removeFromFavorites(bookId: string) {
    return this.request(`/users/favorites/${bookId}`, {
      method: "DELETE",
    });
  }

  async addToRecommendations(bookId: string) {
    return this.request("/users/recommendations", {
      method: "POST",
      body: JSON.stringify({ bookId }),
    });
  }

  async removeFromRecommendations(bookId: string) {
    return this.request(`/users/recommendations/${bookId}`, {
      method: "DELETE",
    });
  }

  /**
   * Friend management endpoints
   */
  async getFriends() {
    return this.request("/users/friends");
  }

  async sendFriendRequest(userId: string) {
    return this.request("/users/friend-requests", {
      method: "POST",
      body: JSON.stringify({ userId }),
    });
  }

  async acceptFriendRequest(requestId: string) {
    return this.request(`/users/friend-requests/${requestId}/accept`, {
      method: "PUT",
    });
  }

  async declineFriendRequest(requestId: string) {
    return this.request(`/users/friend-requests/${requestId}/decline`, {
      method: "PUT",
    });
  }

  async removeFriend(friendId: string) {
    return this.request(`/users/friends/${friendId}`, {
      method: "DELETE",
    });
  }

  async searchUsers(query: string) {
    return this.request(`/users/search?q=${encodeURIComponent(query)}`);
  }

  /**
   * Reading progress endpoints
   */
  async setReadingGoal(goal: number) {
    return this.request("/users/reading-goal", {
      method: "PUT",
      body: JSON.stringify({ goal }),
    });
  }

  async updateReadingProgress(bookId: string, progress: number) {
    return this.request("/users/reading-progress", {
      method: "PUT",
      body: JSON.stringify({ bookId, progress }),
    });
  }

  /**
   * Logout and clear stored data
   */
  async logout() {
    try {
      // Call logout endpoint to invalidate token on server
      await this.request("/auth/logout", { method: "POST" });
    } catch (error) {
      // Even if server logout fails, clear local data
      console.error("Server logout failed:", error);
    } finally {
      // Clear all stored authentication data
      await AsyncStorage.multiRemove([
        "authToken",
        "refreshToken",
        "user",
        "auth-storage",
      ]);
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await AsyncStorage.getItem("authToken");
    return !!token;
  }

  /**
   * Get stored token
   */
  async getToken(): Promise<string | null> {
    return AsyncStorage.getItem("authToken");
  }

  async getAllUsers() {
    const response = await fetch("/api/profile/all");
    if (!response.ok) throw new Error("Failed to fetch users");
    const users = await response.json();
    return users.map((u: any) => ({
      id: u.id,
      avatar: u.avatarUrl,
      name: `${u.firstName} ${u.lastName}`.trim(),
      country: u.country,
    }));
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Export types for API responses
export interface LoginResponse {
  token: string;
  refreshToken?: string;
  user: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    joinDate: string;
    isEmailVerified: boolean;
  };
}

export interface RegisterResponse {
  message: string;
  userId: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  bio?: string;
  country?: string;
  avatar?: string;
  joinDate: string;
  isEmailVerified: boolean;
  readingGoal?: number;
  streak?: number;
  booksCompleted?: number;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  coverImage?: string;
  summary?: string;
  keyPoints?: string[];
  duration?: number; // in minutes
}

export interface FriendRequest {
  id: string;
  fromUser: {
    id: string;
    name: string;
    avatar?: string;
  };
  toUser: {
    id: string;
    name: string;
    avatar?: string;
  };
  status: "pending" | "accepted" | "declined";
  createdAt: string;
}
