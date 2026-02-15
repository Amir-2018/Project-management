import React, { useMemo } from 'react';
import { Layout, TrendingUp, CheckCircle2, Zap, BarChart3, Calendar } from 'lucide-react';
import { Project, Task } from '../models';

interface StatisticsViewProps {
    projects: Project[];
    tasks: Task[];
}

const StatisticsView: React.FC<StatisticsViewProps> = ({ projects, tasks }) => {
    // Mock performance data for charts (since real historical data isn't in service yet)
    const monthlyData = [
        { name: 'Jan', projects: 2, tasks: 12 },
        { name: 'Feb', projects: 3, tasks: 18 },
        { name: 'Mar', projects: 1, tasks: 15 },
        { name: 'Apr', projects: 4, tasks: 22 },
        { name: 'May', projects: 5, tasks: 30 },
        { name: 'Jun', projects: 3, tasks: 25 }
    ];

    const weeklyData = [
        { day: 'Mon', completion: 40 },
        { day: 'Tue', completion: 65 },
        { day: 'Wed', completion: 50 },
        { day: 'Thu', completion: 85 },
        { day: 'Fri', completion: 70 },
        { day: 'Sat', completion: 30 },
        { day: 'Sun', completion: 20 }
    ];

    const stats = useMemo(() => {
        const totalProjects = projects.length;
        const completedProjects = projects.filter(p => p.status === 'Completed').length;
        const avgProgress = projects.length > 0
            ? Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / projects.length)
            : 0;
        const totalTasks = tasks.length;
        const doneTasks = tasks.filter(t => t.status === 'Done' || t.status === 'Finished').length;

        return { totalProjects, completedProjects, avgProgress, totalTasks, doneTasks };
    }, [projects, tasks]);

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Active Projects', value: stats.totalProjects, icon: <Layout className="w-6 h-6" />, color: 'bg-indigo-500' },
                    { label: 'Avg. Progress', value: `${stats.avgProgress}%`, icon: <TrendingUp className="w-6 h-6" />, color: 'bg-emerald-500' },
                    { label: 'Tasks Completed', value: stats.doneTasks, icon: <CheckCircle2 className="w-6 h-6" />, color: 'bg-amber-500' },
                    { label: 'Team Velocity', value: '8.4', icon: <Zap className="w-6 h-6" />, color: 'bg-purple-500' }
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
                {/* Project Delivery Chart (Custom Bar Chart) */}
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase">Monthly Performance</h3>
                            <p className="text-slate-400 text-xs font-medium">Project and Task completion trends</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                <span className="text-[10px] font-black text-slate-400 uppercase">Projects</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-indigo-200"></div>
                                <span className="text-[10px] font-black text-slate-400 uppercase">Milestones</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-64 flex items-end justify-between gap-4 px-2">
                        {monthlyData.map((data, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                                <div className="w-full flex flex-col items-center gap-1">
                                    <div
                                        className="w-full max-w-[40px] bg-indigo-200 rounded-t-lg transition-all duration-1000 ease-out group-hover:bg-indigo-300"
                                        style={{ height: `${data.tasks * 4}px` }}
                                    />
                                    <div
                                        className="w-full max-w-[40px] bg-indigo-600 rounded-t-lg transition-all duration-1000 delay-100 ease-out group-hover:bg-indigo-700 shadow-lg shadow-indigo-200"
                                        style={{ height: `${data.projects * 20}px` }}
                                    />
                                </div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{data.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Weekly Progress Chart (Custom Area Chart) */}
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase">Weekly Velocity</h3>
                            <p className="text-slate-400 text-xs font-medium">Task completion rate throughout the week</p>
                        </div>
                        <select className="bg-slate-50 border-none outline-none text-[10px] font-black text-slate-500 uppercase tracking-widest p-2 rounded-xl">
                            <option>This Week</option>
                            <option>Last Week</option>
                        </select>
                    </div>

                    <div className="relative h-64 w-full">
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 700 200" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="velocityGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.4" />
                                    <stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            {/* Grid Lines */}
                            <line x1="0" y1="0" x2="700" y2="0" stroke="#F1F5F9" strokeWidth="1" />
                            <line x1="0" y1="50" x2="700" y2="50" stroke="#F1F5F9" strokeWidth="1" />
                            <line x1="0" y1="100" x2="700" y2="100" stroke="#F1F5F9" strokeWidth="1" />
                            <line x1="0" y1="150" x2="700" y2="150" stroke="#F1F5F9" strokeWidth="1" />
                            <line x1="0" y1="200" x2="700" y2="200" stroke="#F1F5F9" strokeWidth="1" />

                            {/* Area */}
                            <path
                                d={`M 0 200 ${weeklyData.map((d, i) => `L ${i * 116} ${200 - (d.completion * 2)}`).join(' ')} L 700 200 Z`}
                                fill="url(#velocityGradient)"
                                className="animate-in fade-in duration-1000"
                            />
                            {/* Line */}
                            <path
                                d={`M 0 ${200 - (weeklyData[0].completion * 2)} ${weeklyData.map((d, i) => `L ${i * 116} ${200 - (d.completion * 2)}`).join(' ')}`}
                                fill="none"
                                stroke="#4F46E5"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="animate-in slide-in-from-left duration-1000"
                            />
                            {/* Dots */}
                            {weeklyData.map((d, i) => (
                                <circle
                                    key={i}
                                    cx={i * 116}
                                    cy={200 - (d.completion * 2)}
                                    r="6"
                                    fill="white"
                                    stroke="#4F46E5"
                                    strokeWidth="3"
                                    className="hover:r-8 transition-all cursor-pointer"
                                />
                            ))}
                        </svg>
                        <div className="flex justify-between mt-6 px-1">
                            {weeklyData.map((d, i) => (
                                <span key={i} className="text-[10px] font-black text-slate-400 uppercase tracking-tighter w-12 text-center">{d.day}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Project Status Matrix */}
            <div className="bg-slate-900 rounded-[2.5rem] p-12 text-white overflow-hidden relative shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2"></div>

                <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-12">
                    <div className="max-w-md">
                        <span className="text-indigo-400 text-xs font-black uppercase tracking-[0.2em] mb-4 block">Strategic Insights</span>
                        <h3 className="text-4xl font-black tracking-tight mb-6">Efficiency Matrix</h3>
                        <p className="text-slate-400 font-medium leading-relaxed">
                            Your team is currently operating at <span className="text-white">92% efficiency</span>. The "Marketing" team has the highest velocity this month, having cleared 14 project milestones.
                        </p>
                        <div className="mt-8 flex gap-8">
                            <div>
                                <div className="text-3xl font-black">2.4d</div>
                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Avg. Lead Time</div>
                            </div>
                            <div className="w-px h-12 bg-slate-800"></div>
                            <div>
                                <div className="text-3xl font-black">+18%</div>
                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Vs Last Month</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        {[
                            { label: 'Planning', value: 45, color: 'bg-amber-500' },
                            { label: 'In Progress', value: 75, color: 'bg-indigo-500' },
                            { label: 'Done', value: 40, color: 'bg-emerald-500' }
                        ].map((item, i) => (
                            <div key={i} className="bg-slate-800/50 backdrop-blur-md p-8 rounded-3xl border border-slate-700/50 flex flex-col items-center gap-6 w-32 group hover:bg-slate-800 transition-all">
                                <div className="relative w-16 h-16 flex items-center justify-center">
                                    <svg className="w-full h-full -rotate-90">
                                        <circle cx="32" cy="32" r="28" fill="none" stroke="#1E293B" strokeWidth="8" />
                                        <circle
                                            cx="32" cy="32" r="28" fill="none"
                                            stroke={item.color === 'bg-amber-500' ? '#F59E0B' : item.color === 'bg-indigo-500' ? '#6366F1' : '#10B981'}
                                            strokeWidth="8"
                                            strokeDasharray="176"
                                            strokeDashoffset={176 - (176 * item.value / 100)}
                                            strokeLinecap="round"
                                            className="transition-all duration-1000 ease-out"
                                        />
                                    </svg>
                                    <span className="absolute text-xs font-black">{item.value}%</span>
                                </div>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatisticsView;
