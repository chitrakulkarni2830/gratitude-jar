import React from 'react';
import Note from './Note';
import { motion, AnimatePresence } from 'framer-motion';

export default function NoteLayer({ notes, isHydrated, registerNoteRef, onOpenNote }) {
  return (
    <div className="absolute inset-0 z-10 pointer-events-auto">
      <AnimatePresence>
        {!isHydrated && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
          >
            <div className="w-[120px] h-[120px] rounded-full bg-white/30 animate-pulse blur-2xl" />
          </motion.div>
        )}
        
        {isHydrated && notes.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-[58%] left-1/2 -translate-x-1/2 -translate-y-1/2 font-hand text-[20px] text-ink-muted text-center w-[200px] z-20"
          >
            Waiting for<br/>some magic ✨
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute w-[480px] h-[600px] -left-[90px] -top-[149px] pointer-events-none">
        {notes.map(note => (
          <Note 
            key={note.id} 
            note={note} 
            ref={(node) => registerNoteRef(note.id, node)}
            onClick={onOpenNote} 
          />
        ))}
      </div>
    </div>
  );
}
