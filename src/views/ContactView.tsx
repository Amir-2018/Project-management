import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, MessageSquare, Send, Globe, Phone, MapPin } from 'lucide-react';
import { APP_NAME } from '../constants';

const ContactView: React.FC = () => {
    const navigate = useNavigate();
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] overflow-x-hidden font-sans pb-24">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100 px-8 py-4 flex justify-between items-center">
                <div
                    className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => navigate('/')}
                >
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black italic shadow-lg shadow-indigo-200">
                        <MessageSquare className="w-6 h-6" />
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

            <header className="relative pt-40 pb-16 px-8 max-w-5xl mx-auto text-center">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[400px] bg-gradient-to-b from-indigo-50/50 to-transparent -z-10 rounded-full blur-3xl opacity-50"></div>

                <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tight leading-[1.1] mb-8 animate-in zoom-in-95 fade-in duration-1000">
                    Get in <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Touch.</span>
                </h1>
            </header>

            <section className="px-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">
                {/* Contact Info */}
                <div className="lg:col-span-2 space-y-12 animate-in fade-in slide-in-from-left-8 duration-1000">
                    <div className="space-y-4">
                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">Contact Us</p>
                        <h2 className="text-4xl font-black text-slate-800 uppercase tracking-tight leading-none">Let's build something great.</h2>
                        <p className="text-slate-400 font-medium text-lg leading-relaxed">
                            Have questions about our enterprise plans? Need help getting started?
                            Our team is here to support you 24/7.
                        </p>
                    </div>

                    <div className="space-y-8">
                        {[
                            { icon: <Mail className="w-5 h-5" />, label: 'Email', value: 'amir.maalaoui@ngi.tn' },
                            { icon: <Phone className="w-5 h-5" />, label: 'Phone', value: '+216 93 379 344' },
                            { icon: <MapPin className="w-5 h-5" />, label: 'Office', value: '123 Strategy Blvd, Silicon Valley, CA' }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-6 group">
                                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                    {item.icon}
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                                    <p className="text-lg font-black text-slate-800 tracking-tight">{item.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact Form */}
                <div className="lg:col-span-3 bg-white p-12 rounded-[4rem] shadow-2xl border border-slate-50 animate-in fade-in slide-in-from-right-8 duration-1000 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                    {submitted ? (
                        <div className="py-24 text-center space-y-8 animate-in zoom-in duration-500">
                            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-green-500 mx-auto border-4 border-green-100 shadow-xl shadow-green-50">
                                <Send className="w-10 h-10" />
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Message Sent!</h3>
                                <p className="text-slate-400 font-medium">We'll get back to you within 24 hours.</p>
                            </div>
                            <button
                                onClick={() => setSubmitted(false)}
                                className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline"
                            >
                                Send another message
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-8 relative">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-8 py-5 bg-slate-50 border-none rounded-3xl focus:ring-2 focus:ring-indigo-600 transition-all font-medium text-slate-800 placeholder:text-slate-300"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full px-8 py-5 bg-slate-50 border-none rounded-3xl focus:ring-2 focus:ring-indigo-600 transition-all font-medium text-slate-800 placeholder:text-slate-300"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Company</label>
                                <input
                                    type="text"
                                    className="w-full px-8 py-5 bg-slate-50 border-none rounded-3xl focus:ring-2 focus:ring-indigo-600 transition-all font-medium text-slate-800 placeholder:text-slate-300"
                                    placeholder="Acme Corp"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Message</label>
                                <textarea
                                    required
                                    rows={4}
                                    className="w-full px-8 py-5 bg-slate-50 border-none rounded-3xl focus:ring-2 focus:ring-indigo-600 transition-all font-medium text-slate-800 placeholder:text-slate-300 resize-none"
                                    placeholder="Tell us about your project..."
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black text-lg uppercase tracking-widest hover:bg-indigo-600 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-slate-200 flex items-center justify-center gap-4 group"
                            >
                                Send Message
                                <Send className="w-6 h-6 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
                            </button>
                        </form>
                    )}
                </div>
            </section>
        </div>
    );
};

export default ContactView;
