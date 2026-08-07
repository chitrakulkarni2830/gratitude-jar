import { useEffect, memo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Note } from '../Note/Note';
import styles from './Jar.module.css';

export const Jar = memo(function Jar({ notes, sceneRef, registerNoteRef, addNoteBody, onOpenNote }) {
  const seenNotesRef = useRef(new Set());

  useEffect(() => {
    const isInitialLoad = notes.length > 1 && seenNotesRef.current.size === 0;
    notes.forEach(note => {
      if (!seenNotesRef.current.has(note.id)) {
        seenNotesRef.current.add(note.id);
        addNoteBody(note.id, isInitialLoad);
      }
    });
  }, [notes, addNoteBody]);

  return (
    <motion.div 
      className={styles.jarContainer}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.3 }}
    >
      <div ref={sceneRef} className={styles.physicsCanvas} aria-hidden="true" />
      
      <div className={styles.jarBack} />

      <div className={styles.notesLayer}>
        {notes.map(note => (
          <Note 
            key={note.id} 
            note={note} 
            registerRef={registerNoteRef}
            onClick={() => onOpenNote(note)}
          />
        ))}
        <AnimatePresence>
          {notes.length === 0 && (
            <motion.div 
              className={styles.emptyState}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className={styles.emptyText}
              >
                Waiting for some magic... ✨
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className={styles.jarFront}>
        <div className={styles.lid} />
        <div className={styles.neck} />
        <div className={styles.glassHighlight} />
      </div>

      <div className={styles.jarShadow} />
    </motion.div>
  );
});
