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
    onUpdateProject: (projectId: number, updates: Partial<Project>) => void;
}

const AssignmentModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    member: Member;
    teams: Team[];
    projects: Project[];
    onAssignToTeam: (teamId: string, memberId: string) => void;
    onRemoveFromTeam: (teamId: string, memberId: string) => void;
    onUpdateProject: (projectId: number, updates: Partial<Project>) => void;
}> = ({ isOpen, onClose, member, teams, projects, onAssignToTeam, onRemoveFromTeam, onUpdateProject }) => {
    const { t } = useTranslation();
    
    if (!isOpen) return null;

    const memberTeams = teams.filter(team => team.members.some(m => m.id === member.id));
    const memberProjects = projects.filter(project => project.memberIds?.includes(member.id));

    const toggleTeam = (teamId: string, isAssigned: boolean) => {
        if (isAssigned) {
            onRemoveFromTeam(teamId, member.id);
        } else {
            onAssignToTeam(teamId, member.id);
        }
    };

    const toggleProject = (project: Project, isAssigned: boolean) => {
        const currentMemberIds = project.memberIds || [];
        if (isAssigned) {
            onUpdateProject(project.id, { 
                memberIds: currentMemberIds.filter(id => id !== member.id) 
            });
        } else {
            onUpdateProject(project.id, { 
                memberIds: [...currentMemberIds, member.id] 
            });
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[2.5rem] w-full max-w-2xl p-10 shadow-3xl animate-in zoom-in duration-300 border border-white/20">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">
                            Manage Assignments
                        </h3>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Assign {member.name} to teams and projects</p>
                    </div>
                    <button onClick={onClose} className="text-slate-300 hover:text-slate-900 transition-all p-3 hover:bg-slate-50 rounded-2xl group">
                        <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-8">
                    <div>
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Teams</h4>
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                            {teams.map(team => {
                                const isAssigned = memberTeams.some(t => t.id === team.id);
                                return (
                                    <button
                                        key={team.id}
                                        onClick={() => toggleTeam(team.id, isAssigned)}
                                        className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                                            isAssigned 
                                            ? 'bg-indigo-50 border-indigo-100 text-indigo-700' 
                                            : 'bg-slate-50 border-transparent text-slate-600 hover:border-slate-100'
                                        }`}
                                    >
                                        <span className="font-bold text-sm uppercase tracking-tight">{team.name}</span>
                                        {isAssigned ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Projects</h4>
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                            {projects.map(project => {
                                const isAssigned = memberProjects.some(p => p.id === project.id);
                                return (
                                    <button
                                        key={project.id}
                                        onClick={() => toggleProject(project, isAssigned)}
                                        className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                                            isAssigned 
                                            ? 'bg-purple-50 border-purple-100 text-purple-700' 
                                            : 'bg-slate-50 border-transparent text-slate-600 hover:border-slate-100'
                                        }`}
                                    >
                                        <span className="font-bold text-sm uppercase tracking-tight">{project.name}</span>
                                        {isAssigned ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="w-full bg-slate-800 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest hover:bg-slate-900 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-slate-200 mt-8"
                >
                    Done
                </button>
            </div>
        </div>
    );
};

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            username,
            name,
            email,
            role,
            password,
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

const MemberTable: React.FC<{
    members: Member[];
    teams: Team[];
    projects: Project[];
    onEdit: (member: Member) => void;
    onDelete: (memberId: string) => void;
    onAssign: (member: Member) => void;
    allMembers: Member[];
}> = ({ members, teams, projects, onEdit, onDelete, onAssign, allMembers }) => {
    const { t } = useTranslation();
    const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});

    const togglePassword = (memberId: string) => {
        setShowPasswords(prev => ({ ...prev, [memberId]: !prev[memberId] }));
    };

    const getMemberTeams = (memberId: string) => teams.filter(team => team.members.some(m => m.id === memberId));
    const getMemberProjects = (memberId: string) => projects.filter(project => project.memberIds?.includes(memberId));

    return (
        <div className="bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-0">
                    <thead>
                        <tr className="bg-slate-50/50">
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">{t('members.member')}</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Info</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">{t('members.role')}</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Password</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Teams & Projects</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {members.map((member) => (
                            <tr key={member.id} className="hover:bg-indigo-50/30 transition-all duration-300 group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-lg font-black shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform">
                                            {member.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="text-sm font-black text-slate-800 uppercase tracking-tight">{member.name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                            <User className="w-3 h-3 text-slate-300" />
                                            {member.username}
                                        </div>
                                        <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400">
                                            <Mail className="w-3 h-3 text-slate-300" />
                                            {member.email}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-indigo-100/50">
                                        {member.role}
                                    </span>
                                </td>
                                <td className="px-8 py-6">
                                    {member.password ? (
                                        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl w-fit border border-slate-100">
                                            <span className="text-xs font-mono font-bold text-slate-500">
                                                {showPasswords[member.id] ? member.password : '••••••••'}
                                            </span>
                                            <button
                                                onClick={() => togglePassword(member.id)}
                                                className="text-slate-300 hover:text-indigo-600 transition-colors"
                                            >
                                                {showPasswords[member.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                            </button>
                                        </div>
                                    ) : (
                                        <span className="text-[10px] font-black text-slate-300 uppercase italic">No password</span>
                                    )}
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex flex-wrap gap-1.5 max-w-[240px]">
                                        {getMemberTeams(member.id).map(team => (
                                            <span key={team.id} className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded-lg text-[8px] font-black uppercase tracking-widest border border-slate-200/50">
                                                {team.name}
                                            </span>
                                        ))}
                                        {getMemberProjects(member.id).map(project => (
                                            <span key={project.id} className="px-2.5 py-1 bg-purple-50 text-purple-500 rounded-lg text-[8px] font-black uppercase tracking-widest border border-purple-100/50">
                                                {project.name}
                                            </span>
                                        ))}
                                        {getMemberTeams(member.id).length === 0 && getMemberProjects(member.id).length === 0 && (
                                            <span className="text-[9px] font-bold text-slate-300 uppercase italic tracking-widest">Unassigned</span>
                                        )}
                                        <button 
                                            onClick={() => onAssign(member)}
                                            className="ml-auto p-1.5 text-indigo-500 hover:bg-indigo-100 rounded-lg transition-all"
                                            title="Manage Assignments"
                                        >
                                            <Plus className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                        <button
                                            onClick={() => onEdit(member)}
                                            className="p-2.5 bg-white shadow-sm border border-slate-100 rounded-xl text-slate-400 hover:text-indigo-600 hover:scale-110 transition-all"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(member.id)}
                                            className="p-2.5 bg-white shadow-sm border border-slate-100 rounded-xl text-slate-400 hover:text-red-500 hover:scale-110 transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
    onRemoveFromTeam,
    onUpdateProject
}) => {
    const { t } = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<Member | null>(null);
    const [assigningMember, setAssigningMember] = useState<Member | null>(null);

    React.useEffect(() => {
        const handler = () => {
            setEditingMember(null);
            setIsModalOpen(true);
        };
        window.addEventListener('trigger-add-member', handler);
        return () => window.removeEventListener('trigger-add-member', handler);
    }, []);

    return (
        <div className="space-y-4 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div className="space-y-1">
                </div>
            </div>

            <MemberTable
                members={members}
                teams={teams}
                projects={projects}
                allMembers={members}
                onEdit={(member) => { setEditingMember(member); setIsModalOpen(true); }}
                onDelete={(id) => onDeleteMember(id)}
                onAssign={(member) => setAssigningMember(member)}
            />

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

            {assigningMember && (
                <AssignmentModal
                    isOpen={!!assigningMember}
                    onClose={() => setAssigningMember(null)}
                    member={assigningMember}
                    teams={teams}
                    projects={projects}
                    onAssignToTeam={onAssignToTeam}
                    onRemoveFromTeam={onRemoveFromTeam}
                    onUpdateProject={onUpdateProject}
                />
            )}
        </div>
    );
};

export default MembersView;
