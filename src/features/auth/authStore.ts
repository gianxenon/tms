import { create } from "zustand";
import authService from "@/services/authService";
import type { AuthState } from "@/model/AuthState";

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem("token"),
  user: null,
  isLoading: false,
  error: null,

  // ---------------------------
  // Setters
  // ---------------------------
  setToken: (token) => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
    set({ token });
  },

  setUser: (user) => set({ user }),

  // ---------------------------
  // Login
  // ---------------------------
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authService.login(email, password);

      set({
        token: res.token,
        user: res.user,
        isLoading: false,
      });

      localStorage.setItem("token", res.token);
      return true;
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Login failed";

      set({
        error: message,
        isLoading: false,
      });
      return false;
    }
  },

  // ---------------------------
  // Register
  // ---------------------------
  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authService.register(name, email, password);

      set({
        token: res.token,
        user: res.user,
        isLoading: false,
      });

      localStorage.setItem("token", res.token);
      return true;
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Registration failed";

      set({
        error: message,
        isLoading: false,
      });
      return false;
    }
  },

  // ---------------------------
  // Logout
  // ---------------------------
  logout: () => {
    authService.logout();
    localStorage.removeItem("token");
    set({ token: null, user: null });
  },

  // ---------------------------
  // Fetch Profile
  // ---------------------------
  fetchProfile: async () => {
    set({ isLoading: true });

    try {
      const profile = await authService.getProfile();
      set({ user: profile, isLoading: false });

    } catch (err: unknown) {
      console.error(err);
      set({ isLoading: false });
    }
  },
}));
