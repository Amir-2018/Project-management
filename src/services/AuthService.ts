import { LoginCredentials, User } from '../models';
import { STORAGE_KEYS } from '../constants';

// Auth service for handling authentication
export class AuthService {
  // Simulated login - in production, this would call an API
  static async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (credentials.username && credentials.password) {
      const user: User = {
        username: credentials.username,
        email: `${credentials.username}@example.com`,
        avatar: credentials.username.charAt(0).toUpperCase(),
      };
      
      const token = btoa(JSON.stringify({ username: credentials.username, timestamp: Date.now() }));
      
      // Store in localStorage
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      
      return { user, token };
    }
    
    throw new Error('Invalid credentials');
  }

  // Logout user
  static logout(): void {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    return !!token;
  }

  // Get current user
  static getCurrentUser(): User | null {
    const userData = localStorage.getItem(STORAGE_KEYS.USER);
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch {
        return null;
      }
    }
    return null;
  }

  // Validate token (for future API implementation)
  static validateToken(token: string): boolean {
    try {
      const decoded = JSON.parse(atob(token));
      // Check if token is not older than 24 hours
      const tokenAge = Date.now() - decoded.timestamp;
      return tokenAge < 24 * 60 * 60 * 1000;
    } catch {
      return false;
    }
  }
}

export default AuthService;

