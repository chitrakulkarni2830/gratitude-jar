import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import styles from './Controls.module.css';

export function Controls({ noteCount, onClear }) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <motion.div 
      className={styles.controls}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.4 }}
    >
      <div className={styles.pill}>
        <span className={styles.count}>{noteCount}</span>
        <span className={styles.label}>{noteCount === 1 ? 'note' : 'notes'} saved</span>
      </div>

      <AnimatePresence mode="wait">
        {!showConfirm ? (
          <motion.button
            key="clear-btn"
            className={styles.actionPill}
            onClick={() => setShowConfirm(true)}
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            aria-label="Clear jar"
            disabled={noteCount === 0}
          >
            <Trash2 size={14} />
            <span>Empty Jar</span>
          </motion.button>
        ) : (
          <motion.div 
            key="confirm-btn"
            className={styles.confirmPillGroup}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
          >
            <span className={styles.confirmText}>Are you sure?</span>
            <button 
              className={styles.confirmYes} 
              onClick={() => {
                onClear();
                setShowConfirm(false);
              }}
            >
              Yes
            </button>
            <button 
              className={styles.confirmNo} 
              onClick={() => setShowConfirm(false)}
            >
              No
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
