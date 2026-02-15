import { Project, ProjectStatus } from '../models';

// Project service for handling project-related operations
export class ProjectService {
  // Mock projects data
  private static projects: Project[] = [
    { id: 1, name: 'Website Redesign', status: 'In Progress', progress: 75, dueDate: '2024-02-15', description: 'Complete redesign of company website' },
    { id: 2, name: 'Mobile App Development', status: 'Planning', progress: 30, dueDate: '2024-03-01', description: 'Develop iOS and Android app' },
    { id: 3, name: 'Database Migration', status: 'Completed', progress: 100, dueDate: '2024-01-20', description: 'Migrate to new database server' },
    { id: 4, name: 'API Integration', status: 'In Progress', progress: 50, dueDate: '2024-02-28', description: 'Integrate third-party APIs' },
    { id: 5, name: 'Security Audit', status: 'On Hold', progress: 0, dueDate: '2024-04-15', description: 'Complete security vulnerability assessment' },
  ];

  // Get all projects
  static getAllProjects(): Project[] {
    return [...this.projects];
  }

  // Get project by ID
  static getProjectById(id: number): Project | undefined {
    return this.projects.find(p => p.id === id);
  }

  // Get projects by status
  static getProjectsByStatus(status: ProjectStatus): Project[] {
    return this.projects.filter(p => p.status === status);
  }

  // Add new project
  static addProject(project: Omit<Project, 'id'>): Project {
    const newProject: Project = {
      ...project,
      id: Math.max(...this.projects.map(p => p.id)) + 1,
    };
    this.projects.push(newProject);
    return newProject;
  }

  // Update project
  static updateProject(id: number, updates: Partial<Project>): Project | null {
    const index = this.projects.findIndex(p => p.id === id);
    if (index !== -1) {
      this.projects[index] = { ...this.projects[index], ...updates };
      return this.projects[index];
    }
    return null;
  }

  // Delete project
  static deleteProject(id: number): boolean {
    const index = this.projects.findIndex(p => p.id === id);
    if (index !== -1) {
      this.projects.splice(index, 1);
      return true;
    }
    return false;
  }

  // Get project statistics
  static getStats(): { total: number; inProgress: number; completed: number; planning: number } {
    return {
      total: this.projects.length,
      inProgress: this.projects.filter(p => p.status === 'In Progress').length,
      completed: this.projects.filter(p => p.status === 'Completed').length,
      planning: this.projects.filter(p => p.status === 'Planning').length,
    };
  }
}

export default ProjectService;

