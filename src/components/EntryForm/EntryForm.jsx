import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import styles from './EntryForm.module.css';

const MAX_CHARS = 140;

export function EntryForm({ onAdd }) {
  const [text, setText] = useState('');
  
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (trimmed && trimmed.length <= MAX_CHARS) {
      onAdd(trimmed);
      setText('');
    }
  }, [text, onAdd]);

  const handleKeyDown = useCallback((e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      handleSubmit(e);
    }
  }, [handleSubmit]);

  const charsLeft = MAX_CHARS - text.length;
  const isOverLimit = charsLeft < 0;
  const isEmpty = text.trim().length === 0;
  const isDisabled = isOverLimit || isEmpty;

  return (
    <motion.form 
      className={styles.form}
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
    >
      <div className={styles.inputWrapper}>
        <label htmlFor="gratitude-input" className="sr-only">
          What are you grateful for today?
        </label>
        <textarea
          id="gratitude-input"
          className={styles.textarea}
          placeholder="I'm grateful for..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={MAX_CHARS * 2} // Let them type past slightly so they see negative count
          rows={3}
        />
        <div className={styles.footer}>
          <span className={`${styles.charCount} ${isOverLimit ? styles.error : ''}`}>
            {charsLeft}
          </span>
          <button 
            type="submit" 
            className={styles.submitBtn} 
            disabled={isDisabled}
            aria-label="Drop note into jar"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
      <p className={styles.hint}>Cmd/Ctrl + Enter to drop</p>
    </motion.form>
  );
}
