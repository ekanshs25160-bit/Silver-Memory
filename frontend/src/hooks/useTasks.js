/**
 * useTasks.js - Hooks for managing Tasks and Subtasks within a project.
 */
import { useState, useCallback } from 'react';
import { apiClient } from '../lib/apiClient';

export function useTasks(projectId) {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    if (!projectId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiClient.get(`/tasks/${projectId}`);
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  const createTask = useCallback(async (data) => {
    try {
      const newTask = await apiClient.post(`/tasks/${projectId}`, data);
      setTasks(prev => [...prev, newTask]);
      return newTask;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [projectId]);

  const updateTaskStatus = useCallback(async (taskId, status) => {
    // Optimistic update
    setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status } : t));
    try {
      await apiClient.put(`/tasks/${projectId}/t/${taskId}`, { status });
    } catch (err) {
      // Revert on error
      fetchTasks();
      setError(err.message);
    }
  }, [projectId, fetchTasks]);

  const addSubtask = useCallback(async (taskId, data) => {
    try {
      const newSubtask = await apiClient.post(`/tasks/${projectId}/t/${taskId}/subtasks`, data);
      setTasks(prev => prev.map(t => {
        if (t._id === taskId) {
          return { ...t, subtasks: [...(t.subtasks || []), newSubtask] };
        }
        return t;
      }));
      return newSubtask;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [projectId]);

  const toggleSubtask = useCallback(async (subtaskId) => {
    // Optimistic update
    let previousState = [];
    setTasks(prev => {
      previousState = prev;
      return prev.map(t => {
        if (t.subtasks?.some(s => s._id === subtaskId)) {
          return {
            ...t,
            subtasks: t.subtasks.map(s => s._id === subtaskId ? { ...s, completed: !s.completed } : s)
          };
        }
        return t;
      });
    });

    try {
      // Assume the backend wants the toggled completed status.
      // We need to fetch the subtask or just pass the toggle to a specific endpoint
      // PRD says: PUT /tasks/:projectId/st/:subTaskId
      // Usually you pass { completed: true/false }
      // To get the boolean, we find it in the optimistic state
      let isCompleted = false;
      setTasks(current => {
        current.forEach(t => {
          t.subtasks?.forEach(s => {
            if (s._id === subtaskId) isCompleted = s.completed;
          });
        });
        return current;
      });
      await apiClient.put(`/tasks/${projectId}/st/${subtaskId}`, { completed: isCompleted });
    } catch (err) {
      setTasks(previousState); // Revert
      setError(err.message);
    }
  }, [projectId]);

  return {
    tasks,
    isLoading,
    error,
    fetchTasks,
    createTask,
    updateTaskStatus,
    addSubtask,
    toggleSubtask
  };
}
