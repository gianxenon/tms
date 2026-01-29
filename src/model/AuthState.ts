//AuthState.ts
import type { User } from "./User";

export interface AuthState { 
  user: User | null;
  isLoading: boolean;                  
  error: string | null;   
  authChecked: boolean;  

  login: (userid: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;

  fetchProfile: () => Promise<void>;   
}
 
