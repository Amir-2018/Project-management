import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Rocket, Users, Shield, Globe } from 'lucide-react';
import { APP_NAME } from '../constants';

const AboutView: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#F8FAFC] overflow-x-hidden font-sans pb-24">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100 px-8 py-4 flex justify-between items-center">
                <div
                    className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => navigate('/')}
                >
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black italic shadow-lg shadow-indigo-200">
                        <Rocket className="w-6 h-6" />
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

            {/* Hero Section */}
            <section className="relative pt-40 pb-24 px-8 max-w-5xl mx-auto text-center">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-indigo-50/50 to-transparent -z-10 rounded-full blur-3xl opacity-50"></div>

                <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] mb-8 animate-in zoom-in-95 fade-in duration-1000">
                    Built for the <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Future of Work.</span>
                </h1>

                <p className="text-lg md:text-xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    At {APP_NAME}, we believe project management shouldn't be a chore.
                    It should be the engine that drives your creativity and productivity.
                </p>
            </section>

            {/* Content Section */}
            <section className="px-8 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div className="relative group">
                    <div className="absolute inset-0 bg-indigo-600/5 blur-3xl rounded-full group-hover:bg-indigo-600/10 transition-colors"></div>
                    <div className="relative aspect-square rounded-[3rem] bg-white shadow-2xl border border-slate-100 p-8 flex items-center justify-center overflow-hidden">
                        <div className="w-full h-full bg-slate-50 rounded-[2rem] flex items-center justify-center relative overflow-hidden">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-500 rounded-full blur-[80px] opacity-10 animate-pulse"></div>
                            <Users className="w-32 h-32 text-indigo-600 animate-in zoom-in duration-1000" />
                        </div>
                    </div>
                </div>

                <div className="space-y-12">
                    <div className="space-y-4">
                        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                            <Shield className="w-6 h-6" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Our Mission</h2>
                        <p className="text-slate-400 font-medium leading-relaxed">
                            To empower teams of all sizes to execute their most ambitious ideas with zero friction.
                            We focus on high-performance interfaces and real-time data to give you total clarity.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
                            <Globe className="w-6 h-6" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Global Reach</h2>
                        <p className="text-slate-400 font-medium leading-relaxed">
                            Used by over 50,000 teams across the globe, from small startups to Fortune 500 enterprises.
                            Our infrastructure is distributed to ensure zero latency everywhere.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutView;
