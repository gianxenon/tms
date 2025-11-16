import type { User } from "./User";

export interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;                  // NEW → Good for UI state
  error: string | null;                // NEW → Useful for handling failed logins

  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;

  fetchProfile: () => Promise<void>;   // Fetches /me from backend
  setToken: (token: string | null) => void;  // NEW → Useful for restoring sessions
  setUser: (user: User | null) => void;      // NEW → Useful for updates to profile
}
 
