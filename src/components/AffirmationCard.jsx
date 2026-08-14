import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

const AFFIRMATIONS = [
  "I trust my inner wisdom.",
  "I find beauty in the ordinary.",
  "My energy creates my reality.",
  "I am exactly where I need to be.",
  "I choose peace over perfection."
];

export default function AffirmationCard() {
  const [index, setIndex] = useState(0);

  const rotateAffirmation = () => {
    setIndex((prev) => (prev + 1) % AFFIRMATIONS.length);
  };

  return (
    <div className="bg-surface border border-ink/5 rounded-[18px] p-5 md:px-6 md:py-5 shadow-sm flex items-center justify-between gap-4 mb-8">
      <div className="flex-1 overflow-hidden">
        <div className="text-[11px] font-semibold tracking-[0.1em] uppercase text-ink-muted mb-[6px]">
          Today's affirmation
        </div>
        <div className="font-hand text-[22px] text-ink relative h-[30px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0"
            >
              "{AFFIRMATIONS[index]}"
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <motion.button
        onClick={rotateAffirmation}
        whileTap={{ scale: 0.92, rotate: 45 }}
        className="w-9 h-9 rounded-full bg-surface-sunken flex items-center justify-center border-none cursor-pointer text-ink-muted shrink-0 hover:bg-pastel-sky hover:text-ink transition-colors"
        aria-label="New affirmation"
      >
        <RefreshCw size={16} />
      </motion.button>
    </div>
  );
}
