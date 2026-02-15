import React, { useState } from 'react';
import { User, Mail, Briefcase, Plus, Trash2, Edit2, Shield, X, Globe } from 'lucide-react';
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
    const [name, setName] = useState(initialData?.name || '');
    const [email, setEmail] = useState(initialData?.email || '');
    const [role, setRole] = useState(initialData?.role || '');
    const [managerId, setManagerId] = useState(initialData?.managerId || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ name, email, role, managerId: managerId || undefined });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl animate-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                        {initialData ? t('members.edit') : t('members.add_new')}
                    </h3>
                    <button onClick={onClose} className="text-slate-300 hover:text-slate-600 transition-colors p-2 hover:bg-slate-50 rounded-xl">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('members.name')}</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-700"
                                placeholder={t('members.name_placeholder')}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('members.email')}</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-700"
                                placeholder={t('members.email_placeholder')}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('members.role')}</label>
                        <div className="relative">
                            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                required
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-700"
                                placeholder={t('members.role_placeholder')}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('members.manager')}</label>
                        <div className="relative">
                            <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <select
                                value={managerId}
                                onChange={(e) => setManagerId(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-700 appearance-none"
                            >
                                <option value="">{t('architecture.no_manager')}</option>
                                {allMembers.filter(m => m.id !== initialData?.id).map(m => (
                                    <option key={m.id} value={m.id}>{m.name} ({m.role})</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 group mt-4 text-xs"
                    >
                        {initialData ? t('members.update_button') : t('members.create_button')}
                    </button>
                </form>
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

    const getMemberTeams = (memberId: string) => teams.filter(team => team.members.some(m => m.id === memberId));
    const getMemberProjects = (memberId: string) => projects.filter(project => project.memberIds?.includes(memberId));

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight uppercase leading-none">{t('members.title')}</h2>
                    <p className="text-slate-400 font-bold text-sm tracking-tight">{t('members.subtitle')}</p>
                </div>
                <button
                    onClick={() => { setEditingMember(null); setIsModalOpen(true); }}
                    className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 hover:scale-105 transition-all shadow-xl shadow-indigo-100 flex items-center gap-3 text-xs"
                >
                    <Plus className="w-4 h-4" /> {t('members.add_new')}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {members.map((member) => (
                    <div key={member.id} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-50 hover:shadow-2xl hover:border-indigo-100 transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => { setEditingMember(member); setIsModalOpen(true); }}
                                className="p-3 bg-white shadow-lg rounded-2xl text-slate-400 hover:text-indigo-600 hover:scale-110 transition-all border border-slate-50"
                            >
                                <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => onDeleteMember(member.id)}
                                className="p-3 bg-white shadow-lg rounded-2xl text-slate-400 hover:text-red-500 hover:scale-110 transition-all border border-slate-50"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex items-center gap-6 mb-8">
                            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-3xl font-black shadow-2xl shadow-indigo-200 group-hover:scale-110 transition-transform">
                                {member.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight truncate">{member.name}</h3>
                                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mt-1">{member.role}</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4 text-slate-500">
                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <span className="text-xs font-bold truncate">{member.email}</span>
                            </div>

                            {member.managerId && (
                                <div className="flex items-center gap-4 text-slate-500">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                        <Shield className="w-4 h-4" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t('members.reports_to')}</p>
                                        <p className="text-xs font-bold truncate text-indigo-600">
                                            {members.find(m => m.id === member.managerId)?.name}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-3 pt-6 border-t border-slate-50">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('members.assignments')}</h4>
                                <div className="flex flex-wrap gap-2">
                                    {getMemberTeams(member.id).map(team => (
                                        <span key={team.id} className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-[9px] font-black uppercase tracking-widest">
                                            {team.name}
                                        </span>
                                    ))}
                                    {getMemberProjects(member.id).map(project => (
                                        <span key={project.id} className="px-3 py-1.5 bg-purple-50 text-purple-600 rounded-lg text-[9px] font-black uppercase tracking-widest">
                                            {project.name}
                                        </span>
                                    ))}
                                    {getMemberTeams(member.id).length === 0 && getMemberProjects(member.id).length === 0 && (
                                        <span className="text-[10px] text-slate-300 font-bold uppercase italic">No assignments</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
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
