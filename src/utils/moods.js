export const MOODS = [
  { id: 'happy', emoji: '😊', label: 'Happy', colorVar: 'var(--color-1)' },
  { id: 'nature', emoji: '🌿', label: 'Nature', colorVar: 'var(--color-2)' },
  { id: 'food', emoji: '🍕', label: 'Food', colorVar: 'var(--color-3)' },
  { id: 'pet', emoji: '🐶', label: 'Pet', colorVar: 'var(--color-4)' },
  { id: 'love', emoji: '💖', label: 'Love', colorVar: 'var(--color-5)' },
];

export const getMood = (id) => MOODS.find(m => m.id === id) || MOODS[0];
