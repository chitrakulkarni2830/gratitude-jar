import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { AFFIRMATIONS } from '../../utils/affirmations';
import styles from './Affirmation.module.css';

export function Affirmation() {
  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Set a random initial affirmation on mount only
  useEffect(() => {
    setIndex(Math.floor(Math.random() * AFFIRMATIONS.length));
  }, []);

  const handleRefresh = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * AFFIRMATIONS.length);
      } while (newIndex === index);
      setIndex(newIndex);
    }, 200); // Wait for exit animation
  }, [index, isAnimating]);

  return (
    <div className={styles.container}>
      <span className={styles.label}>Today's Affirmation</span>
      <div className={styles.contentWrapper}>
        <AnimatePresence mode="wait" onExitComplete={() => setIsAnimating(false)}>
          <motion.p
            key={index}
            className={styles.text}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            "{AFFIRMATIONS[index]}"
          </motion.p>
        </AnimatePresence>
        <button 
          className={styles.refreshBtn} 
          onClick={handleRefresh}
          aria-label="Get a new affirmation"
          disabled={isAnimating}
        >
          <RefreshCw size={14} className={isAnimating ? styles.spin : ''} />
        </button>
      </div>
    </div>
  );
}
