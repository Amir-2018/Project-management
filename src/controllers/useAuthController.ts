import { useState, useCallback } from 'react';
import { LoginCredentials, User, AuthState } from '../models';
import { AuthService } from '../services';

// Custom hook for authentication logic
export const useAuthController = () => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const user = AuthService.getCurrentUser();
    return {
      user,
      isAuthenticated: AuthService.isAuthenticated(),
      loading: false,
      error: null,
    };
  });

  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const { user } = await AuthService.login(credentials);
      setAuthState({
        user,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
      return true;
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Login failed',
      }));
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    AuthService.logout();
    setAuthState({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    });
  }, []);

  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...authState,
    login,
    logout,
    clearError,
  };
};

export default useAuthController;

