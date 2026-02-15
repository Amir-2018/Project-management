// Application constants
export const APP_NAME = 'ProjectHub';
export const APP_VERSION = '1.0.0';

// API endpoints (for future use)
export const API_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  LOGOUT: '/api/auth/logout',
  REFRESH_TOKEN: '/api/auth/refresh',
  PROJECTS: '/api/projects',
  TASKS: '/api/tasks',
  TEAM: '/api/team',
};

// Route paths
export const ROUTES = {
  LOGIN: '/',
  DASHBOARD: '/dashboard',
  PROJECTS: '/projects',
  TASKS: '/tasks',
  TEAM: '/team',
  SETTINGS: '/settings',
};

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER: 'user_data',
  THEME: 'app_theme',
};

// Colors
export const COLORS = {
  PRIMARY: '#667eea',
  SECONDARY: '#764ba2',
  SUCCESS: '#059669',
  WARNING: '#d97706',
  DANGER: '#dc2626',
  INFO: '#2563eb',
};

// Status colors mapping
export const STATUS_COLORS = {
  'In Progress': 'bg-blue-100 text-blue-800',
  'Planning': 'bg-amber-100 text-amber-800',
  'Completed': 'bg-emerald-100 text-emerald-800',
  'On Hold': 'bg-red-100 text-red-800',
};

