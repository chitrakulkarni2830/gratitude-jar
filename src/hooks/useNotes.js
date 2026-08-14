import { useState, useEffect } from 'react';

const STORAGE_KEY = 'gratitude-jar-notes';

export function useNotes() {
  const [notes, setNotes] = useState([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setNotes(JSON.parse(stored));
      }
    } catch (err) {
      console.warn("Failed to load notes from localStorage", err);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Persist whenever notes array changes
  useEffect(() => {
    if (!isHydrated) return; // Don't wipe storage before hydration completes
    
    // Slight debounce for writes is a good practice, though simple setItem is fast enough here.
    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
      } catch (err) {
        if (err.name === 'QuotaExceededError') {
          console.error("Storage quota exceeded! Cannot save more notes.");
        }
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [notes, isHydrated]);

  const addNote = (text, color) => {
    const newNote = {
      id: crypto.randomUUID(),
      text,
      color,
      date: new Date().toISOString()
    };
    setNotes(prev => [...prev, newNote]);
  };

  const clearNotes = () => setNotes([]);

  return { notes, isHydrated, addNote, clearNotes };
}
