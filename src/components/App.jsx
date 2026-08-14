import React, { useState } from 'react';
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
            <button 
              onClick={clearNotes}
              className="text-[13px] text-ink-muted bg-transparent border-none cursor-pointer underline underline-offset-[3px]"
            >
              Empty jar
            </button>
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
