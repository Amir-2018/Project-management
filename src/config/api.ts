// API Configuration
export const API_CONFIG = {
    BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    TIMEOUT: 10000,
};

// API Endpoints
export const API_ENDPOINTS = {
    // Auth
    AUTH: {
        REGISTER: '/auth/register',
        LOGIN: '/auth/login',
        ME: '/auth/me',
    },
    // Users
    USERS: {
        BASE: '/users',
        BY_ID: (id: string) => `/users/${id}`,
    },
    // Projects
    PROJECTS: {
        BASE: '/projects',
        BY_ID: (id: string) => `/projects/${id}`,
        ADD_MEMBER: (id: string) => `/projects/${id}/members`,
        REMOVE_MEMBER: (id: string, userId: string) => `/projects/${id}/members/${userId}`,
    },
    // Tasks
    TASKS: {
        BASE: '/tasks',
        BY_ID: (id: string) => `/tasks/${id}`,
    },
};
