import { create } from 'zustand';
import { Project, ProjectStatus } from '../models';
import ProjectService from '../services/ProjectService';

interface ProjectStore {
  // State
  projects: Project[];
  selectedProject: Project | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchProjects: () => void;
  getProjectById: (id: number) => Project | undefined;
  getProjectsByStatus: (status: ProjectStatus) => Project[];
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: number, updates: Partial<Project>) => void;
  deleteProject: (id: number) => void;
  selectProject: (project: Project | null) => void;
  getStats: () => { total: number; inProgress: number; completed: number; planning: number };
  clearError: () => void;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  // Initial state
  projects: [],
  selectedProject: null,
  loading: false,
  error: null,
  
  // Fetch all projects
  fetchProjects: () => {
    set({ loading: true });
    try {
      const projects = ProjectService.getAllProjects();
      set({ projects, loading: false });
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch projects' 
      });
    }
  },
  
  // Get project by ID
  getProjectById: (id: number) => {
    return ProjectService.getProjectById(id);
  },
  
  // Get projects by status
  getProjectsByStatus: (status: ProjectStatus) => {
    return ProjectService.getProjectsByStatus(status);
  },
  
  // Add new project
  addProject: (project: Omit<Project, 'id'>) => {
    try {
      const newProject = ProjectService.addProject(project);
      set((state) => ({ 
        projects: [...state.projects, newProject] 
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add project' 
      });
    }
  },
  
  // Update project
  updateProject: (id: number, updates: Partial<Project>) => {
    try {
      const updatedProject = ProjectService.updateProject(id, updates);
      if (updatedProject) {
        set((state) => ({
          projects: state.projects.map(p => 
            p.id === id ? updatedProject : p
          ),
          selectedProject: state.selectedProject?.id === id 
            ? updatedProject 
            : state.selectedProject
        }));
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update project' 
      });
    }
  },
  
  // Delete project
  deleteProject: (id: number) => {
    try {
      const success = ProjectService.deleteProject(id);
      if (success) {
        set((state) => ({
          projects: state.projects.filter(p => p.id !== id),
          selectedProject: state.selectedProject?.id === id 
            ? null 
            : state.selectedProject
        }));
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete project' 
      });
    }
  },
  
  // Select a project
  selectProject: (project: Project | null) => {
    set({ selectedProject: project });
  },
  
  // Get project statistics
  getStats: () => {
    return ProjectService.getStats();
  },
  
  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));

export default useProjectStore;

