import { useState, useEffect, useCallback, useRef } from 'react';

const STORAGE_KEY = 'gratitude_jar_notes';

export function useNotes() {
  const [notes, setNotes] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setNotes(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load notes from localStorage', e);
      setError('Could not load saved notes. You might be in private browsing mode.');
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const saveTimeout = useRef(null);

  const saveNotes = useCallback((newNotes) => {
    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }
    
    saveTimeout.current = setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newNotes));
        setError(null);
      } catch (e) {
        console.error('Failed to save notes to localStorage', e);
        setError('Failed to save your note. Device storage might be full.');
      }
    }, 500);
  }, []);

  const addNote = useCallback((text) => {
    setNotes(prev => {
      const newNote = {
        id: crypto.randomUUID(),
        text: text.trim(),
        date: new Date().toISOString()
      };
      const updated = [...prev, newNote];
      saveNotes(updated);
      return updated;
    });
  }, [saveNotes]);

  const clearNotes = useCallback(() => {
    setNotes([]);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      setError(null);
    } catch (e) {
      console.error('Failed to clear notes', e);
      setError('Failed to clear notes from storage.');
    }
  }, []);

  return { notes, isLoaded, addNote, clearNotes, error };
}
