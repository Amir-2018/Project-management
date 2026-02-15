import { Project, ProjectStatus } from '../models';

// Project service for handling project-related operations
export class ProjectService {
  private static STORAGE_KEY = 'camping_management_projects';

  private static getProjects(): Project[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) {
      const initialProjects: Project[] = [
        { id: 1, name: 'Website Redesign', status: 'In Progress', progress: 75, dueDate: '2024-02-15', description: 'Complete redesign of company website', memberIds: ['m1', 'm2'] },
        { id: 2, name: 'Mobile App Development', status: 'Planning', progress: 30, dueDate: '2024-03-01', description: 'Develop iOS and Android app', memberIds: ['m1', 'm3'] },
        { id: 3, name: 'Database Migration', status: 'Completed', progress: 100, dueDate: '2024-01-20', description: 'Migrate to new database server', memberIds: ['m3'] },
        { id: 4, name: 'API Integration', status: 'In Progress', progress: 50, dueDate: '2024-02-28', description: 'Integrate third-party APIs', memberIds: ['m1', 'm4'] },
        { id: 5, name: 'Security Audit', status: 'On Hold', progress: 0, dueDate: '2024-04-15', description: 'Complete security vulnerability assessment', memberIds: ['m4'] },
      ];
      this.saveProjects(initialProjects);
      return initialProjects;
    }
    return JSON.parse(stored);
  }

  private static saveProjects(projects: Project[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(projects));
  }

  static getAllProjects(): Project[] {
    return this.getProjects();
  }

  static getProjectById(id: number): Project | undefined {
    return this.getProjects().find(p => p.id === id);
  }

  static addProject(project: Omit<Project, 'id'>): Project {
    const projects = this.getProjects();
    const newProject: Project = {
      ...project,
      id: projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1,
    };
    projects.push(newProject);
    this.saveProjects(projects);
    return newProject;
  }

  static updateProject(id: number, updates: Partial<Project>): Project | null {
    const projects = this.getProjects();
    const index = projects.findIndex(p => p.id === id);
    if (index !== -1) {
      projects[index] = { ...projects[index], ...updates };
      this.saveProjects(projects);
      return projects[index];
    }
    return null;
  }

  static deleteProject(id: number): boolean {
    const projects = this.getProjects();
    const filtered = projects.filter(p => p.id !== id);
    if (filtered.length !== projects.length) {
      this.saveProjects(filtered);
      return true;
    }
    return false;
  }

  static getStats() {
    const projects = this.getProjects();
    return {
      total: projects.length,
      inProgress: projects.filter(p => p.status === 'In Progress').length,
      completed: projects.filter(p => p.status === 'Completed').length,
      planning: projects.filter(p => p.status === 'Planning').length,
    };
  }
}

export default ProjectService;

