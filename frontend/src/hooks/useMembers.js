/**
 * useMembers.js - Hooks for managing Project Members and Roles.
 */
import { useState, useCallback } from 'react';
import { apiClient } from '../lib/apiClient';

export function useMembers(projectId) {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMembers = useCallback(async () => {
    if (!projectId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiClient.get(`/projects/${projectId}/members`);
      setMembers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  const inviteMember = useCallback(async (email, role = 'member') => {
    try {
      const newMember = await apiClient.post(`/projects/${projectId}/members`, { email, role });
      setMembers(prev => [...prev, newMember]);
      return newMember;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [projectId]);

  const changeMemberRole = useCallback(async (memberId, role) => {
    // Optimistic update
    setMembers(prev => prev.map(m => (m._id === memberId || m.id === memberId) ? { ...m, role } : m));
    try {
      await apiClient.put(`/projects/${projectId}/members/${memberId}`, { role });
    } catch (err) {
      fetchMembers(); // revert on fail
      setError(err.message);
      throw err;
    }
  }, [projectId, fetchMembers]);

  return {
    members,
    isLoading,
    error,
    fetchMembers,
    inviteMember,
    changeMemberRole
  };
}
