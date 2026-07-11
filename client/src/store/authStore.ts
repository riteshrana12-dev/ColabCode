import { create } from "zustand";
import type { User } from "../types/index";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  setAccessToken: (token: string) => void;
  logout: () => void;
  deleteAccount: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,

  setAuth: (user, accessToken) =>
    set({ user, accessToken, isAuthenticated: true }),

  setAccessToken: (accessToken) => set({ accessToken }),

  logout: () => set({ user: null, accessToken: null, isAuthenticated: false }),

  deleteAccount: () =>
    set({ user: null, accessToken: null, isAuthenticated: false }),
}));
