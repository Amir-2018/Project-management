import { LoginCredentials, User } from '../models';
import { STORAGE_KEYS } from '../constants';

// Auth service for handling authentication
export class AuthService {
  // Simulated login - in production, this would call an API
  static async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    try {
      // Call backend API to login
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.username, // User enters email in username field
          password: credentials.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid credentials');
      }

      // Store user data and token from backend response
      const user: User = {
        username: data.name,
        email: data.email,
        avatar: data.name.charAt(0).toUpperCase(),
        role: data.role === 'admin' ? 'Admin' : data.role === 'manager' ? 'Manager' : 'Member',
      };

      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

      return { user, token: data.token };
    } catch (error: any) {
      throw new Error(error.message || 'Invalid credentials');
    }
  }

  // Signup user
  static async signup(credentials: LoginCredentials & { email: string; name: string }): Promise<{ user: User; token: string }> {
    try {
      // Call backend API to register admin
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: credentials.name,
          email: credentials.email,
          password: credentials.password,
          role: 'admin'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create account');
      }

      // Store user data and token from backend response
      const user: User = {
        username: data.name,
        email: data.email,
        avatar: data.name.charAt(0).toUpperCase(),
        role: 'Admin',
      };

      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

      return { user, token: data.token };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create account');
    }
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

