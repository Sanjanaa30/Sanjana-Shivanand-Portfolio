import React, { useEffect, useRef, useState } from 'react';

const stages = [
  { title: 'Collect', icon: 'fa-cloud-arrow-down', tools: 'Python · REST APIs', detail: 'Bring source data into a repeatable ingestion workflow.' },
  { title: 'Store', icon: 'fa-database', tools: 'Amazon S3 · PostgreSQL', detail: 'Organize raw data and keep it available for downstream processing.' },
  { title: 'Transform', icon: 'fa-gears', tools: 'PySpark · dbt', detail: 'Clean, validate, and model data into useful analytical tables.' },
  { title: 'Orchestrate', icon: 'fa-diagram-project', tools: 'Airflow · Prefect', detail: 'Coordinate tasks and dependencies across scheduled data workflows.' },
  { title: 'Deliver', icon: 'fa-chart-line', tools: 'Power BI · FastAPI', detail: 'Turn processed data into dashboards, insights, and applications.' }
];

export default function DataFlow() {
  const [selected, setSelected] = useState(0);
  const [phase, setPhase] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [visible, setVisible] = useState(false);
  const root = useRef(null);
  useEffect(() => {
    if (!('IntersectionObserver' in window)) { setVisible(true); return; }
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(root.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!visible || reducedMotion) return;
    const timer = window.setInterval(() => setPhase(value => (value + 1) % stages.length), 1600);
    return () => window.clearInterval(timer);
  }, [visible, reducedMotion]);

  return <div ref={root} className="data-flow" data-running={visible && !reducedMotion}>
    <div className="data-flow-header"><div><span className="data-flow-label">From source to insight</span><p>A workflow through my tools</p></div><div className="flow-activity" aria-hidden="true">{stages.map((stage, index) => <span key={stage.title} className={index === phase ? 'is-lit' : ''}/>)}</div></div>
    <ol className="flow-stages" aria-label="Data workflow stages">{stages.map((stage, index) => <li key={stage.title} style={{ '--step': index }}>
      <button type="button" className={`flow-node ${selected === index ? 'is-selected' : ''} ${!reducedMotion && phase === index ? 'is-flowing' : ''}`} aria-pressed={selected === index} aria-controls="flow-description" onClick={() => setSelected(index)}>
        <span className="flow-node-top"><span className="flow-icon"><i className={`fa-solid ${stage.icon}`} aria-hidden="true"/></span><span className="flow-number">0{index + 1}</span></span>
        <strong>{stage.title}</strong><span className="flow-tools">{stage.tools}</span>
      </button>
      {index < stages.length - 1 && <span className="flow-connector" aria-hidden="true"><span/></span>}
    </li>)}</ol>
    <p id="flow-description" className="flow-description" aria-live="polite"><strong>{stages[selected].title}</strong><span>{stages[selected].detail}</span></p>
  </div>;
}
