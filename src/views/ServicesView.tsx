import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Layout, Zap, BarChart3, Shield, Globe, Users, Target } from 'lucide-react';
import { APP_NAME } from '../constants';

const ServicesView: React.FC = () => {
    const navigate = useNavigate();

    const services = [
        {
            title: 'Project Orchestration',
            desc: 'Advanced workflow management with real-time status updates and automated task transitions.',
            icon: <Layout className="w-8 h-8" />,
            color: 'indigo'
        },
        {
            title: 'High-Performance Analytics',
            desc: 'Deep-dive statistics and predictive analytics to help you stay ahead of your deadlines.',
            icon: <BarChart3 className="w-8 h-8" />,
            color: 'purple'
        },
        {
            title: 'Team Collaboration',
            desc: 'Integrated communication tools and shared workspaces designed for maximum synergy.',
            icon: <Users className="w-8 h-8" />,
            color: 'blue'
        },
        {
            title: 'Strategic Planning',
            desc: 'Multi-tiered roadmap planning and milestone tracking for complex long-term initiatives.',
            icon: <Target className="w-8 h-8" />,
            color: 'pink'
        }
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC] overflow-x-hidden font-sans pb-24">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100 px-8 py-4 flex justify-between items-center">
                <div
                    className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => navigate('/')}
                >
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black italic shadow-lg shadow-indigo-200">
                        <Zap className="w-6 h-6" />
                    </div>
                    <span className="text-xl font-black text-slate-800 tracking-tighter uppercase">{APP_NAME}</span>
                </div>
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-xs font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-all group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back home
                </button>
            </nav>

            {/* Header */}
            <section className="relative pt-40 pb-24 px-8 max-w-5xl mx-auto text-center">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-indigo-50/50 to-transparent -z-10 rounded-full blur-3xl opacity-50"></div>

                <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tight leading-[1.1] mb-8 animate-in zoom-in-95 fade-in duration-1000">
                    Elite <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Capabilities.</span>
                </h1>

                <p className="text-lg md:text-xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
                    We provide the tools you need to master your workflow and dominate your industry.
                    Seamless, powerful, and built for scale.
                </p>
            </section>

            {/* Services Grid */}
            <section className="px-8 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                {services.map((s, i) => (
                    <div
                        key={i}
                        className="group p-12 rounded-[3.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-all duration-500 animate-in fade-in slide-in-from-bottom-8"
                        style={{ animationDelay: `${i * 100}ms` }}
                    >
                        <div className={`w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-10 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-500 shadow-inner`}>
                            {s.icon}
                        </div>
                        <h3 className="text-3xl font-black text-slate-800 mb-6 tracking-tight uppercase leading-none">{s.title}</h3>
                        <p className="text-slate-400 text-lg font-medium leading-relaxed">{s.desc}</p>
                    </div>
                ))}
            </section>
        </div>
    );
};

export default ServicesView;
