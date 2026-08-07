import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import styles from './NoteModal.module.css';

export function NoteModal({ note, onClose }) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    
    if (closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
    
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <motion.div 
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        exit={{ opacity: 0, scale: 0.8, rotate: 5 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      >
        <div className={styles.texture} />
        
        <header className={styles.header}>
          <span id="modal-title" className={styles.date}>
            {new Date(note.date).toLocaleDateString(undefined, { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
          <button 
            ref={closeButtonRef}
            className={styles.closeBtn} 
            onClick={onClose}
            aria-label="Close note"
          >
            <X size={20} />
          </button>
        </header>

        <div className={styles.content}>
          {note.text}
        </div>
      </motion.div>
    </div>
  );
}
