import { memo } from 'react';
import { getMood } from '../../utils/moods';
import styles from './Note.module.css';

export const Note = memo(function Note({ note, registerRef, onClick }) {
  const mood = getMood(note.mood);

  return (
    <button 
      ref={(el) => registerRef(note.id, el)}
      className={styles.note}
      onClick={onClick}
      aria-label={`Open ${mood.label} note from ${new Date(note.date).toLocaleDateString()}`}
      style={{ '--note-color': mood.colorVar }}
    >
      <div className={styles.texture} />
      <span className={styles.moodEmoji} aria-hidden="true">{mood.emoji}</span>
      <span className={styles.textSnippet}>{note.text}</span>
    </button>
  );
});
