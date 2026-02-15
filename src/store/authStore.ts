import { create } from 'zustand';
import { User, LoginCredentials } from '../models';
import AuthService from '../services/AuthService';

interface AuthStore {
  // State
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  
  // Login action
  login: async (credentials: LoginCredentials) => {
    set({ loading: true, error: null });
    try {
      const { user, token } = await AuthService.login(credentials);
      set({ 
        user, 
        isAuthenticated: true, 
        loading: false, 
        error: null 
      });
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Login failed' 
      });
      throw error;
    }
  },
  
  // Logout action
  logout: () => {
    AuthService.logout();
    set({ 
      user: null, 
      isAuthenticated: false, 
      error: null 
    });
  },
  
  // Check authentication status
  checkAuth: () => {
    const isAuthenticated = AuthService.isAuthenticated();
    const user = AuthService.getCurrentUser();
    set({ 
      isAuthenticated, 
      user 
    });
  },
  
  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));

export default useAuthStore;

