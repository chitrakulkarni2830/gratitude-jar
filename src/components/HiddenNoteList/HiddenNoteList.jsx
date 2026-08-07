export function HiddenNoteList({ notes, onOpenNote }) {
  if (notes.length === 0) return null;
  return (
    <div className="sr-only" aria-live="polite">
      <h2>Your Saved Notes</h2>
      <ul>
        {notes.map(note => (
          <li key={note.id}>
            <button onClick={() => onOpenNote(note)}>
              Read note from {new Date(note.date).toLocaleDateString()}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
