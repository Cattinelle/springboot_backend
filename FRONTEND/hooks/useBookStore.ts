import { create } from "zustand";
import { apiService } from "@/services/api";

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  cover?: string;
  overview?: string;
  aboutAuthor?: string;
  status?: string;
  keyPoints?: any[]; // Adjust as needed
}

interface BookStoreState {
  books: Book[];
  loading: boolean;
  error: string | null;
  fetchBooks: () => Promise<void>;
}

export const useBookStore = create<BookStoreState>((set) => ({
  books: [],
  loading: false,
  error: null,
  fetchBooks: async () => {
    set({ loading: true, error: null });
    try {
      const books = await apiService.getAllBooks();
      set({ books, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
}));
