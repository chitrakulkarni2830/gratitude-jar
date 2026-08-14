import { useState } from 'react';

const PALETTE = [
  { name: 'Color 1', hex: '#CDB4DB' },
  { name: 'Color 2', hex: '#FFC8DD' },
  { name: 'Color 3', hex: '#FFAFCC' },
  { name: 'Color 4', hex: '#BDE0FE' },
  { name: 'Color 5', hex: '#A2D2FF' },
];

export default function PalettePicker({ selectedColor, onSelect }) {
  // If no color is passed (or on mount before state hooks up), default to first color.
  const activeColor = selectedColor || PALETTE[0].hex;

  return (
    <div className="flex gap-2">
      {PALETTE.map((c) => (
        <button
          key={c.hex}
          type="button"
          aria-label={c.name}
          onClick={() => onSelect(c.hex)}
          className={`w-[30px] h-[30px] rounded-full border-2 cursor-pointer relative transition-transform hover:-translate-y-[2px] ${
            activeColor === c.hex 
              ? 'border-ink shadow-[0_0_0_3px_var(--color-surface),0_0_0_4px_rgba(46,42,51,0.15)]' 
              : 'border-transparent'
          }`}
          style={{ backgroundColor: c.hex }}
        />
      ))}
      <button 
        type="button"
        aria-label="Add custom color"
        className="w-[30px] h-[30px] rounded-full border-[1.5px] border-dashed border-ink-muted bg-transparent text-ink-muted flex items-center justify-center cursor-pointer text-[14px]"
      >
        +
      </button>
    </div>
  );
}
