import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AmbientBackground from './AmbientBackground';
import Hero from './Hero';
import AffirmationCard from './AffirmationCard';
import EntryForm from './EntryForm';
import Jar from './Jar';
import { useNotes } from '../hooks/useNotes';
import NoteModal from './NoteModal';

export default function App() {
  const { notes, addNote, clearNotes, isHydrated } = useNotes();
  const [selectedNote, setSelectedNote] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const handleOpenNote = (note) => {
    setSelectedNote(note);
  };

  return (
    <>
      <AmbientBackground />
      <div className="relative z-10 max-w-[1180px] mx-auto px-5 py-10 md:px-8 md:py-16 grid grid-cols-1 md:grid-cols-[1fr_460px] gap-16 items-start">
        <div className="left-col">
          <Hero />
          <AffirmationCard />
          <EntryForm onAddNote={addNote} />
          
          <div className="flex items-center gap-4 mt-6">
            <span className="text-[13px] font-semibold bg-surface-sunken px-4 py-2 rounded-full font-variant-numeric:tabular-nums">
              {notes.length} note{notes.length === 1 ? '' : 's'} saved
            </span>
            <div className="relative min-h-[32px] flex items-center">
              <AnimatePresence mode="wait">
                {!isConfirming ? (
                  <motion.button 
                    key="empty"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    onClick={() => setIsConfirming(true)}
                    className="text-[13px] text-ink-muted bg-transparent border-none cursor-pointer underline underline-offset-[3px] hover:text-ink transition-colors"
                  >
                    Empty jar
                  </motion.button>
                ) : (
                  <motion.div 
                    key="confirm"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative overflow-hidden bg-surface-sunken px-3 py-1.5 rounded-[6px] flex items-center gap-3 border border-ink/5"
                  >
                    {/* Shimmer effect layer */}
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.8),transparent)] animate-shimmer pointer-events-none" />
                    
                    <span className="text-[13px] text-ink-muted relative z-10 font-medium">Are you sure?</span>
                    <button 
                      onClick={() => {
                        clearNotes();
                        setIsConfirming(false);
                      }}
                      className="text-[13px] text-[#D84C4C] bg-transparent border-none cursor-pointer font-bold hover:scale-110 transition-transform relative z-10"
                    >
                      Yes
                    </button>
                    <button 
                      onClick={() => setIsConfirming(false)}
                      className="text-[13px] text-ink bg-transparent border-none cursor-pointer hover:scale-110 transition-transform relative z-10"
                    >
                      Cancel
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="right-col">
          <Jar notes={notes} isHydrated={isHydrated} onOpenNote={handleOpenNote} />
        </div>
      </div>

      <NoteModal 
        isOpen={!!selectedNote} 
        note={selectedNote} 
        onClose={() => setSelectedNote(null)} 
      />
    </>
  );
}
