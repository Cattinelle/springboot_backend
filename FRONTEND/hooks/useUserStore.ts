import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiService } from "@/services/api";

// Types for user profile
export interface UserProfile {
  name: string;
  profilePic: string | null;
  country: string;
  bio?: string;
  joinDate?: string; // ISO date string
}

export interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  completedDate?: string; // ISO date string for completed books
}

export interface LibraryItem extends Book {
  progress?: number; // Reading progress percentage
  lastRead?: string; // ISO date string
}

export interface UserStore {
  // User data
  profile: UserProfile;
  joinDate: string | null;

  // Reading stats
  readingGoal: number | null;
  streak: number;
  booksCompleted: number;

  // Book collections
  recommendations: Book[];
  favorites: Book[];
  reading: LibraryItem[];
  savedForLater: Book[];
  completed: Book[];

  // Actions
  setProfile: (profile: Partial<UserProfile>) => void;
  setJoinDate: (date: string) => void;
  setReadingGoal: (goal: number) => void;
  setStreak: (streak: number) => void;
  setBooksCompleted: (count: number) => void;

  // Book management
  addRecommendation: (book: Book) => void;
  addFavorite: (book: Book) => void;
  removeRecommendation: (bookId: string) => void;
  removeFavorite: (bookId: string) => void;

  // Library management
  addToReading: (book: LibraryItem) => void;
  addToSaved: (book: Book) => void;
  addToCompleted: (book: Book) => void;
  removeFromReading: (bookId: string) => void;
  removeFromSaved: (bookId: string) => void;
  removeFromCompleted: (bookId: string) => void;
  updateReadingProgress: (bookId: string, progress: number) => void;

  // Backend integration
  fetchUserData: () => Promise<void>;
  syncUserProfile: () => Promise<void>;
  createUser: (userData: Partial<UserProfile>) => Promise<void>;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<void>;
  uploadProfilePicture: (imageData: string) => Promise<void>;
  pendingAddType: "recommendation" | "favorite" | null;
  setPendingAddType: (type: "recommendation" | "favorite" | null) => void;

  // Friends and Requests
  friends: string[]; // user IDs
  sentRequests: string[]; // user IDs
  receivedRequests: string[]; // user IDs
  // Actions:
  sendFriendRequest: (userId: string) => Promise<void>;
  cancelFriendRequest: (userId: string) => Promise<void>;
  acceptFriendRequest: (userId: string) => Promise<void>;
  declineFriendRequest: (userId: string) => Promise<void>;
  removeFriend: (userId: string) => Promise<void>;
  fetchFriendsAndRequests: () => Promise<void>;

  // All users (for friend search, explore, etc)
  allUsers: Array<{
    id: string;
    avatar: string;
    name: string;
    country: string;
  }>;
  fetchAllUsers: () => Promise<void>;
}

interface OnboardingState {
  hasSeenWelcomeToast: boolean;
  hasSeenProfileToast: boolean;
  setHasSeenWelcomeToast: (seen: boolean) => void;
  setHasSeenProfileToast: (seen: boolean) => void;
  loadOnboardingFlags: () => Promise<void>;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  hasSeenWelcomeToast: false,
  hasSeenProfileToast: false,
  setHasSeenWelcomeToast: (seen) => {
    set({ hasSeenWelcomeToast: seen });
    AsyncStorage.setItem("hasSeenWelcomeToast", seen ? "1" : "0");
  },
  setHasSeenProfileToast: (seen) => {
    set({ hasSeenProfileToast: seen });
    AsyncStorage.setItem("hasSeenProfileToast", seen ? "1" : "0");
  },
  loadOnboardingFlags: async () => {
    const welcome = await AsyncStorage.getItem("hasSeenWelcomeToast");
    const profile = await AsyncStorage.getItem("hasSeenProfileToast");
    set({
      hasSeenWelcomeToast: welcome === "1",
      hasSeenProfileToast: profile === "1",
    });
  },
}));

