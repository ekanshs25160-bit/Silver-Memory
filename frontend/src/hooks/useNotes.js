/**
 * useNotes.js - Hooks for managing Project Notes.
 */
import { useState, useCallback } from 'react';
import { apiClient } from '../lib/apiClient';

export function useNotes(projectId) {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNotes = useCallback(async () => {
    if (!projectId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiClient.get(`/notes/${projectId}`);
      setNotes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  const publishNote = useCallback(async (content) => {
    // Optimistic UI
    const tempId = Date.now().toString();
    const optimisticNote = {
      id: tempId,
      _id: tempId,
      body: content,
      timestamp: 'Just now',
      author: { name: 'You', role: 'Publishing...' },
      commentCount: 0
    };
    
    setNotes(prev => [optimisticNote, ...prev]);

    try {
      const newNote = await apiClient.post(`/notes/${projectId}`, { title: 'New Note', content });
      setNotes(prev => prev.map(n => n.id === tempId ? newNote : n));
      return newNote;
    } catch (err) {
      setNotes(prev => prev.filter(n => n.id !== tempId));
      setError(err.message);
      throw err;
    }
  }, [projectId]);

  return {
    notes,
    isLoading,
    error,
    fetchNotes,
    publishNote
  };
}
