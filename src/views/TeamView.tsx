import React, { useState } from 'react';
import { Users, Trash2, Plus, X, UserPlus, Briefcase, ChevronRight, Edit2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Team, Member, Project } from '../models';
import { STATUS_COLORS } from '../constants';

interface TeamViewProps {
    teams: Team[];
    members: Member[];
    projects: Project[];
    onAddTeam: (name: string) => void;
    onUpdateTeam: (teamId: string, updates: Partial<Team>) => void;
    onDeleteTeam: (id: string) => void;
    onAssignMember: (teamId: string, memberId: string) => void;
    onRemoveMember: (teamId: string, memberId: string) => void;
}

const TeamModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (name: string, memberIds: string[], projectIds: number[]) => void;
    initialData?: Team | null;
    members: Member[];
    projects: Project[];
}> = ({ isOpen, onClose, onSubmit, initialData, members, projects }) => {
    const { t } = useTranslation();
    const [name, setName] = useState(initialData?.name || '');
    const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>(initialData?.members.map(m => m.id) || []);
    const [selectedProjectIds, setSelectedProjectIds] = useState<number[]>(initialData?.projectIds || []);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(name, selectedMemberIds, selectedProjectIds);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-10 shadow-3xl animate-in zoom-in duration-300 border border-white/20">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">
                            {initialData ? t('team.edit_team') || 'Edit Team' : t('team.create_team')}
                        </h3>
                    </div>
                    <button onClick={onClose} className="text-slate-300 hover:text-slate-900 transition-all p-3 hover:bg-slate-50 rounded-2xl group">
                        <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('team.team_name')}</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-2xl focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold text-slate-700 placeholder:text-slate-300"
                            placeholder={t('team.team_name_placeholder')}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('team.team_members')}</label>
                        <div className="flex flex-wrap gap-2 p-4 bg-slate-50 rounded-2xl border-2 border-transparent max-h-40 overflow-y-auto">
                            {members.map(member => (
                                <label key={member.id} className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl border border-slate-100 cursor-pointer hover:border-indigo-200 transition-all">
                                    <input
                                        type="checkbox"
                                        checked={selectedMemberIds.includes(member.id)}
                                        onChange={(e) => {
                                            if (e.target.checked) setSelectedMemberIds([...selectedMemberIds, member.id]);
                                            else setSelectedMemberIds(selectedMemberIds.filter(id => id !== member.id));
                                        }}
                                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">{member.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('team.allocated_projects')}</label>
                        <div className="flex flex-wrap gap-2 p-4 bg-slate-50 rounded-2xl border-2 border-transparent max-h-40 overflow-y-auto">
                            {projects.map(project => (
                                <label key={project.id} className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl border border-slate-100 cursor-pointer hover:border-indigo-200 transition-all">
                                    <input
                                        type="checkbox"
                                        checked={selectedProjectIds.includes(project.id)}
                                        onChange={(e) => {
                                            if (e.target.checked) setSelectedProjectIds([...selectedProjectIds, project.id]);
                                            else setSelectedProjectIds(selectedProjectIds.filter(id => id !== project.id));
                                        }}
                                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">{project.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-indigo-200 mt-4 flex items-center justify-center gap-3"
                    >
                        {initialData ? t('common.save') || 'Save Changes' : t('team.create_team')}
                    </button>
                </form>
            </div>
        </div>
    );
};

const TeamTable: React.FC<{
    teams: Team[];
    members: Member[];
    projects: Project[];
    onEditTeam: (team: Team) => void;
    onDeleteTeam: (id: string) => void;
    onAssignMember: (teamId: string, memberId: string) => void;
    onRemoveMember: (teamId: string, memberId: string) => void;
    getProjectsForTeam: (projectIds: number[]) => Project[];
}> = ({ teams, members, projects, onEditTeam, onDeleteTeam, onAssignMember, onRemoveMember, getProjectsForTeam }) => {
    const { t } = useTranslation();

    return (
        <div className="bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-0">
                    <thead>
                        <tr className="bg-slate-50/50">
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">{t('team.team_name')}</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">{t('team.members')}</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">{t('team.allocated_projects')}</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {teams.map((team) => (
                            <tr key={team.id} className="hover:bg-indigo-50/30 transition-all duration-300 group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-lg font-black shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform">
                                            {team.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="text-sm font-black text-slate-800 uppercase tracking-tight">{team.name}</div>
                                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{team.members.length} {t('team.members')}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex flex-wrap gap-1.5">
                                        {team.members.map(member => (
                                            <span key={member.id} className="px-2.5 py-1 bg-slate-50 text-slate-600 rounded-lg border border-slate-100 text-[9px] font-black uppercase tracking-widest">
                                                {member.name}
                                            </span>
                                        ))}
                                        {team.members.length === 0 && (
                                            <span className="text-[10px] font-bold text-slate-300 uppercase italic tracking-widest">{t('team.no_members_team')}</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex flex-wrap gap-2">
                                        {getProjectsForTeam(team.projectIds).map(project => (
                                            <span key={project.id} className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${STATUS_COLORS[project.status]}`}>
                                                {project.name}
                                            </span>
                                        ))}
                                        {team.projectIds.length === 0 && (
                                            <span className="text-[10px] font-bold text-slate-300 uppercase italic tracking-widest">{t('team.no_projects')}</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => onEditTeam(team)}
                                            className="p-2.5 bg-white shadow-sm border border-slate-100 rounded-xl text-slate-400 hover:text-indigo-600 hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => onDeleteTeam(team.id)}
                                            className="p-2.5 bg-white shadow-sm border border-slate-100 rounded-xl text-slate-400 hover:text-red-500 hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
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

const TeamView: React.FC<TeamViewProps> = ({
    teams,
    members,
    projects,
    onAddTeam,
    onUpdateTeam,
    onDeleteTeam,
    onAssignMember,
    onRemoveMember
}) => {
    const { t } = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTeam, setEditingTeam] = useState<Team | null>(null);

    React.useEffect(() => {
        const handler = () => {
            setEditingTeam(null);
            setIsModalOpen(true);
        };
        window.addEventListener('trigger-add-team', handler);
        return () => window.removeEventListener('trigger-add-team', handler);
    }, []);

    const getProjectsForTeam = (projectIds: number[]) => {
        return projects.filter(p => projectIds.includes(p.id));
    };

    return (
        <div className="space-y-2 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                </div>
            </div>

            <TeamTable
                teams={teams}
                members={members}
                projects={projects}
                onEditTeam={(team) => {
                    setEditingTeam(team);
                    setIsModalOpen(true);
                }}
                onDeleteTeam={onDeleteTeam}
                onAssignMember={onAssignMember}
                onRemoveMember={onRemoveMember}
                getProjectsForTeam={getProjectsForTeam}
            />

            {isModalOpen && (
                <TeamModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingTeam(null);
                    }}
                    members={members}
                    projects={projects}
                    initialData={editingTeam}
                    onSubmit={(name, memberIds, projectIds) => {
                        if (editingTeam) {
                            onUpdateTeam(editingTeam.id, { name, projectIds });
                            // Update member assignments
                            members.forEach(m => {
                                const isAssigned = editingTeam.members.some(tm => tm.id === m.id);
                                const shouldBeAssigned = memberIds.includes(m.id);
                                if (shouldBeAssigned && !isAssigned) onAssignMember(editingTeam.id, m.id);
                                if (!shouldBeAssigned && isAssigned) onRemoveMember(editingTeam.id, m.id);
                            });
                        } else {
                            onAddTeam(name);
                            // Initial assignments would happen after creation in a real scenario
                        }
                    }}
                />
            )}
        </div>
    );
};

export default TeamView;
