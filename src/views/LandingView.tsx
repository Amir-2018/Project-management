import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Layout, Users, BarChart3, Shield, Zap, Globe } from 'lucide-react';
import { APP_NAME } from '../constants';

const LandingView: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#F8FAFC] overflow-x-hidden font-sans">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100 px-8 py-4 flex justify-between items-center animate-in fade-in slide-in-from-top duration-700">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black italic shadow-lg shadow-indigo-200">
                        <Layout className="w-6 h-6" />
                    </div>
                    <span className="text-xl font-black text-slate-800 tracking-tighter uppercase">{APP_NAME}</span>
                </div>

                <div className="hidden md:flex items-center gap-8">
                    <button onClick={() => navigate('/about')} className="text-[10px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-colors">About</button>
                    <button onClick={() => navigate('/services')} className="text-[10px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-colors">Services</button>
                    <button onClick={() => navigate('/contact')} className="text-[10px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-colors">Contact</button>
                </div>
                <div className="flex items-center gap-8">
                    <button onClick={() => navigate('/login')} className="text-sm font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-colors">Login</button>
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 hover:scale-105 transition-all shadow-xl shadow-slate-200"
                    >
                        Get Started
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-40 pb-24 px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
                {/* Background Decorations */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-indigo-50/50 to-transparent -z-10 rounded-full blur-3xl opacity-50"></div>

                <span className="inline-block px-4 py-2 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-8 animate-bounce-subtle">
                    Next Generation Collaboration
                </span>

                <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tight leading-[1.1] mb-8 animate-in zoom-in-95 fade-in duration-1000">
                    Manage Projects<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">Without Limits.</span>
                </h1>

                <p className="text-lg md:text-xl text-slate-400 font-medium max-w-2xl mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                    Experience the most fluid project management interface ever built.
                    Real-time collaboration, advanced statistics, and team orchestration at your fingertips.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-indigo-600 text-white px-10 py-5 rounded-[2rem] font-black text-lg hover:bg-indigo-700 hover:scale-110 transition-all shadow-2xl shadow-indigo-300 group flex items-center gap-3"
                    >
                        Start Managing Now
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                    </button>
                </div>

                {/* Animated UI Preview (Abstract) */}
                <div className="mt-24 w-full relative animate-in zoom-in-95 fade-in duration-1000 delay-500">
                    <div className="relative bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-slate-100 p-4 max-w-5xl mx-auto overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="flex bg-slate-50 rounded-[2.5rem] h-[500px] w-full overflow-hidden">
                            {/* Fake Sidebar */}
                            <div className="w-20 bg-slate-900 flex flex-col items-center py-8 gap-6">
                                <div className="w-10 h-10 bg-white/10 rounded-xl mb-4"></div>
                                {[1, 2, 3].map(i => <div key={i} className="w-8 h-8 bg-white/5 rounded-lg"></div>)}
                            </div>
                            {/* Fake Dashboard */}
                            <div className="flex-1 p-10 flex flex-col gap-8">
                                <div className="flex justify-between items-center">
                                    <div className="h-8 w-48 bg-slate-200 rounded-full"></div>
                                    <div className="h-8 w-8 bg-slate-200 rounded-full"></div>
                                </div>
                                <div className="grid grid-cols-3 gap-6">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="h-32 bg-white rounded-3xl shadow-sm border border-slate-100 animate-pulse-slow"></div>
                                    ))}
                                </div>
                                <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-100 p-8 space-y-4">
                                    <div className="h-4 w-full bg-slate-100 rounded-full"></div>
                                    <div className="h-4 w-[80%] bg-slate-100 rounded-full"></div>
                                    <div className="h-4 w-[60%] bg-slate-100 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Floating elements */}
                    <div className="absolute top-1/2 -left-12 -translate-y-1/2 w-48 h-48 bg-purple-500 rounded-full blur-[80px] opacity-20 animate-float-slow"></div>
                    <div className="absolute bottom-1/2 -right-12 translate-y-1/2 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-20 animate-float"></div>
                </div>
            </section>

            {/* Features section */}
            <section className="py-24 px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {[
                        { title: 'Advanced Team Management', desc: 'Smarter resource allocation and team insights.', icon: <Users className="w-8 h-8" /> },
                        { title: 'Interactive Kanban Boards', desc: 'Fluid drag-and-drop workflow for total control.', icon: <Layout className="w-8 h-8" /> },
                        { title: 'Powerful Statistics', desc: 'Visualize progress with beautiful custom charts.', icon: <BarChart3 className="w-8 h-8" /> }
                    ].map((f, i) => (
                        <div key={i} className="group p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-500 shadow-inner">
                                {f.icon}
                            </div>
                            <h3 className="text-xl font-black text-slate-800 mb-4 tracking-tight uppercase">{f.title}</h3>
                            <p className="text-slate-400 font-medium leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 px-8 border-t border-slate-100 text-center">
                <div className="flex items-center justify-center gap-2 mb-8">
                    <div className="w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black italic shadow-lg">
                        <Layout className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg font-black text-slate-800 tracking-tighter uppercase">{APP_NAME}</span>
                </div>
                <p className="text-slate-400 text-sm font-medium mb-10 tracking-wide">© 2026 {APP_NAME}. Crafted for excellence.</p>
                <div className="flex justify-center gap-8 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
                    <button onClick={() => navigate('/about')} className="hover:text-indigo-600 transition-colors flex items-center gap-2"><Users className="w-3 h-3" /> About</button>
                    <button onClick={() => navigate('/services')} className="hover:text-indigo-600 transition-colors flex items-center gap-2"><Zap className="w-3 h-3" /> Services</button>
                    <button onClick={() => navigate('/contact')} className="hover:text-indigo-600 transition-colors flex items-center gap-2"><Globe className="w-3 h-3" /> Contact</button>
                </div>
            </footer>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0) scale(1); }
                    50% { transform: translateY(-30px) scale(1.05); }
                }
                @keyframes float-slow {
                    0%, 100% { transform: translateY(0) rotate(0); }
                    50% { transform: translateY(-20px) rotate(5deg); }
                }
                @keyframes pulse-slow {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }
                @keyframes bounce-subtle {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-float { animation: float 6s infinite ease-in-out; }
                .animate-float-slow { animation: float-slow 8s infinite ease-in-out; }
                .animate-pulse-slow { animation: pulse-slow 4s infinite ease-in-out; }
                .animate-bounce-subtle { animation: bounce-subtle 4s infinite ease-in-out; }
            `}</style>
        </div>
    );
};

export default LandingView;
