/**
 * useProjects.js - Hooks for managing Project data.
 */
import { useState, useCallback } from 'react';
import { apiClient } from '../lib/apiClient';

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiClient.get('/projects');
      setProjects(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createProject = useCallback(async (data) => {
    try {
      const newProject = await apiClient.post('/projects', data);
      setProjects((prev) => [...prev, newProject]);
      return newProject;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const deleteProject = useCallback(async (id) => {
    try {
      await apiClient.delete(`/projects/${id}`);
      setProjects((prev) => prev.filter(p => p.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  return {
    projects,
    isLoading,
    error,
    fetchProjects,
    createProject,
    deleteProject
  };
}

export function useProject(projectId) {
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProject = useCallback(async () => {
    if (!projectId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiClient.get(`/projects/${projectId}`);
      setProject(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  return {
    project,
    isLoading,
    error,
    fetchProject
  };
}
