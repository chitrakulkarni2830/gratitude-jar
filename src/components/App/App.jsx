import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ErrorBoundary } from '../ErrorBoundary/ErrorBoundary';
import { Hero } from '../Hero/Hero';
import { Affirmation } from '../Affirmation/Affirmation';
import { EntryForm } from '../EntryForm/EntryForm';
import { Jar } from '../Jar/Jar';
import { Controls } from '../Controls/Controls';
import { NoteModal } from '../NoteModal/NoteModal';
import { HiddenNoteList } from '../HiddenNoteList/HiddenNoteList';
import { useNotes } from '../../hooks/useNotes';
import { useJarPhysics } from '../../hooks/useJarPhysics';
import styles from './App.module.css';

export function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}

function AppContent() {
  const { notes, isLoaded, addNote, clearNotes, error } = useNotes();
  const { sceneRef, registerNoteRef, addNoteBody, clearBodies } = useJarPhysics();
  
  const [activeNote, setActiveNote] = useState(null);

  const handleAddNote = useCallback((text) => {
    addNote(text);
  }, [addNote]);

  const handleClear = useCallback(() => {
    clearNotes();
    clearBodies();
  }, [clearNotes, clearBodies]);

  if (!isLoaded) {
    return (
      <div className={styles.loadingState}>
        <motion.div 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          Gathering thoughts...
        </motion.div>
      </div>
    );
  }

  return (
    <div className={styles.appContainer}>
      <main className={styles.mainContent}>
        <div className={styles.leftColumn}>
          <Hero />
          <Affirmation />
          {error && <div className={styles.errorMessage} role="alert">{error}</div>}
          <EntryForm onAdd={handleAddNote} />
          <Controls noteCount={notes.length} onClear={handleClear} />
        </div>
        
        <div className={styles.rightColumn}>
          <Jar 
            notes={notes} 
            sceneRef={sceneRef} 
            registerNoteRef={registerNoteRef}
            addNoteBody={addNoteBody}
            onOpenNote={setActiveNote}
          />
        </div>
      </main>

      <HiddenNoteList notes={notes} onOpenNote={setActiveNote} />

      <AnimatePresence>
        {activeNote && (
          <NoteModal 
            note={activeNote} 
            onClose={() => setActiveNote(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
