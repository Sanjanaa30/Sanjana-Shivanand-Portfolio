import { useEffect } from 'react';

export default function useScrollMotion() {
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let stop = () => {};

    const setup = () => {
      stop();
      if (preference.matches || !('IntersectionObserver' in window)) return;

      const targets = [...document.querySelectorAll(
        '.section-heading, .pillar, .data-flow, .system-cards article, .position-panel, .education-grid article, .experience-card, .project-card, .planned-heading, .planned-project-card, .skills-grid article, .certification-row, .connect-panel'
      )];
      const animations = new Map();
      const observer = new IntersectionObserver(entries => {
        const arriving = entries.filter(entry => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left);
        arriving.forEach(({ target }, index) => {
          observer.unobserve(target);
          target.classList.remove('scroll-pending');
          const animation = target.animate([
            { opacity: 0, translate: '0 28px' },
            { opacity: 1, translate: '0 0' }
          ], { duration: 720, delay: Math.min(index * 65, 195), easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' });
          animations.set(target, animation);
          animation.onfinish = () => animations.delete(target);
        });
      }, { threshold: 0, rootMargin: '0px 0px -32px 0px' });

      targets.forEach(target => {
        // Keep the initial viewport and content above a restored scroll position visible.
        if (target.getBoundingClientRect().top < window.innerHeight) return;
        target.classList.add('scroll-pending');
        observer.observe(target);
      });

      const onFocus = event => {
        const target = targets.find(element => element.contains(event.target));
        if (!target) return;
        observer.unobserve(target);
        target.classList.remove('scroll-pending');
        animations.get(target)?.cancel();
        animations.delete(target);
      };

      // The portrait drifts down a little as the hero scrolls past it.
      const portrait = document.querySelector('.portrait-halo');
      const hero = document.querySelector('.hero');
      let frame = 0;
      const update = () => {
        frame = 0;
        if (!portrait || !hero) return;
        const rect = hero.getBoundingClientRect();
        const offset = window.innerWidth > 820 && rect.bottom > 0 ? Math.min(14, Math.max(0, -rect.top * .025)) : 0;
        portrait.style.translate = `0 ${offset}px`;
      };
      const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
      window.addEventListener('scroll', schedule, { passive: true });
      window.addEventListener('resize', schedule);
      document.addEventListener('focusin', onFocus);
      const resize = new ResizeObserver(schedule);
      resize.observe(document.body);
      update();

      stop = () => {
        observer.disconnect();
        resize.disconnect();
        cancelAnimationFrame(frame);
        window.removeEventListener('scroll', schedule);
        window.removeEventListener('resize', schedule);
        document.removeEventListener('focusin', onFocus);
        targets.forEach(target => target.classList.remove('scroll-pending'));
        animations.forEach(animation => animation.cancel());
        portrait?.style.removeProperty('translate');
      };
    };

    setup();
    preference.addEventListener('change', setup);
    return () => { stop(); preference.removeEventListener('change', setup); };
  }, []);
}
