import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProjectController } from '../controllers';
import { APP_NAME, STATUS_COLORS } from '../constants';
import { Project, ProjectStatus } from '../models';

// Sidebar component
const Sidebar: React.FC<{ activeTab: string; setActiveTab: (tab: string) => void; onLogout: () => void }> = ({ 
  activeTab, 
  setActiveTab, 
  onLogout 
}) => {
  const navItems = [
    { id: 'overview', icon: '📊', label: 'Overview' },
    { id: 'projects', icon: '📁', label: 'Projects' },
    { id: 'tasks', icon: '✅', label: 'Tasks' },
    { id: 'team', icon: '👥', label: 'Team' },
    { id: 'settings', icon: '⚙️', label: 'Settings' },
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 text-white flex flex-col fixed h-screen">
      <div className="p-6 border-b border-white/10">
        <h2 className="text-2xl font-bold">{APP_NAME}</h2>
      </div>
      <nav className="flex-1 p-4 flex flex-col gap-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left ${
              activeTab === item.id 
                ? 'bg-white/20 font-semibold' 
                : 'hover:bg-white/10 text-white/80'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-white/10">
        <button 
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/10 hover:bg-red-500/80 transition-all duration-200 w-full text-left"
        >
          <span className="text-lg">🚪</span>
          Logout
        </button>
      </div>
    </aside>
  );
};

// Stats Card component
const StatsCard: React.FC<{ label: string; value: number; icon: string }> = ({ label, value, icon }) => (
  <div className="bg-white rounded-xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow duration-200">
    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-2xl">
      {icon}
    </div>
    <div className="flex flex-col">
      <span className="text-2xl font-bold text-gray-800">{value}</span>
      <span className="text-sm text-gray-500">{label}</span>
    </div>
  </div>
);

// Project Row component
const ProjectRow: React.FC<{ project: Project }> = ({ project }) => (
  <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
    <td className="py-4 px-4 font-medium text-gray-800">{project.name}</td>
    <td className="py-4 px-4">
      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[project.status]}`}>
        {project.status}
      </span>
    </td>
    <td className="py-4 px-4">
      <div className="flex items-center gap-2">
        <div className="w-28 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full transition-all duration-300"
            style={{ width: `${project.progress}%` }}
          />
        </div>
        <span className="text-xs text-gray-500 w-8">{project.progress}%</span>
      </div>
    </td>
    <td className="py-4 px-4 text-gray-500 text-sm">{project.dueDate}</td>
  </tr>
);

// Dashboard View component
const DashboardView: React.FC = () => {
  const { user, logout } = useAuth();
  const { stats, allProjects } = useProjectController();
  const [activeTab, setActiveTab] = useState<string>('overview');

  const statCards = [
    { label: 'Total Projects', value: stats.total, icon: '📁' },
    { label: 'In Progress', value: stats.inProgress, icon: '⚡' },
    { label: 'Completed', value: stats.completed, icon: '✅' },
    { label: 'Planning', value: stats.planning, icon: '📋' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={logout} />
      
      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Welcome back, <strong>{user?.username}</strong></p>
          </div>
          <div className="w-11 h-11 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white flex items-center justify-center text-lg font-semibold">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
        </header>

        {/* Stats Grid */}
        <section className="grid grid-cols-4 gap-5 mb-8">
          {statCards.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </section>

        {/* Projects Section */}
        <section className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-semibold text-gray-800">Projects</h2>
            <button className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200">
              + New Project
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-100">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Project Name</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Progress</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {allProjects.map((project) => (
                  <ProjectRow key={project.id} project={project} />
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DashboardView;

