import React, { useState } from 'react';
import { Layout, Users, BarChart3, LogOut, Plus, X, Calendar, Edit2, Trash2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProjectController, useTaskController, useTeamController } from '../controllers';
import { APP_NAME, STATUS_COLORS } from '../constants';
import { Project, ProjectStatus, Task, Member } from '../models';
import ProjectsView from './ProjectsView';
import TasksView from './TasksView';
import TeamView from './TeamView';
import StatisticsView from './StatisticsView';
import CreateTaskModal from './CreateTaskModal';

// Modal component for managing project (Create/Edit)
const ProjectModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (project: Omit<Project, 'id'>) => void;
  initialData?: Project | null;
  members: Member[];
}> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  members
}) => {
    const [name, setName] = useState(initialData?.name || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [status, setStatus] = useState<ProjectStatus>(initialData?.status || 'Planning');
    const [dueDate, setDueDate] = useState(initialData?.dueDate || '');
    const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>(initialData?.memberIds || []);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit({
        name,
        description,
        status,
        progress: initialData?.progress || 0,
        dueDate,
        memberIds: selectedMemberIds
      });
      onClose();
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in duration-200 text-left">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">{initialData ? 'Edit Project' : 'Create New Project'}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl transition-colors">&times;</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Project Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                placeholder="Enter project name"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                placeholder="Enter project description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                >
                  <option value="Planning">Planning</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="On Hold">On Hold</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Assign Members</label>
              <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto p-2 border border-gray-100 rounded-xl">
                {members.map(member => (
                  <label key={member.id} className="flex items-center gap-2 px-2 py-1 bg-gray-50 rounded-lg cursor-pointer hover:bg-indigo-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedMemberIds.includes(member.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedMemberIds([...selectedMemberIds, member.id]);
                        } else {
                          setSelectedMemberIds(selectedMemberIds.filter(id => id !== member.id));
                        }
                      }}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-xs font-medium text-gray-700">{member.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg"
              >
                {initialData ? 'Update Project' : 'Create Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

// Sidebar component
const Sidebar: React.FC<{ activeTab: string; setActiveTab: (tab: string) => void; onLogout: () => void }> = ({
  activeTab,
  setActiveTab,
  onLogout
}) => {
  const navItems = [
    { id: 'projects', icon: <Layout className="w-5 h-5" />, label: 'Projects' },
    { id: 'team', icon: <Users className="w-5 h-5" />, label: 'Team' },
    { id: 'statistics', icon: <BarChart3 className="w-5 h-5" />, label: 'Statistique' },
  ];

  return (
    <aside className="w-64 bg-indigo-600 text-white flex flex-col fixed h-screen shadow-2xl z-20">
      <div className="p-8 border-b border-white/10 flex items-center gap-3 font-black tracking-tighter italic">
        <Layout className="w-8 h-8" />
        <h2 className="text-2xl uppercase tracking-tighter">{APP_NAME}</h2>
      </div>
      <nav className="flex-1 p-4 mt-4 flex flex-col gap-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 text-left group ${activeTab === item.id
              ? 'bg-white text-indigo-600 shadow-xl shadow-indigo-900/20 font-bold scale-105'
              : 'hover:bg-white/10 text-white/70 hover:text-white'
              }`}
          >
            <span className={`transition-transform group-hover:scale-110`}>{item.icon}</span>
            <span className="tracking-wide uppercase text-xs font-black">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-white/10">
        <button
          onClick={onLogout}
          className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/5 hover:bg-red-500 transition-all duration-300 w-full text-left group"
        >
          <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span className="tracking-wide uppercase text-xs font-black text-white/70 group-hover:text-white">Logout</span>
        </button>
      </div>
    </aside>
  );
};

// Dashboard View component
const DashboardView: React.FC = () => {
  const { user, logout } = useAuth();
  const { allProjects, addProject, updateProject, deleteProject } = useProjectController();
  const { teams, members, addTeam, deleteTeam, assignMember, removeMember } = useTeamController();
  const {
    tasks,
    addTask,
    updateTaskStatus,
    addComment,
    addAttachment
  } = useTaskController();

  const [activeTab, setActiveTab] = useState<string>('projects');
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const handleProjectSubmit = (projectData: Omit<Project, 'id'>) => {
    if (editingProject) {
      updateProject(editingProject.id, projectData);
    } else {
      addProject(projectData);
    }
    setIsProjectModalOpen(false);
    setEditingProject(null);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsProjectModalOpen(true);
  };

  const handleAddTask = (taskData: Omit<Task, 'id' | 'projectId'>) => {
    if (selectedProjectId) {
      addTask({ ...taskData, projectId: selectedProjectId });
    }
  };

  const handleProjectClick = (projectId: number) => {
    setSelectedProjectId(projectId);
    setActiveTab('tasks');
  };

  const handleBackToProjects = () => {
    setSelectedProjectId(null);
    setActiveTab('projects');
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={logout} />

      <main className="flex-1 ml-64 p-12">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tight capitalize">{activeTab}</h1>
            <p className="text-slate-400 font-medium mt-1">Empowering your collaborative workflow.</p>
          </div>
          <div className="flex items-center gap-4 bg-white p-2 pr-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xl font-black border-4 border-indigo-50 shadow-inner">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="text-left">
              <div className="text-sm font-black text-slate-800 tracking-tight">{user?.username}</div>
            </div>
          </div>
        </header>

        <div className="w-full">
          {activeTab === 'projects' && (
            <ProjectsView
              projects={allProjects}
              onAddProject={() => { setEditingProject(null); setIsProjectModalOpen(true); }}
              onProjectClick={handleProjectClick}
              onEditProject={handleEditProject}
              onDeleteProject={deleteProject}
            />
          )}

          {activeTab === 'tasks' && selectedProjectId && (
            <TasksView
              tasks={tasks.filter(t => t.projectId === selectedProjectId)}
              onAddTask={() => setIsTaskModalOpen(true)}
              onUpdateStatus={updateTaskStatus}
              onAddComment={(taskId, text) => addComment(taskId, user?.username || 'user', user?.username || 'User', text)}
              onAddAttachment={(taskId, file) => addAttachment(taskId, {
                name: file.name,
                type: file.type.split('/')[1] || 'bin',
                size: file.size,
                url: '#'
              })}
              onBack={handleBackToProjects}
            />
          )}

          {activeTab === 'team' && (
            <TeamView
              teams={teams}
              members={members}
              projects={allProjects}
              onAddTeam={addTeam}
              onDeleteTeam={deleteTeam}
              onAssignMember={assignMember}
              onRemoveMember={removeMember}
            />
          )}

          {activeTab === 'statistics' && (
            <StatisticsView
              projects={allProjects}
              tasks={tasks}
            />
          )}
        </div>
      </main>

      {isProjectModalOpen && (
        <ProjectModal
          isOpen={isProjectModalOpen}
          initialData={editingProject}
          members={members}
          onClose={() => { setIsProjectModalOpen(false); setEditingProject(null); }}
          onSubmit={handleProjectSubmit}
        />
      )}

      {isTaskModalOpen && (
        <CreateTaskModal
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
          onSave={handleAddTask}
          members={members}
        />
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => {
          if (activeTab === 'projects') {
            setEditingProject(null);
            setIsProjectModalOpen(true);
          } else if (activeTab === 'tasks') {
            setIsTaskModalOpen(true);
          } else if (activeTab === 'team') {
            window.dispatchEvent(new CustomEvent('trigger-add-team'));
          }
        }}
        className="fixed bottom-12 right-12 w-16 h-16 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-indigo-700 hover:scale-110 transition-all z-50 animate-bounce-subtle"
        title={`Add New ${activeTab}`}
      >
        <Plus className="w-8 h-8" />
      </button>

      <style>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 3s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default DashboardView;
