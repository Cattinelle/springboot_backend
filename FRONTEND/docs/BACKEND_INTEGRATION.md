# Backend Integration Guide

## How Zustand Stores Connect to Spring Boot Backend

### 1. **Authentication Flow Overview**

```
Frontend (React Native) ←→ Zustand Store ←→ Spring Boot Backend
```

### 2. **Spring Boot Backend Endpoints Needed**

#### **Authentication Endpoints**

```java
// Login
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

// Register
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}

// Forgot Password
POST /api/auth/forgot-password
{
  "email": "user@example.com"
}

// Reset Password
POST /api/auth/reset-password
{
  "email": "user@example.com",
  "newPassword": "newpassword123"
}

// Send OTP
POST /api/auth/send-otp
{
  "email": "user@example.com"
}

// Verify OTP
POST /api/auth/verify-otp
{
  "email": "user@example.com",
  "otp": "123456"
}

// Social Login (Google/Apple)
POST /api/auth/social-login
{
  "provider": "google", // or "apple"
  "token": "social_provider_token"
}
```

#### **User Management Endpoints**

```java
// Get User Profile
GET /api/users/profile
Authorization: Bearer {jwt_token}

// Update User Profile
PUT /api/users/profile
Authorization: Bearer {jwt_token}
{
  "name": "Updated Name",
  "bio": "Updated bio",
  "country": "Canada"
}

// Change Password
PUT /api/users/change-password
Authorization: Bearer {jwt_token}
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword"
}
```

### 3. **Zustand Store Integration Pattern**

#### **API Service Layer**

Create a separate API service to handle all HTTP requests:

```typescript
// services/api.ts
const API_BASE_URL = "http://your-springboot-backend.com/api";

class ApiService {
  private async request(endpoint: string, options: RequestInit = {}) {
    const token = await AsyncStorage.getItem("authToken");

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Request failed");
    }

    return data;
  }

  // Auth endpoints
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

  // User endpoints
  async getUserProfile() {
    return this.request("/users/profile");
  }

  async updateUserProfile(profileData: any) {
    return this.request("/users/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  }
}

export const apiService = new ApiService();
```

#### **Updated Zustand Store**

```typescript
// hooks/useAuthStore.ts
import { apiService } from "@/services/api";

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // ... state

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const data = await apiService.login(email, password);

          // Store JWT token
          if (data.token) {
            await AsyncStorage.setItem("authToken", data.token);
          }

          // Set user data
          set({
            user: data.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.message,
            isLoading: false,
          });
        }
      },

      register: async (email: string, password: string, name: string) => {
        set({ isLoading: true, error: null });
        try {
          const data = await apiService.register(email, password, name);
          set({ isLoading: false });
          return data; // Return for component to handle navigation
        } catch (error: any) {
          set({
            error: error.message,
            isLoading: false,
          });
          throw error;
        }
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
```

### 4. **Error Handling Strategy**

#### **HTTP Status Codes from Spring Boot**

```typescript
// Expected Spring Boot responses
const STATUS_CODES = {
  // Success
  200: "OK",
  201: "Created",

  // Client Errors
  400: "Bad Request - Invalid data",
  401: "Unauthorized - Invalid credentials",
  403: "Forbidden - Account locked/disabled",
  404: "Not Found - Email not found",
  409: "Conflict - Email already exists",
  422: "Unprocessable Entity - Email not verified",

  // Server Errors
  500: "Internal Server Error",
  503: "Service Unavailable",
};
```

#### **Error Handling in Store**

```typescript
const handleApiError = (response: Response, data: any) => {
  switch (response.status) {
    case 404:
      throw new Error("Email not found");
    case 401:
      throw new Error("Incorrect password");
    case 403:
      throw new Error("Account is locked or disabled");
    case 409:
      throw new Error("Email already exists");
    case 422:
      throw new Error("Email not verified");
    default:
      throw new Error(data.message || "Request failed");
  }
};
```

### 5. **JWT Token Management**

#### **Token Storage and Usage**

```typescript
// Store token on login
await AsyncStorage.setItem('authToken', data.token);

// Include token in requests
const token = await AsyncStorage.getItem('authToken');
headers: {
  'Authorization': `Bearer ${token}`,
}

// Remove token on logout
await AsyncStorage.removeItem('authToken');
```

#### **Token Refresh Strategy**

```typescript
// Add to API service
private async refreshToken() {
  const refreshToken = await AsyncStorage.getItem('refreshToken');
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  const data = await response.json();
  await AsyncStorage.setItem('authToken', data.token);
  return data.token;
}
```

### 6. **Social Authentication Integration**

#### **Google/Apple Sign-in Flow**

```typescript
// 1. Get social token from provider
const socialResult = await googleSignIn(); // or appleSignIn()

// 2. Send to Spring Boot backend
const response = await apiService.socialLogin({
  provider: "google", // or 'apple'
  token: socialResult.token,
});

// 3. Backend validates token and creates/updates user
// 4. Returns JWT token for your app
```

### 7. **Data Synchronization**

#### **User Profile Sync**

```typescript
// Sync user data from backend
const syncUserProfile = async () => {
  try {
    const userData = await apiService.getUserProfile();
    useAuthStore.getState().updateUser(userData);
  } catch (error) {
    console.error("Failed to sync user profile:", error);
  }
};
```

#### **Real-time Updates**

```typescript
// Use WebSocket or polling for real-time updates
const setupUserSync = () => {
  // Poll every 30 seconds
  setInterval(syncUserProfile, 30000);
};
```

### 8. **Environment Configuration**

#### **API Configuration**

```typescript
// config/api.ts
export const API_CONFIG = {
  development: {
    baseUrl: "http://localhost:8080/api",
  },
  staging: {
    baseUrl: "https://staging-api.yourapp.com/api",
  },
  production: {
    baseUrl: "https://api.yourapp.com/api",
  },
};

export const getApiConfig = () => {
  const env = __DEV__ ? "development" : "production";
  return API_CONFIG[env];
};
```

### 9. **Testing Strategy**

#### **Mock API for Development**

```typescript
// services/mockApi.ts
export const mockApiService = {
  login: async (email: string, password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (email === "test@example.com" && password === "password") {
      return {
        token: "mock_jwt_token",
        user: {
          id: "1",
          email: "test@example.com",
          name: "Test User",
          // ... other user data
        },
      };
    } else {
      throw new Error("Invalid credentials");
    }
  },
};
```

### 10. **Security Considerations**

#### **Token Security**

- Store tokens securely using `expo-secure-store` for sensitive data
- Implement token expiration handling
- Use HTTPS for all API calls
- Implement certificate pinning for production

#### **Input Validation**

- Validate all inputs on both frontend and backend
- Sanitize user data before sending to backend
- Implement rate limiting on sensitive endpoints

This integration pattern ensures clean separation of concerns, proper error handling, and scalable architecture for your React Native app with Spring Boot backend.
