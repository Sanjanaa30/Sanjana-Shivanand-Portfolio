import { Suspense, lazy, useEffect, useRef, useState } from 'react';

const DataFieldCanvas = lazy(() => import('./DataFieldCanvas'));

function supportsWebGL() {
  try {
    return Boolean(window.WebGL2RenderingContext && document.createElement('canvas').getContext('webgl2'));
  } catch {
    return false;
  }
}

export default function Backdrop() {
  const [enabled, setEnabled] = useState(false);
  const [density, setDensity] = useState({ objectCount: 54, dustCount: 2600 });
  const scrollRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const wide = window.matchMedia('(min-width: 821px)');
    const coarse = window.matchMedia('(pointer: coarse)');

    const evaluate = () => {
      setEnabled(!reduced.matches && wide.matches && !coarse.matches && supportsWebGL());
      setDensity(window.innerWidth > 1600
        ? { objectCount: 72, dustCount: 3400 }
        : { objectCount: 54, dustCount: 2600 });
    };

    evaluate();
    reduced.addEventListener('change', evaluate);
    wide.addEventListener('change', evaluate);
    coarse.addEventListener('change', evaluate);
    return () => {
      reduced.removeEventListener('change', evaluate);
      wide.removeEventListener('change', evaluate);
      coarse.removeEventListener('change', evaluate);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;

    let frame = 0;
    const readScroll = () => {
      frame = 0;
      const distance = document.documentElement.scrollHeight - window.innerHeight;
      scrollRef.current = distance > 0 ? Math.min(1, Math.max(0, window.scrollY / distance)) : 0;
    };
    const scheduleScroll = () => { if (!frame) frame = requestAnimationFrame(readScroll); };

    const onPointerMove = (event) => {
      pointerRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointerRef.current.y = -((event.clientY / window.innerHeight) * 2 - 1);
      pointerRef.current.active = true;
    };
    const onPointerLeave = () => { pointerRef.current.active = false; };

    readScroll();
    window.addEventListener('scroll', scheduleScroll, { passive: true });
    window.addEventListener('resize', scheduleScroll);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerleave', onPointerLeave);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', scheduleScroll);
      window.removeEventListener('resize', scheduleScroll);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerleave', onPointerLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="data-field" aria-hidden="true">
      <Suspense fallback={null}>
        <DataFieldCanvas
          objectCount={density.objectCount}
          dustCount={density.dustCount}
          scrollRef={scrollRef}
          pointerRef={pointerRef}
        />
      </Suspense>
    </div>
  );
}
