# Gratitude Jar

A cozy, physics-based digital scrapbook for capturing small moments of joy, appreciation, and light. 

Built with React 19, Vite, Matter.js, Framer Motion, and CSS Modules. This app requires no backend—it saves your notes directly to your browser's local storage while providing beautiful, interactive physics when you drop a note into the jar.

## Features

- **Interactive Physics:** Watch your notes fall, settle, and stack organically inside the jar using `Matter.js`.
- **Local Persistence:** Your entries are saved securely in your browser via `localStorage` (gracefully handles private browsing limits).
- **Responsive & Accessible:** Fully keyboard navigable (Tab to focus, Esc to close notes), high contrast typography, and an invisible screen-reader list.
- **Micro-interactions:** Delightful animations powered by Framer Motion, including a squash-and-drop entry sequence, warm paper-textured modals, and an animated empty state.

## Tech Stack

- **React 19 + Vite:** Fast, modern frontend architecture.
- **Matter.js:** 2D physics engine running under a transparent canvas, syncing coordinates back to React DOM elements for styling.
- **Framer Motion:** Entrance choreography and interactive spring animations.
- **CSS Modules:** Scoped, vanilla CSS utilizing a custom color palette of cream, blush, and lavender.

## Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the dev server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## Architecture Notes

- `useNotes` custom hook handles `localStorage` hydration, debounced saving, and quota error boundaries.
- `useJarPhysics` abstracts the Matter.js engine lifecycle. It syncs the physics body positions directly to the React DOM refs via a `registerNoteRef` callback, avoiding expensive React state updates at 60FPS.
- `Jar` component serves as a visual wrapper, layering the canvas, the HTML notes layer, and the illustrated jar glass overlay to create a cohesive 3D effect.
