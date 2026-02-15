import React, { useState } from 'react';
import { Users, Trash2, Plus, X, UserPlus, Briefcase, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Team, Member, Project } from '../models';
import { STATUS_COLORS } from '../constants';

interface TeamViewProps {
    teams: Team[];
    members: Member[];
    projects: Project[];
    onAddTeam: (name: string) => void;
    onDeleteTeam: (id: string) => void;
    onAssignMember: (teamId: string, memberId: string) => void;
    onRemoveMember: (teamId: string, memberId: string) => void;
}

const TeamView: React.FC<TeamViewProps> = ({
    teams,
    members,
    projects,
    onAddTeam,
    onDeleteTeam,
    onAssignMember,
    onRemoveMember
}) => {
    const { t } = useTranslation();
    const [newTeamName, setNewTeamName] = useState('');
    const [showAddTeam, setShowAddTeam] = useState(false);

    React.useEffect(() => {
        const handler = () => setShowAddTeam(true);
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

            {showAddTeam && (
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-indigo-100 flex gap-4 items-center animate-in slide-in-from-top-4 duration-300">
                    <input
                        autoFocus
                        type="text"
                        value={newTeamName}
                        onChange={(e) => setNewTeamName(e.target.value)}
                        placeholder={t('team.team_name_placeholder')}
                        className="flex-1 px-6 py-4 rounded-2xl border border-slate-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all font-medium"
                    />
                    <button
                        onClick={() => {
                            if (newTeamName) {
                                onAddTeam(newTeamName);
                                setNewTeamName('');
                                setShowAddTeam(false);
                            }
                        }}
                        className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 hover:scale-105 transition-all shadow-lg shadow-indigo-200"
                    >
                        {t('team.create_team')}
                    </button>
                    <button
                        onClick={() => setShowAddTeam(false)}
                        className="p-4 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {teams.map(team => (
                    <div key={team.id} className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col group/team hover:shadow-2xl transition-all duration-500">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                            <div>
                                <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase">{team.name} Team</h3>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                                    <Users className="w-3 h-3" /> {team.members.length} {t('team.members')}
                                </p>
                            </div>
                            <button
                                onClick={() => onDeleteTeam(team.id)}
                                className="p-3 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all opacity-0 group-hover/team:opacity-100"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-8 space-y-8 flex-1">
                            <div>
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                    <Briefcase className="w-3 h-3" /> {t('team.allocated_projects')}
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {getProjectsForTeam(team.projectIds).map(project => (
                                        <div key={project.id} className="group relative">
                                            <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${STATUS_COLORS[project.status]} flex items-center gap-2`}>
                                                <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                                                {project.name}
                                            </span>
                                        </div>
                                    ))}
                                    {team.projectIds.length === 0 && (
                                        <p className="text-xs text-slate-300 italic font-medium">{t('team.no_projects')}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <UserPlus className="w-3 h-3" /> {t('team.team_members')}
                                    </h4>
                                    <div className="relative">
                                        <select
                                            className="appearance-none text-[10px] bg-indigo-50 text-indigo-600 font-black px-4 py-2 pr-8 rounded-xl outline-none cursor-pointer border-none uppercase tracking-widest hover:bg-indigo-100 transition-colors"
                                            onChange={(e) => {
                                                if (e.target.value) {
                                                    onAssignMember(team.id, e.target.value);
                                                    e.target.value = '';
                                                }
                                            }}
                                        >
                                            <option value="">{t('team.add_member')}</option>
                                            {members.filter(m => !team.members.some(tm => tm.id === m.id)).map(m => (
                                                <option key={m.id} value={m.id}>{m.name}</option>
                                            ))}
                                        </select>
                                        <ChevronRight className="w-3 h-3 absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-indigo-400 pointer-events-none" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-3">
                                    {team.members.map(member => (
                                        <div key={member.id} className="flex justify-between items-center p-4 rounded-2xl border border-slate-50 hover:border-indigo-100 hover:bg-indigo-50/20 transition-all group/member">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-[10px] font-black shadow-lg shadow-indigo-100">
                                                    {member.name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-black text-slate-800 uppercase tracking-tight">{member.name}</div>
                                                    <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{member.role}</div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => onRemoveMember(team.id, member.id)}
                                                className="opacity-0 group-hover/member:opacity-100 p-2 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                    {team.members.length === 0 && (
                                        <p className="text-xs text-slate-300 italic font-medium">{t('team.no_members_team')}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeamView;
