import React, { useState } from 'react';
import { User, Mail, Briefcase, Plus, Trash2, Edit2, Shield, X, Globe, Eye, EyeOff, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Member, Team, Project } from '../models';

interface MembersViewProps {
    members: Member[];
    teams: Team[];
    projects: Project[];
    onAddMember: (member: Omit<Member, 'id'>) => void;
    onUpdateMember: (memberId: string, updates: Partial<Member>) => void;
    onDeleteMember: (memberId: string) => void;
    onAssignToTeam: (teamId: string, memberId: string) => void;
    onRemoveFromTeam: (teamId: string, memberId: string) => void;
}

const MemberModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (member: Omit<Member, 'id'>) => void;
    initialData?: Member | null;
    allMembers: Member[];
}> = ({ isOpen, onClose, onSubmit, initialData, allMembers }) => {
    const { t } = useTranslation();
    const [username, setUsername] = useState(initialData?.username || '');
    const [name, setName] = useState(initialData?.name || '');
    const [email, setEmail] = useState(initialData?.email || '');
    const [role, setRole] = useState(initialData?.role || '');
    const [password, setPassword] = useState(initialData?.password || '');
    const [managerId, setManagerId] = useState(initialData?.managerId || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            username,
            name,
            email,
            role,
            password,
            managerId: managerId || undefined
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-10 shadow-3xl animate-in zoom-in duration-300 border border-white/20">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">
                            {initialData ? t('members.edit') : t('members.add_new')}
                        </h3>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Configure participant access</p>
                    </div>
                    <button onClick={onClose} className="text-slate-300 hover:text-slate-900 transition-all p-3 hover:bg-slate-50 rounded-2xl group">
                        <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-2xl focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold text-slate-700 placeholder:text-slate-300"
                                placeholder="e.g. jdoe"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                        <div className="relative group">
                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-2xl focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold text-slate-700 placeholder:text-slate-300"
                                placeholder="e.g. John Doe"
                            />
                        </div>
                    </div>

                    <div className="space-y-2 col-span-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('members.email')}</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-2xl focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold text-slate-700 placeholder:text-slate-300"
                                placeholder={t('members.email_placeholder')}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('members.role')}</label>
                        <div className="relative group">
                            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                type="text"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                required
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-2xl focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold text-slate-700 placeholder:text-slate-300"
                                placeholder={t('members.role_placeholder')}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                type="text"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-2xl focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold text-slate-700 placeholder:text-slate-300"
                                placeholder="Enter password"
                            />
                        </div>
                    </div>

                    <div className="space-y-2 col-span-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('members.manager')}</label>
                        <div className="relative group">
                            <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                            <select
                                value={managerId}
                                onChange={(e) => setManagerId(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-2xl focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold text-slate-700 appearance-none cursor-pointer"
                            >
                                <option value="">{t('architecture.no_manager')}</option>
                                {allMembers.filter(m => m.id !== initialData?.id).map(m => (
                                    <option key={m.id} value={m.id}>{m.username} ({m.name})</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full col-span-2 bg-indigo-600 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-indigo-200 mt-4 flex items-center justify-center gap-3"
                    >
                        {initialData ? t('members.update_button') : t('members.create_button')}
                    </button>
                </form>
            </div>
        </div>
    );
};

const MemberCard: React.FC<{
    member: Member;
    teams: Team[];
    projects: Project[];
    onEdit: () => void;
    onDelete: () => void;
    members: Member[];
}> = ({ member, teams, projects, onEdit, onDelete, members }) => {
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);

    const getMemberTeams = (memberId: string) => teams.filter(team => team.members.some(m => m.id === memberId));
    const getMemberProjects = (memberId: string) => projects.filter(project => project.memberIds?.includes(memberId));

    return (
        <div className="bg-white rounded-[3rem] p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] border border-slate-50 hover:shadow-[0_48px_80px_-16px_rgba(79,70,229,0.12)] hover:border-indigo-100/50 transition-all duration-500 group relative flex flex-col h-full overflow-hidden">
            {/* Background Accent */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                <button
                    onClick={onEdit}
                    className="p-3 bg-white shadow-xl rounded-2xl text-slate-400 hover:text-indigo-600 hover:scale-110 transition-all border border-slate-50"
                >
                    <Edit2 className="w-4 h-4" />
                </button>
                <button
                    onClick={onDelete}
                    className="p-3 bg-white shadow-xl rounded-2xl text-slate-400 hover:text-red-500 hover:scale-110 transition-all border border-slate-50"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            <div className="flex flex-col items-center text-center mb-8 relative">
                <div className="relative mb-6">
                    <div className="w-28 h-28 rounded-[2.5rem] bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white text-4xl font-black shadow-[0_20px_40px_-10px_rgba(79,70,229,0.4)] group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                        {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-2xl shadow-lg flex items-center justify-center border border-slate-50">
                        <div className="w-6 h-6 rounded-lg bg-emerald-500" />
                    </div>
                </div>

                <h3 className="text-xl font-black text-slate-800 tracking-tighter uppercase mb-1">{member.name}</h3>
                <div className="px-4 py-1.5 bg-indigo-50 rounded-full">
                    <p className="text-[9px] font-black text-indigo-600 uppercase tracking-[0.2em]">{member.role}</p>
                </div>
            </div>

            <div className="space-y-4 flex-1">
                <div className="p-4 bg-slate-50/50 rounded-[2rem] space-y-3 border border-slate-50 group-hover:bg-white group-hover:border-indigo-50 transition-all duration-500">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-400">
                            <User className="w-4 h-4 text-indigo-400" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Username</p>
                            <p className="text-xs font-bold text-slate-700 truncate">{member.username}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-400">
                            <Mail className="w-4 h-4 text-purple-400" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">E-mail</p>
                            <p className="text-xs font-bold text-slate-700 truncate">{member.email}</p>
                        </div>
                    </div>

                    {member.password && (
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-400">
                                <Lock className="w-4 h-4 text-amber-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Password</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-mono font-bold text-slate-600">
                                        {showPassword ? member.password : '••••••••'}
                                    </span>
                                    <button
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="text-slate-300 hover:text-indigo-600 transition-colors p-1"
                                    >
                                        {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {member.managerId && (
                    <div className="flex items-center gap-4 px-4 py-3 bg-indigo-600 rounded-[2rem] text-white shadow-xl shadow-indigo-100">
                        <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                            <Shield className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[8px] font-black text-indigo-200 uppercase tracking-widest">Reports to</p>
                            <p className="text-[11px] font-black truncate">
                                {members.find(m => m.id === member.managerId)?.name}
                            </p>
                        </div>
                    </div>
                )}

                <div className="pt-4 mt-auto">
                    <div className="flex flex-wrap gap-2">
                        {getMemberTeams(member.id).map(team => (
                            <span key={team.id} className="px-4 py-2 bg-slate-50 text-slate-600 rounded-2xl text-[9px] font-black uppercase tracking-widest border border-slate-100 hover:bg-white hover:border-indigo-100 hover:text-indigo-600 transition-all cursor-default">
                                {team.name}
                            </span>
                        ))}
                        {getMemberProjects(member.id).map(project => (
                            <span key={project.id} className="px-4 py-2 bg-purple-50 text-purple-600 rounded-2xl text-[9px] font-black uppercase tracking-widest border border-purple-100 hover:bg-white transition-all cursor-default">
                                project: {project.name}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const MembersView: React.FC<MembersViewProps> = ({
    members,
    teams,
    projects,
    onAddMember,
    onUpdateMember,
    onDeleteMember,
    onAssignToTeam,
    onRemoveFromTeam
}) => {
    const { t } = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<Member | null>(null);

    React.useEffect(() => {
        const handler = () => {
            setEditingMember(null);
            setIsModalOpen(true);
        };
        window.addEventListener('trigger-add-member', handler);
        return () => window.removeEventListener('trigger-add-member', handler);
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight uppercase leading-none">{t('members.title')}</h2>
                    <p className="text-slate-400 font-bold text-sm tracking-tight">{t('members.subtitle')}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {members.map((member) => (
                    <MemberCard
                        key={member.id}
                        member={member}
                        teams={teams}
                        projects={projects}
                        members={members}
                        onEdit={() => { setEditingMember(member); setIsModalOpen(true); }}
                        onDelete={() => onDeleteMember(member.id)}
                    />
                ))}
            </div>

            {isModalOpen && (
                <MemberModal
                    isOpen={isModalOpen}
                    onClose={() => { setIsModalOpen(false); setEditingMember(null); }}
                    initialData={editingMember}
                    allMembers={members}
                    onSubmit={(data) => {
                        if (editingMember) {
                            onUpdateMember(editingMember.id, data);
                        } else {
                            onAddMember(data);
                        }
                    }}
                />
            )}
        </div>
    );
};

export default MembersView;
