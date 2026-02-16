import React, { useMemo } from 'react';
import { Layout, TrendingUp, CheckCircle2, Zap, BarChart3, Users, ListTodo, Clock, CheckSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Project, Task, Member, TaskStatus } from '../models';

interface StatisticsViewProps {
    projects: Project[];
    tasks: Task[];
    allTasks: Task[];
    members: Member[];
}

const StatisticsView: React.FC<StatisticsViewProps> = ({ projects, tasks, allTasks, members }) => {
    const { t } = useTranslation();

    const stats = useMemo(() => {
        const totalProjects = projects.length;
        const totalTasks = tasks.length;
        
        // Task status distribution
        const statusCounts: Record<TaskStatus, number> = {
            'To Do': tasks.filter(t => t.status === 'To Do').length,
            'In Progress': tasks.filter(t => t.status === 'In Progress').length,
            'Done': tasks.filter(t => t.status === 'Done').length,
            'Finished': tasks.filter(t => t.status === 'Finished').length
        };

        // Tasks per member
        const tasksByMember = members.map(member => ({
            name: member.name,
            count: allTasks.filter(t => t.assignee === member.name).length,
            completed: allTasks.filter(t => t.assignee === member.name && (t.status === 'Done' || t.status === 'Finished')).length
        })).sort((a, b) => b.count - a.count);

        return { totalProjects, totalTasks, statusCounts, tasksByMember };
    }, [projects, tasks, allTasks, members]);

    const isSingleMember = members.length === 1;

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: t('common.projects'), value: stats.totalProjects, icon: <Layout className="w-6 h-6" />, color: 'bg-indigo-500' },
                    { label: isSingleMember ? 'My Tasks' : t('common.tasks'), value: stats.totalTasks, icon: <ListTodo className="w-6 h-6" />, color: 'bg-blue-500' },
                    { label: t('tasks.in_progress'), value: stats.statusCounts['In Progress'], icon: <Clock className="w-6 h-6" />, color: 'bg-amber-500' },
                    { label: t('tasks.done'), value: stats.statusCounts['Done'] + stats.statusCounts['Finished'], icon: <CheckSquare className="w-6 h-6" />, color: 'bg-emerald-500' }
                ].map((item, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-xl transition-all">
                        <div className={`w-14 h-14 ${item.color} text-white rounded-2xl flex items-center justify-center shadow-lg ring-4 ring-white`}>
                            {item.icon}
                        </div>
                        <div>
                            <div className="text-2xl font-black text-slate-800 tracking-tight">{item.value}</div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Tasks Status Breakdown */}
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                    <div className="mb-8">
                        <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase">
                            {isSingleMember ? 'My Task Status' : 'Task Status Breakdown'}
                        </h3>
                        <p className="text-slate-400 text-xs font-medium">
                            {isSingleMember ? 'Distribution of my tasks by status' : 'Distribution of tasks by their current status'}
                        </p>
                    </div>

                    <div className="space-y-6">
                        {(Object.entries(stats.statusCounts) as [TaskStatus, number][]).map(([status, count]) => {
                            const percentage = stats.totalTasks > 0 ? Math.round((count / stats.totalTasks) * 100) : 0;
                            const color = status === 'To Do' ? 'bg-slate-400' : 
                                          status === 'In Progress' ? 'bg-blue-500' :
                                          status === 'Done' ? 'bg-emerald-500' : 'bg-indigo-600';
                            
                            return (
                                <div key={status} className="space-y-2">
                                    <div className="flex justify-between items-end">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${color}`}></div>
                                            <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{status}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-sm font-black text-slate-800">{count}</span>
                                            <span className="text-[10px] font-bold text-slate-400 ml-2">{percentage}%</span>
                                        </div>
                                    </div>
                                    <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full ${color} transition-all duration-1000`} 
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Tasks by Member / Performance */}
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                    <div className="mb-8">
                        <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase">
                            {isSingleMember ? 'My Performance' : 'Tasks by Member'}
                        </h3>
                        <p className="text-slate-400 text-xs font-medium">
                            {isSingleMember ? 'My task completion summary' : 'Workload distribution across the team'}
                        </p>
                    </div>

                    <div className="overflow-hidden">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-50">
                                    <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{isSingleMember ? 'User' : 'Member'}</th>
                                    <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Total</th>
                                    <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Completed</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {stats.tasksByMember.map((m, i) => (
                                    <tr key={i} className="group">
                                        <td className="py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-[10px] font-black text-indigo-600 uppercase">
                                                    {m.name.charAt(0)}
                                                </div>
                                                <span className="text-xs font-bold text-slate-700 uppercase tracking-tight">{m.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 text-center">
                                            <span className="text-sm font-black text-slate-800">{m.count}</span>
                                        </td>
                                        <td className="py-4 text-right">
                                            <div className="inline-flex items-center gap-2">
                                                <span className="text-xs font-bold text-emerald-600">{m.completed}</span>
                                                <div className="w-12 h-1 bg-slate-50 rounded-full overflow-hidden">
                                                    <div 
                                                        className="h-full bg-emerald-500" 
                                                        style={{ width: `${m.count > 0 ? (m.completed / m.count) * 100 : 0}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {stats.tasksByMember.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="py-8 text-center text-slate-400 text-xs font-medium italic">
                                            No data found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Efficiency Summary */}
            <div className="bg-slate-900 rounded-[2.5rem] p-12 text-white overflow-hidden relative shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2"></div>

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
                    <div className="max-w-md">
                        <span className="text-indigo-400 text-xs font-black uppercase tracking-[0.2em] mb-4 block">
                            {isSingleMember ? 'My Strategic Overview' : 'Strategic Overview'}
                        </span>
                        <h3 className="text-4xl font-black tracking-tight mb-6">
                            {isSingleMember ? 'My Efficiency' : 'Efficiency Summary'}
                        </h3>
                        <p className="text-slate-400 font-medium leading-relaxed">
                            {isSingleMember 
                                ? `You are currently working on ${stats.totalProjects} projects with ${stats.totalTasks} total tasks assigned.`
                                : `Overview of team productivity and project completion status. Currently monitoring ${stats.totalProjects} active projects and ${stats.totalTasks} tasks.`
                            }
                        </p>
                    </div>

                    <div className="flex gap-12">
                        <div className="text-center">
                            <div className="text-5xl font-black text-indigo-400 mb-2">
                                {stats.totalTasks > 0 ? Math.round(((stats.statusCounts['Done'] + stats.statusCounts['Finished']) / stats.totalTasks) * 100) : 0}%
                            </div>
                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                {isSingleMember ? 'My Completion' : 'Global Completion'}
                            </div>
                        </div>
                        <div className="w-px h-16 bg-slate-800 hidden md:block"></div>
                        <div className="text-center">
                            <div className="text-5xl font-black text-emerald-400 mb-2">
                                {stats.statusCounts['Finished']}
                            </div>
                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tasks Finished</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatisticsView;
