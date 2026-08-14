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
      engine: engine,
      options: {
        width: 480,
        height: 600,
        wireframes: false,
        background: 'transparent',
      }
    });

    // Boundaries matching visual jar exact bounds (width: 300, centered at 240)
    // ground at (240,585,360,60), walls at x:45/435 angled ±0.15, necks at (105,105,60,150) and (375,105,60,150)
    const boundaries = [
      // Ground
      Bodies.rectangle(240, 585, 360, 60, { isStatic: true, friction: 0.8, restitution: 0.1 }),
      // Left Wall
      Bodies.rectangle(45, 340, 60, 480, { isStatic: true, angle: 0.15, friction: 0.1 }),
      // Right Wall
      Bodies.rectangle(435, 340, 60, 480, { isStatic: true, angle: -0.15, friction: 0.1 }),
      // Left Neck
      Bodies.rectangle(105, 105, 60, 150, { isStatic: true, friction: 0.1 }),
      // Right Neck
      Bodies.rectangle(375, 105, 60, 150, { isStatic: true, friction: 0.1 })
    ];

    Composite.add(engine.world, boundaries);
    Render.run(render);

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
    const randomXOffset = (Math.random() - 0.5) * 40;
    // If it's an initial load of multiple notes, stagger Y significantly so they don't spawn entirely inside each other
    const startY = isInitialLoad ? -100 - (Math.random() * 600) : -50; 
    
    const body = Matter.Bodies.rectangle(240 + randomXOffset, startY, 64, 42, {
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
      node.style.transform = `translate(210px, -50px)`;
    } else {
      notesRefMap.current.delete(id);
    }
  };

  return { sceneRef, registerNoteRef, addNoteBody, engineReady };
}
