import { LoginCredentials, User } from '../models';
import { STORAGE_KEYS } from '../constants';

// Auth service for handling authentication
export class AuthService {
  // Simulated login - in production, this would call an API
  static async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Admin fallback or check for specific admin credentials
    if (credentials.username === 'admin' && credentials.password === 'admin') {
      const user: User = {
        username: 'admin',
        email: 'admin@example.com',
        avatar: 'A',
        role: 'Admin',
      };

      const token = btoa(JSON.stringify({ username: credentials.username, role: user.role, timestamp: Date.now() }));
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      return { user, token };
    }

    // Check registered admins in localStorage
    const adminsData = localStorage.getItem('camping_management_admins');
    if (adminsData) {
      const admins: any[] = JSON.parse(adminsData);
      const admin = admins.find(a => (a.email === credentials.username || a.username === credentials.username) && a.password === credentials.password);
      if (admin) {
        const user: User = {
          username: admin.username,
          email: admin.email,
          avatar: admin.name.charAt(0).toUpperCase(),
          role: 'Admin',
        };

        const token = btoa(JSON.stringify({ username: admin.username, role: user.role, timestamp: Date.now() }));
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        return { user, token };
      }
    }

    // Check members in localStorage
    const membersData = localStorage.getItem('camping_management_members');
    if (membersData) {
      const members: any[] = JSON.parse(membersData);
      const member = members.find(m => (m.email === credentials.username || m.username === credentials.username) && m.password === credentials.password);

      if (member) {
        const user: User = {
          username: member.name,
          email: member.email,
          avatar: member.name.charAt(0).toUpperCase(),
          role: 'Member',
        };

        const token = btoa(JSON.stringify({ username: member.email, role: user.role, timestamp: Date.now() }));
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        return { user, token };
      }
    }

    // Original simulated logic for any other combinations (optional, or just throw error)
    if (credentials.username && credentials.password && credentials.password === 'password123') {
      const role = credentials.username.toLowerCase().includes('member') ? 'Member' : 'Admin';
      const user: User = {
        username: credentials.username,
        email: `${credentials.username}@example.com`,
        avatar: credentials.username.charAt(0).toUpperCase(),
        role: role,
      };

      const token = btoa(JSON.stringify({ username: credentials.username, role: user.role, timestamp: Date.now() }));

      // Store in localStorage
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

      return { user, token };
    }

    throw new Error('Invalid credentials');
  }

  // Signup user
  static async signup(credentials: LoginCredentials & { email: string; name: string }): Promise<{ user: User; token: string }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // For this demo, we'll store admins in a separate localStorage key or just use the same logic
    const adminsData = localStorage.getItem('camping_management_admins');
    let admins: any[] = adminsData ? JSON.parse(adminsData) : [];

    // Check if user already exists
    if (admins.find(a => a.username === credentials.username || a.email === credentials.email)) {
      throw new Error('User already exists');
    }

    const newUser = {
      username: credentials.username,
      email: credentials.email,
      name: credentials.name,
      password: credentials.password,
      role: 'Admin'
    };

    admins.push(newUser);
    localStorage.setItem('camping_management_admins', JSON.stringify(admins));

    const user: User = {
      username: credentials.username,
      email: credentials.email,
      avatar: credentials.name.charAt(0).toUpperCase(),
      role: 'Admin',
    };

    const token = btoa(JSON.stringify({ username: credentials.username, role: user.role, timestamp: Date.now() }));
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

    return { user, token };
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

