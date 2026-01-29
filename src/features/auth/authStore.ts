//useAuthStore.ts
import { create } from "zustand";
import authService from "@/services/authService";
import type { AuthState } from "@/model/AuthState";



export const useAuthStore = create<AuthState>((set) => ({ 
  user: null,
  isLoading: false,
  error: null, 
  authChecked: false,

   
 
  login: async (userid, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authService.login(userid, password);
       // store token
      if (res.user.token) {
        localStorage.setItem("auth_token", res.user.token);
      }  
      set({ user: res.user, isLoading: false, authChecked: true,  }); 
      return true;  
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Login failed"; 
      set({ error: message, isLoading: false, });
      return false;
    }
  },
 
  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authService.register(name, email, password);

      set({ 
        user: res.user,
        isLoading: false,
      }); 
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
 
  logout: () => { 
    localStorage.removeItem("auth_token");  
    set({ user: null, isLoading: false, error: null, authChecked: true });
  },

 
  fetchProfile: async () => {
    set({ isLoading: true });
    try {
      const profile = await authService.getProfile();
      set({ user: profile.user, isLoading: false, authChecked: true }); 
    } catch (err: unknown) {
      console.error(err);
      set({ user: null, isLoading: false, authChecked: true }); 
      localStorage.removeItem("auth_token"); 
    }
  }, 
}));
