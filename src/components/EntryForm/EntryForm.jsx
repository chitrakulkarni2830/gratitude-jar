import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { MOODS } from '../../utils/moods';
import styles from './EntryForm.module.css';

const MAX_CHARS = 140;

export function EntryForm({ onAdd }) {
  const [text, setText] = useState('');
  const [activeMood, setActiveMood] = useState(MOODS[0].id);
  
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (trimmed && trimmed.length <= MAX_CHARS) {
      onAdd(trimmed, activeMood);
      setText('');
    }
  }, [text, activeMood, onAdd]);

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
      <div className={styles.moodPickerContainer}>
        <span className={styles.moodLabel}>Pick a vibe:</span>
        <div className={styles.moodList} role="radiogroup" aria-label="Mood picker">
          {MOODS.map(mood => (
            <button
              key={mood.id}
              type="button"
              onClick={() => setActiveMood(mood.id)}
              className={`${styles.moodBtn} ${activeMood === mood.id ? styles.activeMoodBtn : ''}`}
              aria-label={mood.label}
              aria-checked={activeMood === mood.id}
              role="radio"
              style={{ '--mood-color': mood.colorVar }}
            >
              {mood.emoji}
            </button>
          ))}
        </div>
      </div>

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
          maxLength={MAX_CHARS * 2}
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
