import React from 'react';
import { Project } from '../models';
import { STATUS_COLORS } from '../constants';

interface ProjectsViewProps {
    projects: Project[];
    onAddProject: () => void;
    onProjectClick: (projectId: number) => void;
}

const ProjectsView: React.FC<ProjectsViewProps> = ({ projects, onAddProject, onProjectClick }) => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Projects</h2>
                    <p className="text-gray-500 text-sm">Manage and track all your active projects.</p>
                </div>
                <button
                    onClick={onAddProject}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                    <span className="text-xl">+</span> New Project
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <div
                        key={project.id}
                        onClick={() => onProjectClick(project.id)}
                        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group cursor-pointer"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">{project.name}</h3>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_COLORS[project.status]}`}>
                                {project.status}
                            </span>
                        </div>

                        <p className="text-gray-500 text-sm mb-6 line-clamp-2">
                            {project.description || 'No description provided.'}
                        </p>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-xs text-gray-400">
                                <span>Progress</span>
                                <span className="font-semibold text-gray-700">{project.progress}%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                                    style={{ width: `${project.progress}%` }}
                                />
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-50 flex justify-between items-center">
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-500">
                                        {String.fromCharCode(64 + i)}
                                    </div>
                                ))}
                            </div>
                            <div className="text-xs text-gray-400">
                                Due: <span className="text-gray-600 font-medium">{project.dueDate}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectsView;
