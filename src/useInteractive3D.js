import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

// Cards that show a glow following the cursor. Experience cards are left out:
// they expand when clicked, and a moving highlight fights that interaction.
const GLOW_CARDS = [
  '.project-card', '.pillar', '.system-cards article', '.skills-grid article',
  '.education-grid article', '.planned-project-card', '.certification-row'
].join(',');

// Buttons that lean slightly toward the cursor.
const MAGNETIC = [
  '.primary-action', '.resume-action', '.project-action', '.connect-channel', '.stack-links a'
].join(',');

// Reports the cursor's position inside an element, at most once per frame.
// Returns a function that removes the listeners again.
function followPointer(element, onMove, onLeave) {
  let frame = 0;
  let position = null;

  const flush = () => {
    frame = 0;
    if (position) onMove(position);
  };

  const move = (event) => {
    const box = element.getBoundingClientRect();
    position = {
      x: (event.clientX - box.left) / box.width,
      y: (event.clientY - box.top) / box.height,
      width: box.width,
      height: box.height
    };
    if (!frame) frame = requestAnimationFrame(flush);
  };

  const leave = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    position = null;
    onLeave();
  };

  element.addEventListener('pointermove', move);
  element.addEventListener('pointerleave', leave);

  return () => {
    cancelAnimationFrame(frame);
    element.removeEventListener('pointermove', move);
    element.removeEventListener('pointerleave', leave);
  };
}

export default function useInteractive3D() {
  const lenis = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    let teardown = () => {};

    const setup = () => {
      teardown();
      const cleanups = [];

      if (!reduced.matches) {
        const scroller = new Lenis({ duration: 1.05, smoothWheel: true, touchMultiplier: 1.6 });
        lenis.current = scroller;

        let frame = requestAnimationFrame(function loop(time) {
          scroller.raf(time);
          frame = requestAnimationFrame(loop);
        });

        cleanups.push(() => {
          cancelAnimationFrame(frame);
          scroller.destroy();
          lenis.current = null;
        });
      }

      // Both effects are cursor-driven, so neither makes sense without a mouse.
      if (!reduced.matches && finePointer.matches) {
        document.querySelectorAll(GLOW_CARDS).forEach((card) => {
          card.dataset.tilt = '';
          const activate = () => card.classList.add('is-tilting');
          card.addEventListener('pointerenter', activate);

          // The glow fades out on its own, so the position is left where it was.
          const unfollow = followPointer(
            card,
            ({ x, y }) => {
              card.style.setProperty('--mx', `${x * 100}%`);
              card.style.setProperty('--my', `${y * 100}%`);
            },
            () => card.classList.remove('is-tilting')
          );

          cleanups.push(() => {
            unfollow();
            card.removeEventListener('pointerenter', activate);
            card.classList.remove('is-tilting');
            delete card.dataset.tilt;
            card.style.removeProperty('--mx');
            card.style.removeProperty('--my');
          });
        });

        document.querySelectorAll(MAGNETIC).forEach((button) => {
          button.dataset.magnet = '';

          const recentre = () => {
            button.style.removeProperty('--magnet-x');
            button.style.removeProperty('--magnet-y');
          };

          const unfollow = followPointer(
            button,
            ({ x, y, width, height }) => {
              button.style.setProperty('--magnet-x', `${(x - 0.5) * width * 0.18}px`);
              button.style.setProperty('--magnet-y', `${(y - 0.5) * height * 0.26}px`);
            },
            recentre
          );

          cleanups.push(() => {
            unfollow();
            recentre();
            delete button.dataset.magnet;
          });
        });
      }

      teardown = () => {
        cleanups.forEach((undo) => undo());
        teardown = () => {};
      };
    };

    setup();
    reduced.addEventListener('change', setup);
    finePointer.addEventListener('change', setup);

    return () => {
      teardown();
      reduced.removeEventListener('change', setup);
      finePointer.removeEventListener('change', setup);
    };
  }, []);

  // Nav links scroll through Lenis so the motion matches the rest of the page.
  return (id) => {
    const target = document.getElementById(id);
    if (!target) return;
    if (lenis.current) lenis.current.scrollTo(target, { duration: 1.2 });
    else target.scrollIntoView({ behavior: 'auto' });
  };
}
