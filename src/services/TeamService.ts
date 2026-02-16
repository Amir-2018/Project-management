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
                { id: 'm1', username: 'amir', name: 'Amir', email: 'amir@example.com', role: 'Director', managerId: undefined, password: 'password123' },
                { id: 'm2', username: 'sarah', name: 'Sarah', email: 'sarah@example.com', role: 'Head of Product', managerId: 'm1', password: 'password123' },
                { id: 'm3', username: 'john', name: 'John', email: 'john@example.com', role: 'Engineering Manager', managerId: 'm1', password: 'password123' },
                { id: 'm4', username: 'elena', name: 'Elena', email: 'elena@example.com', role: 'Senior Designer', managerId: 'm2', password: 'password123' },
                { id: 'm5', username: 'dev', name: 'Dev', email: 'dev@example.com', role: 'Full Stack Developer', managerId: 'm3', password: 'password123' }
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

    public addMember(member: Omit<Member, 'id'>): Member {
        const members = this.getMembers();
        const newMember: Member = {
            ...member,
            id: Math.random().toString(36).substr(2, 9),
            password: member.password || Math.random().toString(36).slice(-8)
        };
        members.push(newMember);
        this.saveMembers(members);
        return newMember;
    }

    public updateMember(memberId: string, updates: Partial<Member>): void {
        const members = this.getMembers();
        const index = members.findIndex(m => m.id === memberId);
        if (index !== -1) {
            members[index] = { ...members[index], ...updates };
            this.saveMembers(members);

            // Also update member info in teams
            const teams = this.getTeams();
            teams.forEach(team => {
                const memberIndex = team.members.findIndex(m => m.id === memberId);
                if (memberIndex !== -1) {
                    team.members[memberIndex] = { ...team.members[memberIndex], ...updates };
                }
            });
            this.saveTeams(teams);
        }
    }

    public deleteMember(memberId: string): void {
        const members = this.getMembers();
        this.saveMembers(members.filter(m => m.id !== memberId));

        // Also remove member from teams
        const teams = this.getTeams();
        teams.forEach(team => {
            team.members = team.members.filter(m => m.id !== memberId);
        });
        this.saveTeams(teams);
    }
}

export const teamService = new TeamService();
