import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NoteModal({ isOpen, note, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && note && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-ink/20 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md rounded-2xl p-8 shadow-xl min-h-[200px] flex flex-col justify-center"
            style={{ backgroundColor: note.color }}
          >
            <div className="font-hand text-[28px] text-ink leading-relaxed mt-4">
              {note.text}
            </div>
            
            <div className="absolute top-6 left-6 text-[24px]">
              {note.mood}
            </div>

            {note.date && (
              <div className="absolute bottom-4 right-6 text-ink/40 text-[14px] font-hand">
                {new Date(note.date).toLocaleDateString()}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
