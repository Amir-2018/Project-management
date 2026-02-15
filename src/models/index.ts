// User model interface
export interface User {
  username: string;
  email?: string;
  avatar?: string;
}

// Member model interface
export interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  managerId?: string;
}

// Team model interface
export interface Team {
  id: string;
  name: string;
  members: Member[];
  projectIds: number[];
}

// Project model interface
export interface Project {
  id: number;
  name: string;
  status: ProjectStatus;
  progress: number;
  dueDate: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  memberIds?: string[];
}

// Project status enum
export type ProjectStatus = 'In Progress' | 'Planning' | 'Completed' | 'On Hold';

// Task status type
export type TaskStatus = 'To Do' | 'In Progress' | 'Done' | 'Finished';

// Attachment interface
export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: string;
}

// Comment interface
export interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
}

// Task model interface
export interface Task {
  id: string;
  projectId: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: 'Low' | 'Medium' | 'High';
  assignee?: string;
  dueDate?: string;
  attachments: Attachment[];
  comments: Comment[];
}

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

