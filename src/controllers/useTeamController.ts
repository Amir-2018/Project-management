import { useState, useCallback, useEffect } from 'react';
import { Team, Member } from '../models';
import { teamService } from '../services/TeamService';

export const useTeamController = () => {
    const [teams, setTeams] = useState<Team[]>([]);
    const [members, setMembers] = useState<Member[]>([]);

    const refreshData = useCallback(() => {
        setTeams(teamService.getAllTeams());
        setMembers(teamService.getAllMembers());
    }, []);

    useEffect(() => {
        refreshData();
    }, [refreshData]);

    const addTeam = useCallback((name: string) => {
        teamService.addTeam(name);
        refreshData();
    }, [refreshData]);

    const deleteTeam = useCallback((teamId: string) => {
        teamService.deleteTeam(teamId);
        refreshData();
    }, [refreshData]);

    const updateTeam = useCallback((teamId: string, updates: Partial<Team>) => {
        teamService.updateTeam(teamId, updates);
        refreshData();
    }, [refreshData]);

    const assignMember = useCallback((teamId: string, memberId: string) => {
        teamService.assignMemberToTeam(teamId, memberId);
        refreshData();
    }, [refreshData]);

    const removeMember = useCallback((teamId: string, memberId: string) => {
        teamService.removeMemberFromTeam(teamId, memberId);
        refreshData();
    }, [refreshData]);

    const addMember = useCallback((member: Omit<Member, 'id'>) => {
        const nm = teamService.addMember(member);
        refreshData();
        return nm;
    }, [refreshData]);

    const updateMember = useCallback((memberId: string, updates: Partial<Member>) => {
        teamService.updateMember(memberId, updates);
        refreshData();
    }, [refreshData]);

    const deleteMember = useCallback((memberId: string) => {
        teamService.deleteMember(memberId);
        refreshData();
    }, [refreshData]);

    return {
        teams,
        members,
        addTeam,
        deleteTeam,
        updateTeam,
        assignMember,
        removeMember,
        addMember,
        updateMember,
        deleteMember,
        refreshTeams: refreshData
    };
};
