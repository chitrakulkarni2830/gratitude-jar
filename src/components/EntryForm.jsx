import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import PalettePicker from './PalettePicker';

export default function EntryForm({ onAddNote }) {
  const [text, setText] = useState('');
  const [selectedColor, setSelectedColor] = useState('#CDB4DB');

  const maxChars = 140;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAddNote(text.trim(), selectedColor);
    setText('');
  };

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-[14px] mb-[14px] flex-wrap">
        <span className="text-[13px] font-semibold text-ink-muted">Note color</span>
        <PalettePicker selectedColor={selectedColor} onSelect={setSelectedColor} />
      </div>

      <form 
        onSubmit={handleSubmit}
        className="bg-surface rounded-[22px] p-[22px] shadow-md border border-ink/5"
      >
        <label htmlFor="input" className="sr-only">What are you grateful for?</label>
        <textarea
          id="input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="I'm grateful for..."
          maxLength={maxChars}
          className="w-full border-none resize-none font-ui text-[16px] text-ink bg-transparent outline-none min-h-[90px] leading-[1.6] placeholder:text-[#B3AAB9]"
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-[13px] text-ink-muted font-variant-numeric:tabular-nums">
            {maxChars - text.length}
          </span>
          <motion.button
            type="submit"
            whileTap={{ scale: 0.9 }}
            className="w-[44px] h-[44px] rounded-full border-none bg-ink text-white flex items-center justify-center cursor-pointer hover:bg-[#46404F] transition-colors"
            aria-label="Drop note"
          >
            <Send size={18} className="-ml-1" />
          </motion.button>
        </div>
      </form>
      <p className="text-[12px] text-ink-muted mt-[14px]">
        Cmd/Ctrl + Enter to drop
      </p>
    </div>
  );
}
