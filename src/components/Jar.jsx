import React, { useEffect, useRef } from 'react';
import NoteLayer from './NoteLayer';
import { useJarPhysics } from '../hooks/useJarPhysics';

export default function Jar({ notes, isHydrated, onOpenNote }) {
  const { sceneRef, registerNoteRef, addNoteBody, engineReady } = useJarPhysics();
  const seenNotesRef = useRef(new Set());

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

  // Use a fixed SVG path for the unified jar silhouette
  // Center is X=200. Width=400, Height=600
  // Neck: X=120 to 280 (width 160)
  const jarPath = "M 120 0 L 280 0 L 280 35 C 280 70, 370 80, 390 130 L 390 530 C 390 590, 330 600, 200 600 C 70 600, 10 590, 10 530 L 10 130 C 30 80, 120 70, 120 35 Z";

  return (
    <div className="sticky top-[40px] flex flex-col items-center">
      <div className="relative w-[460px] h-[660px]">
        {/* Physics Canvas */}
        <div ref={sceneRef} className="absolute inset-0 z-0 pointer-events-none opacity-0" aria-hidden="true" />
        
        {/* Lid - explicitly matched to neck width (X=120 to 280 is 160px, lid slightly overhangs to 180px) */}
        <div className="absolute top-[8px] left-1/2 -translate-x-1/2 w-[180px] h-[36px] rounded-[8px] z-40 bg-[repeating-linear-gradient(100deg,var(--color-wood-light)_0px,var(--color-wood-light)_4px,var(--color-wood-dark)_4px,var(--color-wood-dark)_7px)] shadow-[inset_0_3px_2px_rgba(255,255,255,0.3),0_6px_10px_rgba(0,0,0,0.3)]" />
        
        {/* Lid Band / Ring - matching neck exactly */}
        <div className="absolute top-[42px] left-1/2 -translate-x-1/2 w-[164px] h-[8px] rounded-[3px] z-40 bg-wood-dark shadow-[0_4px_8px_rgba(46,42,51,0.25)]" />
        
        {/* Unified Jar Body */}
        <div 
          className="absolute top-[48px] left-[30px] w-[400px] h-[600px] z-20 pointer-events-auto"
          style={{ clipPath: `path('${jarPath}')` }}
        >
          {/* Glass Material Background */}
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.6)_0%,rgba(214,228,240,0.35)_40%,rgba(255,255,255,0.2)_100%)] backdrop-blur-[24px] backdrop-saturate-[180%]" />
          
          {/* Base Inner Shadow (darker pooling glass at bottom) */}
          <div className="absolute inset-0 shadow-[inset_0_-32px_40px_rgba(214,228,240,0.6),inset_0_-14px_14px_rgba(0,0,0,0.05)] pointer-events-none" />
          
          {/* Edge Rim Shadow (glass thickness) */}
          <div className="absolute inset-0 shadow-[inset_0_0_16px_rgba(255,255,255,0.8),inset_0_0_3px_rgba(255,255,255,1)] pointer-events-none" />

          {/* SVG Overlays for Highlights and Rim */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 600">
            {/* Crisp Glass Rim Outline */}
            <path 
              d={jarPath} 
              fill="none" 
              stroke="rgba(255,255,255,0.9)" 
              strokeWidth="5" 
            />
            {/* Soft inner glow along the rim */}
            <path 
              d={jarPath} 
              fill="none" 
              stroke="rgba(255,255,255,0.5)" 
              strokeWidth="12" 
              className="blur-[3px]"
            />

            {/* Left Highlight (curved) */}
            <path 
              d="M 40 140 C 40 140, 50 500, 60 550" 
              fill="none" 
              stroke="url(#highlightGrad)" 
              strokeWidth="26" 
              strokeLinecap="round" 
              className="blur-[8px] opacity-80"
            />
            <defs>
              <linearGradient id="highlightGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
            </defs>
          </svg>

          {/* Right Highlight (dimmer, straight) */}
          <div className="absolute top-[160px] right-[25px] w-[16px] h-[240px] bg-[linear-gradient(180deg,rgba(255,255,255,0.4),transparent)] blur-[6px] rounded-full pointer-events-none" />

          {/* Notes Layer */}
          <NoteLayer notes={notes} isHydrated={isHydrated} registerNoteRef={registerNoteRef} onOpenNote={onOpenNote} />
        </div>

        {/* Jar Outer Drop Shadow */}
        <div className="absolute bottom-[2px] left-1/2 -translate-x-1/2 w-[340px] h-[40px] bg-glass-shadow rounded-[100%] blur-[24px] z-0 opacity-80 pointer-events-none" />
      </div>

      <p className="mt-[16px] text-[13px] text-ink-muted text-center">
        Every note you drop settles here — click any note to reopen it.
      </p>
    </div>
  );
}