export const useUserStore = create<UserStore>()((set, get) => ({
  // Initial state
  profile: {
    name: "Lynette Adams",
    profilePic: null,
    country: "Canada",
    bio: "",
  },
  joinDate: null,
  readingGoal: null,
  streak: 0,
  booksCompleted: 0,
  recommendations: [],
  favorites: [],
  reading: [],
  savedForLater: [],
  completed: [],
  pendingAddType: null,
  setPendingAddType: (type) => set({ pendingAddType: type }),

  // Profile actions
  setProfile: (profile: Partial<UserProfile>) =>
    set((state) => ({ profile: { ...state.profile, ...profile } })),
  setJoinDate: (date: string) => set({ joinDate: date }),
  setReadingGoal: (goal) => set({ readingGoal: goal }),
  setStreak: (streak) => set({ streak }),
  setBooksCompleted: (count) => set({ booksCompleted: count }),

  // Book collection actions
  addRecommendation: (book) =>
    set((state) => ({
      recommendations:
        state.recommendations.length >= 4 ||
        state.recommendations.some((b) => b.id === book.id)
          ? state.recommendations
          : [...state.recommendations, book],
    })),
  addFavorite: (book) =>
    set((state) => ({
      favorites:
        state.favorites.length >= 4 ||
        state.favorites.some((b) => b.id === book.id)
          ? state.favorites
          : [...state.favorites, book],
    })),
  removeRecommendation: (bookId) =>
    set((state) => ({
      recommendations: state.recommendations.filter((b) => b.id !== bookId),
    })),
  removeFavorite: (bookId) =>
    set((state) => ({
      favorites: state.favorites.filter((b) => b.id !== bookId),
    })),

  // Library actions
  addToReading: (book) =>
    set((state) => ({
      reading: state.reading.some((b) => b.id === book.id)
        ? state.reading
        : [...state.reading, book],
    })),
  addToSaved: (book) =>
    set((state) => ({
      savedForLater: state.savedForLater.some((b) => b.id === book.id)
        ? state.savedForLater
        : [...state.savedForLater, book],
    })),
  addToCompleted: (book) => {
    const bookWithDate = { ...book, completedDate: new Date().toISOString() };
    set((state) => ({
      completed: state.completed.some((b) => b.id === book.id)
        ? state.completed
        : [...state.completed, bookWithDate],
      booksCompleted: state.booksCompleted + 1,
    }));
  },
  removeFromReading: (bookId) =>
    set((state) => ({
      reading: state.reading.filter((b) => b.id !== bookId),
    })),
  removeFromSaved: (bookId) =>
    set((state) => ({
      savedForLater: state.savedForLater.filter((b) => b.id !== bookId),
    })),
  removeFromCompleted: (bookId) =>
    set((state) => ({
      completed: state.completed.filter((b) => b.id !== bookId),
      booksCompleted: Math.max(0, state.booksCompleted - 1),
    })),
  updateReadingProgress: (bookId, progress) =>
    set((state) => ({
      reading: state.reading.map((book) =>
        book.id === bookId ? { ...book, progress } : book
      ),
    })),

  // Backend integration
  fetchUserData: async () => {
    try {
      const userData = await apiService.getUserProfile();
      set({
        profile: {
          name: userData.name,
          profilePic: userData.avatar,
          country: userData.country,
          bio: userData.bio,
          joinDate: userData.joinDate,
        },
        joinDate: userData.joinDate,
        readingGoal: userData.readingGoal,
        streak: userData.streak,
        booksCompleted: userData.booksCompleted,
        recommendations: userData.recommendations || [],
        favorites: userData.favorites || [],
        reading: userData.reading || [],
        savedForLater: userData.savedForLater || [],
        completed: userData.completed || [],
      });
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  },

  // Only sync profile fields that the backend expects
  syncUserProfile: async () => {
    try {
      const state = get();
      await apiService.updateUserProfile({
        name: state.profile.name,
        bio: state.profile.bio,
        country: state.profile.country,
        avatar: state.profile.profilePic || undefined,
      });
    } catch (error) {
      console.error("Failed to sync user profile:", error);
    }
  },

  createUser: async (userData: Partial<UserProfile>) => {
    try {
      const joinDate = new Date().toISOString();
      await apiService.createUser({
        ...userData,
        joinDate,
      });

      set({
        profile: { ...get().profile, ...userData },
        joinDate,
      });
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  },

  updateProfile: async (profileData: Partial<UserProfile>) => {
    try {
      const updated = await apiService.updateUserProfile(profileData);
      set({
        profile: {
          ...get().profile,
          ...updated,
        },
      });
    } catch (error) {
      console.error("Failed to update profile:", error);
      throw error;
    }
  },

  uploadProfilePicture: async (imageData: string) => {
    try {
      const data = await apiService.uploadAvatar(imageData);
      set({
        profile: { ...get().profile, profilePic: data.avatar },
      });
    } catch (error) {
      console.error("Failed to upload profile picture:", error);
      throw error;
    }
  },

  // Friends and Requests
  friends: [],
  sentRequests: [],
  receivedRequests: [],
  sendFriendRequest: async (userId) => {
    await apiService.sendFriendRequest(userId);
  },
  cancelFriendRequest: async (userId) => {
    await apiService.cancelFriendRequest(userId);
  },
  acceptFriendRequest: async (userId) => {
    await apiService.acceptFriendRequest(userId);
  },
  declineFriendRequest: async (userId) => {
    await apiService.declineFriendRequest(userId);
  },
  removeFriend: async (userId) => {
    await apiService.removeFriend(userId);
  },
  fetchFriendsAndRequests: async () => {
    const { friends, sentRequests, receivedRequests } =
      await apiService.getFriendsAndRequests();
    set({ friends, sentRequests, receivedRequests });
  },

  // All users (for friend search, explore, etc)
  allUsers: [],
  fetchAllUsers: async () => {
    const users = await apiService.getAllUsers();
    set({ allUsers: users });
  },
}));
