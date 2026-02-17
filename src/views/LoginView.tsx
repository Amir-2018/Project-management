import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { APP_NAME } from '../constants';

const LoginView: React.FC = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [username, setUsername] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const { login, signup, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (isLogin) {
      if (!username || !password) {
        setError('Please enter both username and password');
        return;
      }

      const success = await login({ username, password });
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid credentials');
      }
    } else {
      if (!username || !password || !email || !name) {
        setError('Please fill in all fields');
        return;
      }

      try {
        const success = await signup({ username, password, email, name });
        if (success) {
          // Show success message
          setSuccessMessage('Admin account created successfully! Redirecting to login...');
          // Clear form
          setUsername('');
          setPassword('');
          setEmail('');
          setName('');
          // Switch to login mode after a short delay
          setTimeout(() => {
            setIsLogin(true);
            setSuccessMessage('');
          }, 2000);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to create account. Please try again.');
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-white font-sans overflow-hidden">
      {/* Left Column: Abstract Visual Decoration */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 items-center justify-center p-12 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 animate-float-slow"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 animate-float"></div>

        <div className="relative z-10 max-w-lg text-center">
          <div className="w-24 h-24 bg-white/10 backdrop-blur-2xl rounded-3xl mx-auto mb-12 flex items-center justify-center border border-white/10 shadow-2xl group hover:scale-110 transition-transform duration-500">
            <div className="text-4xl font-black text-white italic">{APP_NAME.charAt(0)}</div>
          </div>
          <h2 className="text-5xl font-black text-white tracking-tight leading-tight mb-8 animate-in fly-in-from-bottom duration-1000">
            Orchestrate Your<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 italic">Vision.</span>
          </h2>
          <p className="text-slate-400 text-lg font-medium leading-relaxed mb-12 animate-in fade-in duration-1000 delay-300">
            A unified workspace for high-performing teams. Join thousands of users managing complex projects with ease.
          </p>

          {/* Visual Stats Teaser */}
          <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
            <div className="bg-white/5 backdrop-blur-md border border-white/5 p-6 rounded-2xl text-left">
              <div className="text-2xl font-black text-white">99.9%</div>
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Uptime SLA</div>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/5 p-6 rounded-2xl text-left">
              <div className="text-2xl font-black text-white">12k+</div>
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Active Projects</div>
            </div>
          </div>
        </div>

        {/* Decorative Particles */}
        <div className="absolute inset-0 z-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-indigo-400 rounded-full animate-pulse-slow"></div>
          <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-purple-400 rounded-full animate-float"></div>
          <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-float-slow"></div>
        </div>
      </div>

      {/* Right Column: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 relative">
        {/* Mobile Header */}
        <div className="absolute top-12 left-12 lg:hidden flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black italic shadow-lg">
            {APP_NAME.charAt(0)}
          </div>
          <span className="text-lg font-black text-slate-800 tracking-tighter uppercase">{APP_NAME}</span>
        </div>

        <div className="max-w-md w-full animate-in slide-in-from-right-12 fade-in duration-1000">
          <div className="mb-12">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4">
              {isLogin ? 'Welcome Back' : 'Create Admin Account'}
            </h1>
            <p className="text-slate-400 font-medium leading-relaxed">
              {isLogin
                ? 'Enter your secure credentials to verify your identity and access your team\'s workspace.'
                : 'Register a new administrator account to start managing your team and projects.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {successMessage && (
              <div className="bg-green-50 text-green-600 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center border border-green-100 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
                {successMessage}
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-red-600 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center border border-red-100 shadow-sm animate-shake">
                {error}
              </div>
            )}

            {!isLogin && (
              <>
                <div className="space-y-2">
                  <label htmlFor="name" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all placeholder:text-slate-300 shadow-inner"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all placeholder:text-slate-300 shadow-inner"
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <label htmlFor="username" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">
                {isLogin ? 'Email Address' : 'Access Username'}
              </label>
              <input
                type={isLogin ? "email" : "text"}
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={isLogin ? "admin@example.com" : "administrator"}
                autoComplete="username"
                className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all placeholder:text-slate-300 shadow-inner"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Security Key</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all placeholder:text-slate-300 shadow-inner"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest cursor-pointer hover:bg-indigo-600 hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] mt-4 h-16 flex items-center justify-center overflow-hidden relative group"
            >
              <span className="relative z-10">
                {loading ? 'Processing...' : (isLogin ? 'Authorize Login' : 'Create Admin Account')}
              </span>
              <div className="absolute inset-0 bg-indigo-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setSuccessMessage('');
              }}
              className="text-xs font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              {isLogin ? 'Don\'t have an account? Sign up as Admin' : 'Already have an account? Log in'}
            </button>
          </div>

          <div className="mt-16 pt-10 border-t border-slate-50 text-center flex flex-col gap-6">
            <div className="flex items-center justify-center gap-4">
              <span className="h-px bg-slate-100 flex-1"></span>
              <p className="text-slate-300 text-[9px] uppercase font-black tracking-[0.2em] whitespace-nowrap">External Assets</p>
              <span className="h-px bg-slate-100 flex-1"></span>
            </div>
            <button
              onClick={() => navigate('/')}
              className="text-slate-400 text-xs font-black uppercase tracking-widest hover:text-indigo-600 transition-colors flex items-center justify-center gap-3 group"
            >
              <span className="group-hover:-translate-x-2 transition-transform">←</span> Return to Homepage
            </button>
          </div>
        </div>
      </div>

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
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.5); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-float { animation: float 6s infinite ease-in-out; }
        .animate-float-slow { animation: float-slow 10s infinite ease-in-out; }
        .animate-pulse-slow { animation: pulse-slow 4s infinite ease-in-out; }
        .animate-shake { animation: shake 0.4s ease-in-out; }
      `}</style>
    </div>
  );
};

export default LoginView;

