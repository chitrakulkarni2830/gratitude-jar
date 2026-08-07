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

    const engine = Matter.Engine.create();
    engineRef.current = engine;

    engine.gravity.y = 0.8;

    const render = Matter.Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: 480,
        height: 600,
        wireframes: false,
        background: 'transparent'
      }
    });

    const wallOptions = { 
      isStatic: true, 
      render: { visible: false },
      friction: 0.6,
      restitution: 0.1
    };

    // Ground: centered at x=240, y=585, width=360, height=60
    const ground = Matter.Bodies.rectangle(240, 585, 360, 60, wallOptions);
    // Angled walls for a rounded jar
    const leftWall = Matter.Bodies.rectangle(45, 360, 60, 450, { ...wallOptions, angle: 0.15 });
    const rightWall = Matter.Bodies.rectangle(435, 360, 60, 450, { ...wallOptions, angle: -0.15 });
    // Neck
    const leftNeck = Matter.Bodies.rectangle(105, 105, 60, 150, wallOptions);
    const rightNeck = Matter.Bodies.rectangle(375, 105, 60, 150, wallOptions);

    Matter.Composite.add(engine.world, [ground, leftWall, rightWall, leftNeck, rightNeck]);

    // Handle collision events for drop sparkle
    Matter.Events.on(engine, 'collisionStart', (event) => {
      const pairs = event.pairs;
      for (let i = 0; i < pairs.length; i++) {
        const { bodyA, bodyB } = pairs[i];
        if (bodyA.label === 'note' && bodyB.isStatic) {
          // A note hit the ground or wall - we could dispatch a custom event for sparkle here.
          // The velocity check avoids triggering on resting notes settling.
          if (bodyA.speed > 5) {
            const el = noteRefs.current.get(bodyA.plugin.id);
            if (el) {
               // We add a short data attribute to trigger a CSS animation
               el.setAttribute('data-impact', 'true');
               setTimeout(() => el.removeAttribute('data-impact'), 300);
            }
          }
        }
      }
    });

    const runner = Matter.Runner.create();
    runnerRef.current = runner;
    
    Matter.Runner.run(runner, engine);

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

    // Drop from centered above the neck
    const startY = isInitialLoad ? 100 + Math.random() * 100 : -50;
    const startX = 240 + (Math.random() - 0.5) * 60; 

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
