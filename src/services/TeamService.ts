import { Team, Member } from '../models';

class TeamService {
    private STORAGE_KEY = 'camping_management_teams';
    private MEMBERS_KEY = 'camping_management_members';

    private getTeams(): Team[] {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (!stored) {
            const initialTeams: Team[] = [
                { id: 't1', name: 'Engineering', members: [], projectIds: [1, 2, 4] },
                { id: 't2', name: 'Design', members: [], projectIds: [1] }
            ];
            this.saveTeams(initialTeams);
            return initialTeams;
        }
        return JSON.parse(stored);
    }

    private getMembers(): Member[] {
        const stored = localStorage.getItem(this.MEMBERS_KEY);
        if (!stored) {
            const initialMembers: Member[] = [
                { id: 'm1', name: 'Amir', email: 'amir@example.com', role: 'Full Stack Developer' },
                { id: 'm2', name: 'Sarah', email: 'sarah@example.com', role: 'UI/UX Designer' },
                { id: 'm3', name: 'John', email: 'john@example.com', role: 'Backend Engineer' },
                { id: 'm4', name: 'Elena', email: 'elena@example.com', role: 'Project Manager' }
            ];
            this.saveMembers(initialMembers);
            return initialMembers;
        }
        return JSON.parse(stored);
    }

    private saveTeams(teams: Team[]): void {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(teams));
    }

    private saveMembers(members: Member[]): void {
        localStorage.setItem(this.MEMBERS_KEY, JSON.stringify(members));
    }

    public getAllTeams(): Team[] {
        return this.getTeams();
    }

    public getAllMembers(): Member[] {
        return this.getMembers();
    }

    public addTeam(name: string): Team {
        const teams = this.getTeams();
        const newTeam: Team = {
            id: Math.random().toString(36).substr(2, 9),
            name,
            members: [],
            projectIds: []
        };
        teams.push(newTeam);
        this.saveTeams(teams);
        return newTeam;
    }

    public deleteTeam(teamId: string): void {
        const teams = this.getTeams();
        this.saveTeams(teams.filter(t => t.id !== teamId));
    }

    public updateTeam(teamId: string, updates: Partial<Team>): void {
        const teams = this.getTeams();
        const index = teams.findIndex(t => t.id === teamId);
        if (index !== -1) {
            teams[index] = { ...teams[index], ...updates };
            this.saveTeams(teams);
        }
    }

    public assignMemberToTeam(teamId: string, memberId: string): void {
        const teams = this.getTeams();
        const members = this.getMembers();
        const teamIndex = teams.findIndex(t => t.id === teamId);
        const member = members.find(m => m.id === memberId);

        if (teamIndex !== -1 && member) {
            if (!teams[teamIndex].members.some(m => m.id === memberId)) {
                teams[teamIndex].members.push(member);
                this.saveTeams(teams);
            }
        }
    }

    public removeMemberFromTeam(teamId: string, memberId: string): void {
        const teams = this.getTeams();
        const index = teams.findIndex(t => t.id === teamId);
        if (index !== -1) {
            teams[index].members = teams[index].members.filter(m => m.id !== memberId);
            this.saveTeams(teams);
        }
    }
}

export const teamService = new TeamService();
