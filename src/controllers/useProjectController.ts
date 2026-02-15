import { useState, useCallback, useMemo } from 'react';
import { Project, ProjectStatus } from '../models';
import { ProjectService } from '../services';

// Custom hook for project management logic
export const useProjectController = () => {
  const [projects, setProjects] = useState<Project[]>(() => ProjectService.getAllProjects());
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filterStatus, setFilterStatus] = useState<ProjectStatus | 'All'>('All');

  const filteredProjects = useMemo(() => {
    if (filterStatus === 'All') {
      return projects;
    }
    return projects.filter(p => p.status === filterStatus);
  }, [projects, filterStatus]);

  const stats = useMemo(() => ProjectService.getStats(), [projects]);

  const addProject = useCallback((project: Omit<Project, 'id'>) => {
    const newProject = ProjectService.addProject(project);
    setProjects(prev => [...prev, newProject]);
    return newProject;
  }, []);

  const updateProject = useCallback((id: number, updates: Partial<Project>) => {
    const updated = ProjectService.updateProject(id, updates);
    if (updated) {
      setProjects(prev => prev.map(p => p.id === id ? updated : p));
      if (selectedProject?.id === id) {
        setSelectedProject(updated);
      }
    }
    return updated;
  }, [selectedProject]);

  const deleteProject = useCallback((id: number) => {
    const success = ProjectService.deleteProject(id);
    if (success) {
      setProjects(prev => prev.filter(p => p.id !== id));
      if (selectedProject?.id === id) {
        setSelectedProject(null);
      }
    }
    return success;
  }, [selectedProject]);

  const selectProject = useCallback((project: Project | null) => {
    setSelectedProject(project);
  }, []);

  const changeFilter = useCallback((status: ProjectStatus | 'All') => {
    setFilterStatus(status);
  }, []);

  return {
    projects: filteredProjects,
    allProjects: projects,
    selectedProject,
    filterStatus,
    stats,
    addProject,
    updateProject,
    deleteProject,
    selectProject,
    changeFilter,
  };
};

export default useProjectController;

