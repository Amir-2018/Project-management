import React, { useState, useRef, useEffect } from 'react';
import { Layout, Users, BarChart3, LogOut, Plus, X, Calendar, Edit2, Trash2, CheckCircle2, ChevronDown, Globe, Briefcase, Bell } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useProjectController, useTaskController, useTeamController, useNotificationController } from '../controllers';
import { APP_NAME, STATUS_COLORS } from '../constants';
import { Project, ProjectStatus, Task, Member } from '../models';
import ProjectsView from './ProjectsView';
import TasksView from './TasksView';
import TeamView from './TeamView';
import MembersView from './MembersView';
import StatisticsView from './StatisticsView';
import CreateTaskModal from './CreateTaskModal';
import ConfirmModal from './ConfirmModal';

// Modal component for managing project (Create/Edit)
// Modal component for managing project (Create/Edit)
const ProjectModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (project: Omit<Project, 'id'>) => void;
  initialData?: Project | null;
  members: Member[];
  teams: Team[];
}> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  members,
  teams
}) => {
    const { t } = useTranslation();
    const [name, setName] = useState(initialData?.name || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [status, setStatus] = useState<ProjectStatus>(initialData?.status || 'Planning');
    const [dueDate, setDueDate] = useState(initialData?.dueDate || '');
    const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>(initialData?.memberIds || []);
    const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>(initialData?.teamIds || []);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit({
        name,
        description,
        status,
        progress: initialData?.progress || 0,
        dueDate,
        memberIds: selectedMemberIds,
        teamIds: selectedTeamIds
      });
      onClose();
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in duration-200 text-left">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">{initialData ? t('modals.project.edit') : t('modals.project.create')}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl transition-colors">&times;</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">{t('modals.project.name')}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                placeholder={t('modals.project.name_placeholder')}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">{t('modals.project.description')}</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                placeholder={t('modals.project.description_placeholder')}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">{t('modals.project.status')}</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                >
                  <option value="Planning">{t('tasks.todo')}</option>
                  <option value="In Progress">{t('tasks.in_progress')}</option>
                  <option value="Completed">{t('tasks.done')}</option>
                  <option value="On Hold">On Hold</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">{t('modals.project.due_date')}</label>
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
              <label className="text-sm font-semibold text-gray-700">{t('modals.project.assign_members')}</label>
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

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">{t('modals.project.assign_teams') || 'Assign Teams'}</label>
              <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto p-2 border border-gray-100 rounded-xl">
                {teams.map(team => (
                  <label key={team.id} className="flex items-center gap-2 px-2 py-1 bg-gray-50 rounded-lg cursor-pointer hover:bg-indigo-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedTeamIds.includes(team.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTeamIds([...selectedTeamIds, team.id]);
                        } else {
                          setSelectedTeamIds(selectedTeamIds.filter(id => id !== team.id));
                        }
                      }}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-xs font-medium text-gray-700">{team.name}</span>
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
                {t('modals.task.cancel')}
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg"
              >
                {initialData ? t('modals.project.update_button') : t('modals.project.create')}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

// Sidebar component
const Sidebar: React.FC<{ activeTab: string; setActiveTab: (tab: string) => void; role?: string }> = ({
  activeTab,
  setActiveTab,
  role = 'Admin'
}) => {
  const { t } = useTranslation();

  const allNavItems = [
    { id: 'projects', icon: <Layout className="w-5 h-5" />, label: t('common.projects'), roles: ['Admin', 'Member'] },
    { id: 'my-tasks', icon: <CheckCircle2 className="w-5 h-5" />, label: t('common.my_tasks'), roles: ['Member'] },
    { id: 'members', icon: <Users className="w-5 h-5" />, label: t('common.members'), roles: ['Admin'] },
    { id: 'team', icon: <Globe className="w-5 h-5" />, label: t('common.team'), roles: ['Admin'] },
    { id: 'statistics', icon: <BarChart3 className="w-5 h-5" />, label: t('common.statistics'), roles: ['Admin', 'Member'] },
  ];

  const navItems = allNavItems.filter(item => item.roles.includes(role));

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
    </aside>
  );
};

// Dashboard View component
const DashboardView: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const { allProjects, addProject, updateProject, deleteProject } = useProjectController();
  const {
    teams,
    members,
    addTeam,
    deleteTeam,
    updateTeam,
    assignMember,
    removeMember,
    addMember,
    updateMember,
    deleteMember
  } = useTeamController();
  const {
    tasks,
    addTask,
    updateTaskStatus,
    updateTask,
    addComment,
    addAttachment,
    deleteTask
  } = useTaskController();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead
  } = useNotificationController();

  const [activeTab, setActiveTab] = useState<string>('projects');
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsProfileOpen(false);
  };

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

  const filteredProjects = user?.role === 'Admin'
    ? allProjects
    : allProjects.filter(p => p.memberIds?.some(mid => members.find(m => m.id === mid)?.email === user?.email));

  const userTasks = user?.role === 'Admin'
    ? tasks
    : tasks.filter(t => members.find(m => m.id === t.assignee)?.email === user?.email);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} role={user?.role} />

      <main className="flex-1 ml-64 p-12">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tight capitalize">{t(`common.${activeTab}`)}</h1>
            <p className="text-slate-400 font-medium mt-1">{t('dashboard.empowering')}</p>
          </div>
          <div className="flex items-center gap-6">
            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-3 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all text-slate-400 hover:text-indigo-600 group"
              >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-bounce-subtle">
                    {unreadCount}
                  </span>
                )}
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-4 duration-200">
                  <div className="px-6 py-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">{t('dashboard.notifications')}</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-700"
                      >
                        {t('dashboard.mark_all_read')}
                      </button>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map(notif => (
                        <button
                          key={notif.id}
                          onClick={() => markAsRead(notif.id)}
                          className={`w-full text-left p-6 border-b border-slate-50 hover:bg-slate-50 transition-colors flex gap-4 ${!notif.isRead ? 'bg-indigo-50/30' : ''}`}
                        >
                          <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${!notif.isRead ? 'bg-indigo-600' : 'bg-transparent'}`} />
                          <div>
                            <p className="text-xs font-black text-slate-800 uppercase tracking-tight mb-1">{notif.title}</p>
                            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{notif.message}</p>
                            <p className="text-[9px] text-slate-400 font-bold mt-2 uppercase tracking-widest">
                              {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="p-12 text-center">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mx-auto mb-4">
                          <Bell className="w-6 h-6" />
                        </div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('dashboard.no_notifications')}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-4 bg-white p-2 pr-4 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xl font-black border-4 border-indigo-50 shadow-inner group-hover:scale-105 transition-transform">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
                <div className="text-left">
                  <div className="text-sm font-black text-slate-800 tracking-tight">{user?.username}</div>
                  <div className="text-[10px] font-black text-indigo-500 uppercase tracking-widest leading-none mt-1">
                    {user?.role === 'Admin' ? 'Superadmin' : t('common.member')}
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-[2rem] shadow-2xl border border-slate-100 py-4 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
                  <div className="px-6 py-4 border-b border-slate-50">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Language</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => changeLanguage('en')}
                        className={`flex-1 py-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${i18n.language.startsWith('en') ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                      >
                        <span className="text-lg">🇬🇧</span>
                        <span className="text-[10px] font-black uppercase">EN</span>
                      </button>
                      <button
                        onClick={() => changeLanguage('fr')}
                        className={`flex-1 py-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${i18n.language.startsWith('fr') ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                      >
                        <span className="text-lg">🇫🇷</span>
                        <span className="text-[10px] font-black uppercase">FR</span>
                      </button>
                    </div>
                  </div>
                  <div className="p-2">
                    <button className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-all group">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-white transition-colors">
                        <Users className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-wide">{t('common.profile')}</span>
                    </button>
                    <div className="h-px bg-slate-50 mx-4 my-2"></div>
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl hover:bg-red-50 text-red-500 transition-all group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center group-hover:bg-white transition-colors">
                        <LogOut className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-wide">{t('common.logout')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="w-full">
          {activeTab === 'projects' && (
            <ProjectsView
              projects={filteredProjects}
              onAddProject={() => { setEditingProject(null); setIsProjectModalOpen(true); }}
              onProjectClick={handleProjectClick}
              onEditProject={(p) => { setEditingProject(p); setIsProjectModalOpen(true); }}
              onDeleteProject={(id) => setProjectToDelete(id)}
            />
          )}

          {activeTab === 'tasks' && selectedProjectId && (
            <TasksView
              tasks={tasks.filter(t => t.projectId === selectedProjectId)}
              members={members}
              onAddTask={() => setIsTaskModalOpen(true)}
              onUpdateStatus={updateTaskStatus}
              onUpdateTask={updateTask}
              onAddComment={(taskId, text) => addComment(taskId, user?.username || 'user', user?.username || 'User', text)}
              onAddAttachment={(taskId, file) => addAttachment(taskId, {
                name: file.name,
                type: file.type.split('/')[1] || 'bin',
                size: file.size,
                url: '#'
              })}
              onDeleteTask={deleteTask}
              onBack={handleBackToProjects}
            />
          )}

          {activeTab === 'my-tasks' && (
            <TasksView
              tasks={userTasks}
              members={members}
              onAddTask={() => { }} // Members might not be able to add tasks globally
              onUpdateStatus={updateTaskStatus}
              onUpdateTask={updateTask}
              onAddComment={(taskId, text) => addComment(taskId, user?.username || 'user', user?.username || 'User', text)}
              onAddAttachment={(taskId, file) => addAttachment(taskId, {
                name: file.name,
                type: file.type.split('/')[1] || 'bin',
                size: file.size,
                url: '#'
              })}
              onDeleteTask={deleteTask}
              onBack={() => setActiveTab('projects')}
            />
          )}

          {activeTab === 'team' && (
            <TeamView
              teams={teams}
              members={members}
              projects={allProjects}
              onAddTeam={addTeam}
              onUpdateTeam={updateTeam}
              onDeleteTeam={deleteTeam}
              onAssignMember={assignMember}
              onRemoveMember={removeMember}
            />
          )}

          {activeTab === 'members' && (
            <MembersView
              members={members}
              teams={teams}
              projects={allProjects}
              onAddMember={addMember}
              onUpdateMember={updateMember}
              onDeleteMember={deleteMember}
              onAssignToTeam={assignMember}
              onRemoveFromTeam={removeMember}
            />
          )}

          {activeTab === 'statistics' && (
            <StatisticsView
              projects={filteredProjects}
              tasks={userTasks}
            />
          )}
        </div>
      </main>

      {isProjectModalOpen && (
        <ProjectModal
          isOpen={isProjectModalOpen}
          initialData={editingProject}
          members={members}
          teams={teams}
          onClose={() => { setIsProjectModalOpen(false); setEditingProject(null); }}
          onSubmit={handleProjectSubmit}
        />
      )}

      {isTaskModalOpen && selectedProjectId && (
        <CreateTaskModal
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
          onSubmit={(task) => {
            addTask({ ...task, projectId: selectedProjectId });
            setIsTaskModalOpen(false);
          }}
          members={members}
        />
      )}

      <ConfirmModal
        isOpen={!!projectToDelete}
        onClose={() => setProjectToDelete(null)}
        onConfirm={() => {
          if (projectToDelete) {
            deleteProject(projectToDelete);
            setProjectToDelete(null);
          }
        }}
        title={t('modals.confirm.title')}
        message={t('modals.confirm.delete_project', { name: allProjects.find(p => p.id === projectToDelete)?.name })}
      />

      {/* Floating Action Button */}
      <button
        onClick={() => {
          if (activeTab === 'projects') {
            setEditingProject(null);
            setIsProjectModalOpen(true);
          } else if (activeTab === 'tasks') {
            setIsTaskModalOpen(true);
          } else if (activeTab === 'members') {
            window.dispatchEvent(new CustomEvent('trigger-add-member'));
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
