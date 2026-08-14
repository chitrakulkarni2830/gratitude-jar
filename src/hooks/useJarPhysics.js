import { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

export function useJarPhysics() {
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const notesRefMap = useRef(new Map());
  const processedNotesRef = useRef(new Set());
  const [engineReady, setEngineReady] = useState(false);

  useEffect(() => {
    const Engine = Matter.Engine,
          Render = Matter.Render,
          Runner = Matter.Runner,
          Bodies = Matter.Bodies,
          Composite = Matter.Composite;

    // Create engine
    const engine = Engine.create();
    engineRef.current = engine;

    // Create renderer
    const render = Render.create({
      element: sceneRef.current,
      engine: engineRef.current,
      options: {
        width: 600,
        height: 800,
        wireframes: false,
        background: 'transparent',
      }
    });

    // Boundaries matching visual jar exact bounds 
    // Center X = 300, Ground Y = 780
    // Visual width = 400, height = 600
    // So walls are at 300 ± 195 = 105 and 495 (inward slightly to account for curve)
    // The neck is at the top of the jar body (Y = 780 - 600 = 180).
    // The neck width is 160 (±80 from center). So neck walls at 220 and 380.
    const boundaries = [
      // Ground
      Bodies.rectangle(300, 780, 400, 60, { isStatic: true, friction: 0.8, restitution: 0.1 }),
      // Left Wall
      Bodies.rectangle(105, 480, 60, 600, { isStatic: true, angle: 0.05, friction: 0.1 }),
      // Right Wall
      Bodies.rectangle(495, 480, 60, 600, { isStatic: true, angle: -0.05, friction: 0.1 }),
      // Left Neck
      Bodies.rectangle(200, 150, 60, 200, { isStatic: true, angle: 0.3, friction: 0.1 }),
      // Right Neck
      Bodies.rectangle(400, 150, 60, 200, { isStatic: true, angle: -0.3, friction: 0.1 })
    ];

    Composite.add(engine.world, boundaries);
    Render.run(render);

    // Initial delay for rendering
    let timeoutId;
    timeoutId = setTimeout(() => {
      setEngineReady(true);
      // We manually step the engine via requestAnimationFrame for smooth React hook sync,
      // so we don't use Runner.run()
    }, 100);

    // Instead of Matter.Runner.run, use manual requestAnimationFrame to sync DOM
    let animationFrameId;
    const updateDOM = () => {
      Engine.update(engine, 1000 / 60);

      // Sync DOM elements to physics bodies
      engine.world.bodies.forEach((body) => {
        if (!body.label.startsWith('note-')) return;
        const id = body.label.replace('note-', '');
        const domNode = notesRefMap.current.get(id);
        if (domNode) {
          // Adjust coordinates back to standard DOM space (Matter.js uses center coordinates)
          const domX = body.position.x - 32; // Half of 64px note width
          const domY = body.position.y - 21; // Half of 42px note height
          domNode.style.transform = `translate(${domX}px, ${domY}px) rotate(${body.angle}rad)`;
          domNode.style.opacity = 1;
        }
      });

      animationFrameId = requestAnimationFrame(updateDOM);
    };
    updateDOM();
    
    setEngineReady(true);

    return () => {
      cancelAnimationFrame(animationFrameId);
      setEngineReady(false);
      Render.stop(render);
      if (render.canvas) render.canvas.remove();
      Engine.clear(engine);
      processedNotesRef.current.clear();
      engineRef.current = null;
    };
  }, []);

  const addNoteBody = (id, isInitialLoad) => {
    if (!engineRef.current || processedNotesRef.current.has(id)) return;
    processedNotesRef.current.add(id);

    // Stagger X and initial Y slightly for a natural tumble
    const randomXOffset = (Math.random() - 0.5) * 60;
    // If it's an initial load of multiple notes, stagger Y significantly so they don't spawn entirely inside each other
    const startY = isInitialLoad ? -100 - (Math.random() * 800) : -50; 
    
    const body = Matter.Bodies.rectangle(300 + randomXOffset, startY, 64, 42, {
      label: `note-${id}`,
      restitution: 0.4,
      friction: 0.8,
      density: 0.04,
      angle: (Math.random() - 0.5) * 0.5
    });
    
    // Give a tiny random initial velocity for a natural drop
    Matter.Body.setVelocity(body, { x: (Math.random() - 0.5) * 2, y: 0 });
    Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.1);

    Matter.Composite.add(engineRef.current.world, body);
  };

  const registerNoteRef = (id, node) => {
    if (node) {
      notesRefMap.current.set(id, node);
      // Pre-position offscreen so they don't flicker at 0,0 before first frame
      node.style.transform = `translate(270px, -50px)`;
    } else {
      notesRefMap.current.delete(id);
    }
  };

  return { sceneRef, registerNoteRef, addNoteBody, engineReady };
}
