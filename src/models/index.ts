// User model interface
export interface User {
  username: string;
  email?: string;
  avatar?: string;
}

// Project model interface
export interface Project {
  id: number;
  name: string;
  status: ProjectStatus;
  progress: number;
  dueDate: string;
  description?: string;
  teamMembers?: string[];
}

// Project status enum
export type ProjectStatus = 'In Progress' | 'Planning' | 'Completed' | 'On Hold';

// Stats model interface
export interface Stats {
  label: string;
  value: number;
  icon: string;
}

// Login credentials interface
export interface LoginCredentials {
  username: string;
  password: string;
}

// Auth state interface
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

