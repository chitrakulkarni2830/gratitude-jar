import React, { forwardRef } from 'react';

const Note = forwardRef(({ note, onClick }, ref) => {
  return (
    <div
      ref={ref}
      onClick={() => onClick(note)}
      className="absolute w-[64px] h-[42px] rounded-[3px] p-[5px_7px] font-hand text-[10.5px] text-ink leading-[1.25] overflow-hidden cursor-pointer shadow-[1px_3px_6px_rgba(46,42,51,0.15),inset_0_0_12px_rgba(255,255,255,0.5)] z-30 opacity-0 pointer-events-auto"
      style={{ 
        backgroundColor: note.color,
        left: note.physics?.x,
        top: note.physics?.y,
        transform: `translate(-50%, -50%) rotate(${note.physics?.angle || 0}rad)`
      }}
    >
      <div className="flex items-start justify-between gap-[2px] h-full w-full">
        <span className="line-clamp-2 flex-1 break-words">{note.text}</span>
        {note.mood && (
          <span className="text-[12px] flex-shrink-0 leading-none pt-[1px] [text-shadow:0_1px_2px_rgba(0,0,0,0.3)]">
            {note.mood}
          </span>
        )}
      </div>
    </div>
  );
});

export default Note;
