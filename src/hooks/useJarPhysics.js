import { useEffect, useRef, useCallback } from 'react';
import Matter from 'matter-js';

export function useJarPhysics() {
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const runnerRef = useRef(null);
  const noteRefs = useRef(new Map());
  const processedNotesRef = useRef(new Set());

  const registerNoteRef = useCallback((id, el) => {
    if (el) {
      noteRefs.current.set(id, el);
    } else {
      noteRefs.current.delete(id);
    }
  }, []);

  useEffect(() => {
    if (!sceneRef.current) return;

    // Create engine
    const engine = Matter.Engine.create();
    engineRef.current = engine;

    // Light gravity for paper
    engine.gravity.y = 0.8;

    // Hidden Matter.js renderer (we render in DOM)
    // We just create an empty element for it if we don't want the canvas visually
    // Actually, setting render to a hidden div is fine.
    const render = Matter.Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: 320,
        height: 400,
        wireframes: false,
        background: 'transparent'
      }
    });

    // Jar Boundaries
    const wallOptions = { 
      isStatic: true, 
      render: { visible: false },
      friction: 0.6,
      restitution: 0.1
    };

    const ground = Matter.Bodies.rectangle(160, 390, 240, 40, wallOptions);
    // Angled walls for a rounded jar
    const leftWall = Matter.Bodies.rectangle(30, 250, 40, 300, { ...wallOptions, angle: 0.15 });
    const rightWall = Matter.Bodies.rectangle(290, 250, 40, 300, { ...wallOptions, angle: -0.15 });
    const leftNeck = Matter.Bodies.rectangle(70, 70, 40, 100, wallOptions);
    const rightNeck = Matter.Bodies.rectangle(250, 70, 40, 100, wallOptions);

    Matter.Composite.add(engine.world, [ground, leftWall, rightWall, leftNeck, rightNeck]);

    const runner = Matter.Runner.create();
    runnerRef.current = runner;
    
    // Matter.Render.run(render); // We actually don't need the canvas renderer at all if we sync DOM manually!
    // We will completely skip running Matter.Render to save performance.
    Matter.Runner.run(runner, engine);

    // Sync bodies to DOM elements
    Matter.Events.on(engine, 'afterUpdate', () => {
      const noteBodies = Matter.Composite.allBodies(engine.world).filter(b => b.label === 'note');
      
      for (const b of noteBodies) {
        const el = noteRefs.current.get(b.plugin.id);
        if (el) {
          // Adjust by -30, -20 assuming note width is 60 and height is 40 to center it
          el.style.transform = `translate(${b.position.x - 30}px, ${b.position.y - 20}px) rotate(${b.angle}rad)`;
        }
      }
    });

    return () => {
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
      
      engineRef.current = null;
      runnerRef.current = null;
      processedNotesRef.current.clear();
    };
  }, []);

  const addNoteBody = useCallback((noteId, isInitialLoad = false) => {
    if (!engineRef.current) return;
    if (processedNotesRef.current.has(noteId)) return;

    // Drop point
    const startY = isInitialLoad ? 100 + Math.random() * 100 : -20;
    const startX = 160 + (Math.random() - 0.5) * 60; 

    const noteBody = Matter.Bodies.rectangle(startX, startY, 60, 40, {
      label: 'note',
      restitution: 0.2, // low bounce
      friction: 0.8, // high friction so they stack
      density: 0.01,
      plugin: { id: noteId },
    });

    Matter.Body.setAngularVelocity(noteBody, (Math.random() - 0.5) * 0.1);
    Matter.Body.setAngle(noteBody, (Math.random() - 0.5) * 0.5);

    Matter.Composite.add(engineRef.current.world, noteBody);
    processedNotesRef.current.add(noteId);
  }, []);

  const clearBodies = useCallback(() => {
    if (!engineRef.current) return;
    const noteBodies = Matter.Composite.allBodies(engineRef.current.world).filter(b => b.label === 'note');
    Matter.Composite.remove(engineRef.current.world, noteBodies);
    processedNotesRef.current.clear();
  }, []);

  return { sceneRef, registerNoteRef, addNoteBody, clearBodies };
}
