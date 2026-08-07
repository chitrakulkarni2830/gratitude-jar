import { memo } from 'react';
import styles from './Note.module.css';

export const Note = memo(function Note({ note, registerRef, onClick }) {
  return (
    <button 
      ref={(el) => registerRef(note.id, el)}
      className={styles.note}
      onClick={onClick}
      aria-label={`Open note from ${new Date(note.date).toLocaleDateString()}`}
    >
      <div className={styles.texture} />
      <span className={styles.textSnippet}>{note.text}</span>
    </button>
  );
});
