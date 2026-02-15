import React, { useState } from 'react';
import { Layout, List, Edit2, Trash2, Calendar, MoreVertical, Grid } from 'lucide-react';
import { Project } from '../models';
import { STATUS_COLORS } from '../constants';

interface ProjectsViewProps {
    projects: Project[];
    onAddProject: () => void;
    onProjectClick: (projectId: number) => void;
    onEditProject: (project: Project) => void;
    onDeleteProject: (projectId: number) => void;
}

const ProjectsView: React.FC<ProjectsViewProps> = ({
    projects,
    onAddProject,
    onProjectClick,
    onEditProject,
    onDeleteProject
}) => {
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">Project Collections</h2>
                    <p className="text-slate-400 font-medium text-sm">Visualize and manage your ongoing workstreams.</p>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex bg-slate-200/50 p-1.5 rounded-2xl border border-slate-100 shadow-inner">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white shadow-md text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <Grid className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('table')}
                            className={`p-2.5 rounded-xl transition-all ${viewMode === 'table' ? 'bg-white shadow-md text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <List className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all group flex flex-col relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            <div className="flex justify-between items-start mb-6">
                                <div onClick={() => onProjectClick(project.id)} className="cursor-pointer">
                                    <h3 className="text-lg font-black text-slate-800 group-hover:text-indigo-600 transition-colors tracking-tight uppercase">{project.name}</h3>
                                    <span className={`inline-block mt-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${STATUS_COLORS[project.status]}`}>
                                        {project.status}
                                    </span>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                                    <button
                                        onClick={() => onEditProject(project)}
                                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onDeleteProject(project.id)}
                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <p onClick={() => onProjectClick(project.id)} className="text-slate-500 text-sm mb-8 line-clamp-3 flex-1 cursor-pointer font-medium leading-relaxed">
                                {project.description || 'No description provided.'}
                            </p>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    <span>Milestones</span>
                                    <span className="text-slate-800">{project.progress}%</span>
                                </div>
                                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 shadow-inner">
                                    <div
                                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700 ease-out"
                                        style={{ width: `${project.progress}%` }}
                                    />
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-50 flex justify-between items-center">
                                <div className="flex -space-x-3">
                                    {(project.memberIds || []).slice(0, 3).map((id) => (
                                        <div key={id} className="w-9 h-9 rounded-xl border-4 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-600 shadow-sm ring-1 ring-slate-100">
                                            {id.substring(0, 2).toUpperCase()}
                                        </div>
                                    ))}
                                    {(project.memberIds?.length || 0) > 3 && (
                                        <div className="w-9 h-9 rounded-xl border-4 border-white bg-indigo-50 flex items-center justify-center text-[10px] font-black text-indigo-600 shadow-sm ring-1 ring-indigo-100">
                                            +{(project.memberIds?.length || 0) - 3}
                                        </div>
                                    )}
                                </div>
                                <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
                                    <Calendar className="w-3 h-3" /> Due <span className="text-slate-800 ml-1">{project.dueDate}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identification</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Advancement</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Deadline</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {projects.map((project) => (
                                <tr
                                    key={project.id}
                                    className="hover:bg-indigo-50/30 transition-colors group"
                                >
                                    <td onClick={() => onProjectClick(project.id)} className="px-8 py-6 cursor-pointer">
                                        <div className="text-sm font-black text-slate-800 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{project.name}</div>
                                        <div className="text-[10px] text-slate-400 mt-1 font-medium italic line-clamp-1">{project.description || 'No description'}</div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${STATUS_COLORS[project.status]}`}>
                                            {project.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4 w-56">
                                            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden p-0.5">
                                                <div
                                                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                                                    style={{ width: `${project.progress}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-black text-slate-600">{project.progress}%</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                                        {project.dueDate}
                                    </td>
                                    <td className="px-8 py-6 text-right space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => onEditProject(project)}
                                            className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-white hover:shadow-md rounded-xl transition-all"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => onDeleteProject(project.id)}
                                            className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-white hover:shadow-md rounded-xl transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ProjectsView;
