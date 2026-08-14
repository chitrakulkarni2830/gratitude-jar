import React, { useEffect, useRef } from 'react';
import NoteLayer from './NoteLayer';
import { useJarPhysics } from '../hooks/useJarPhysics';

export default function Jar({ notes, isHydrated, onOpenNote }) {
  const { sceneRef, registerNoteRef, addNoteBody, engineReady } = useJarPhysics();
  const seenNotesRef = useRef(new Set());

  // StrictMode fix exactly as requested
  useEffect(() => {
    if (!engineReady) return;
    seenNotesRef.current.clear();
    const isInitialLoad = notes.length > 1;
    notes.forEach(note => {
      if (!seenNotesRef.current.has(note.id)) {
        seenNotesRef.current.add(note.id);
        addNoteBody(note.id, isInitialLoad);
      }
    });
  }, [notes, addNoteBody, engineReady]);

  return (
    <div className="sticky top-[60px] flex flex-col items-center">
      <div className="relative w-[340px] h-[480px]">
        {/* Physics Canvas */}
        <div ref={sceneRef} className="absolute inset-0 z-0 pointer-events-none opacity-0" aria-hidden="true" />
        
        {/* Lid */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[210px] h-[40px] rounded-[10px] z-40 bg-[repeating-linear-gradient(100deg,var(--color-wood-light)_0px,var(--color-wood-light)_3px,var(--color-wood-dark)_3px,var(--color-wood-dark)_4px)] shadow-[inset_0_2px_0_rgba(255,255,255,0.25),inset_0_-4px_8px_rgba(0,0,0,0.18),0_6px_14px_rgba(46,42,51,0.18)]" />
        
        {/* Lid Band */}
        <div className="absolute top-[32px] left-1/2 -translate-x-1/2 w-[224px] h-[14px] rounded-[4px] z-40 bg-wood-dark shadow-[0_3px_6px_rgba(46,42,51,0.15)]" />
        
        {/* Neck */}
        <div className="absolute top-[44px] left-1/2 -translate-x-1/2 w-[176px] h-[34px] z-30 bg-[linear-gradient(180deg,var(--color-glass-tint),rgba(255,255,255,0.12))] border-l border-r border-glass-highlight" />

        {/* Jar Body */}
        <div className="absolute top-[74px] left-[20px] w-[300px] h-[406px] rounded-[26px_26px_120px_120px/26px_26px_90px_90px] bg-[linear-gradient(165deg,rgba(255,255,255,0.45)_0%,var(--color-glass-tint)_35%,rgba(255,255,255,0.18)_100%)] backdrop-blur-[16px] backdrop-saturate-150 border border-white/55 shadow-[inset_0_2px_1px_rgba(255,255,255,0.7),inset_-24px_0_40px_rgba(255,255,255,0.12),inset_0_-30px_50px_rgba(255,255,255,0.10),0_30px_50px_-12px_var(--color-glass-shadow),0_4px_14px_rgba(46,42,51,0.08)] overflow-hidden z-20 pointer-events-auto">
          
          {/* Notes Layer - Rendered INSIDE jar body so it gets blurred by the backdrop and clipped by the overflow! */}
          <NoteLayer notes={notes} isHydrated={isHydrated} registerNoteRef={registerNoteRef} onOpenNote={onOpenNote} />

          <style>{`
            .jar-highlights::before {
              content: "";
              position: absolute;
              top: 6%;
              left: 10%;
              width: 15%;
              height: 78%;
              background: linear-gradient(180deg, rgba(255,255,255,0.65), rgba(255,255,255,0) 75%);
              border-radius: 50%;
              filter: blur(4px);
            }
            .jar-highlights::after {
              content: "";
              position: absolute;
              top: 12%;
              right: 14%;
              width: 6%;
              height: 45%;
              background: linear-gradient(180deg, rgba(255,255,255,0.4), rgba(255,255,255,0) 80%);
              border-radius: 50%;
              filter: blur(3px);
            }
          `}</style>
          <div className="jar-highlights absolute inset-0 pointer-events-none" />
        </div>

        {/* Jar Shadow */}
        <div className="absolute bottom-[-18px] left-1/2 -translate-x-1/2 w-[250px] h-[26px] bg-glass-shadow rounded-full blur-[14px] z-0 pointer-events-none" />
      </div>

      <p className="mt-[28px] text-[13px] text-ink-muted text-center">
        Every note you drop settles here — click any note to reopen it.
      </p>
    </div>
  );
}
