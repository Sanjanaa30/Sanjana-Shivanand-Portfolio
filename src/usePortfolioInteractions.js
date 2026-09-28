import { useEffect, useState } from 'react';

export default function usePortfolioInteractions() {
  const [activeSection, setActiveSection] = useState('home');
  useEffect(() => {
    const sections = [...document.querySelectorAll('main > section[id]')];
    const progress = document.querySelector('.reading-progress');
    let frame = 0;
    const update = () => {
      frame = 0;
      const marker = Math.max(120, window.innerHeight * .3);
      let current = 'home';
      sections.forEach(section => {
        if (section.getBoundingClientRect().top <= marker) current = section.id;
      });
      if (current === 'certifications') current = 'skills';
      if (current === 'open-source') current = 'experience';
      const distance = document.documentElement.scrollHeight - window.innerHeight;
      if (distance > 0 && window.scrollY >= distance - 4) current = 'contact';
      setActiveSection(current);
      progress?.style.setProperty('transform', `scaleX(${distance > 0 ? Math.min(1, Math.max(0, window.scrollY / distance)) : 0})`);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    const resize = new ResizeObserver(schedule);
    resize.observe(document.body);
    update();
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  return activeSection;
}
