import React from 'react';

export default function NoteLayer() {
  // Placeholder for when we connect the hook
  const notes = [];

  return (
    <div className="absolute inset-0 z-10">
      {notes.length === 0 ? (
        <div className="absolute top-[58%] left-1/2 -translate-x-1/2 -translate-y-1/2 font-hand text-[20px] text-ink-muted text-center w-[200px] z-20">
          Waiting for<br/>some magic ✨
        </div>
      ) : (
        <div className="notes-container">
          {/* Notes will render here */}
        </div>
      )}
    </div>
  );
}
