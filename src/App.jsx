import React, { useEffect, useState } from 'react';
import useScrollMotion from './useScrollMotion';
import usePortfolioInteractions from './usePortfolioInteractions';
import DataFlow from './DataFlow';
import Backdrop from './Backdrop';
import useInteractive3D from './useInteractive3D';
import profilePhoto from '../profile photo.jpeg';
import resumePdf from '../Sanjana_Shivanand_SDE_Resume.pdf';

const navItems = ['Home', 'Systems', 'Education', 'Experience', 'Projects', 'Skills', 'Contact'];

const stats = [
  ['3.6M+', 'Data Points Wrangled'],
  ['5+', 'Projects Built'],
  ['60%', 'Faster Reporting'],
  ['∞', 'Curiosity for What’s Next']
];

const techStack = [
  'SQL', 'Python', 'Power BI', 'PostgreSQL', 'DuckDB', 'AWS', 'S3', 'Athena',
  'Docker', 'FastAPI', 'dbt', 'AWS Glue', 'Prefect', 'PySpark', 'scikit-learn', 'MLflow', 'LangChain'
];

const pillars = [
  ['fa-chart-line', 'Analytics & BI', 'SQL • Dashboards • Insights', 'Digging into data to uncover patterns, track meaningful metrics, and turn numbers into decisions.'],
  ['fa-database', 'Data Engineering', 'Pipelines • ETL • Data Quality', 'Building reliable workflows that move, transform, validate, and organize data for downstream use.'],
  ['fa-cloud-arrow-up', 'Cloud & Automation', 'AWS • Orchestration • Scale', 'Automating data workflows and using cloud tools to make processes faster, repeatable, and easier to maintain.'],
  ['fa-brain', 'Applied AI/ML', 'ML • NLP • Intelligent Systems', 'Exploring how machine learning and AI can add prediction, context, and smarter decision-making to data products.']
];

const systems = [
  ['01', 'Real-World Work', 'Data in Practice', 'Working with operational data, reporting, automation, and business workflows through my current internship.'],
  ['02', 'Building', 'Projects That Go Beyond Tutorials', 'I like taking ideas end to end, from messy datasets and pipelines to dashboards, APIs, and ML-powered features.'],
  ['03', 'Growing', 'Deeper Into Data Engineering', 'Currently strengthening my skills in cloud data systems, PySpark, orchestration, data modeling, and scalable pipelines.']
];

const experiences = [
  {
    dates: 'January 2026 - Present', role: 'Data Analyst Intern', company: 'Metropolitan Transportation Authority', location: 'New York City, NY · Onsite',
    tags: ['SQL', 'Power BI', 'Power Automate', 'Data Validation', 'Python','ETL', 'Data Pipelines', 'DBeaver', 'Azure'],
    bullets: [
      'Created ETL and data-pipeline workflows using SQL, Python and Power Query to clean and integrate Policy Compliance, Employee Training and Safety data into standardized datasets for Power BI dashboards.',
      'Streamlined employee disciplinary-action and injury reporting, reducing report-generation time by approximately 60%, by automating data collection, validation and report identifiers with Power Apps, Power Automate and SharePoint Lists.',
      'Implemented rule-based validation and scheduling logic for 600+ annual training assignments, enforcing employee eligibility, session capacity, timing conflicts and duplicate prevention.'
    ]
  },
  {
    dates: 'August 2025 – December 2025', role: 'Data Analyst Graduate Assistant', company: 'Binghamton University', location: 'Binghamton, NY · Onsite',
    tags: ['Excel', 'Power BI', 'Data Analysis', 'Data Vizualization', 'SQL'],
    bullets: [
      'Supported data analysis, reporting, and visualization activities for dean of students office operations.',
      'Worked with structured data to organize metrics, identify trends, and communicate findings through dashboards and reports.'
    ]
  },
  {
    dates: 'October 2023 - October 2024', role: 'Data Analyst & Machine Learning Project Intern', company: 'Centre for Development of Telematics (C-DOT)', location: 'Bangalore, India · Onsite',
    tags: ['Python', 'MySQL', 'Django', 'Data Processing', 'Machine Learning', 'Deep Learning'],
    bullets: [
      'Built data ingestion and preprocessing workflows for multi-source Open Radio Area 5G Network datasets, including profiling, imputation, encoding, normalization, and schema validation.',
      'Developed a MySQL-backed Django analytics platform with access control, activity logging, dataset lineage, and experiment tracking.',
      'Evaluated ML and deep-learning models including XGBoost, Random Forest, SVM, and LSTM for network slicing and V2X use cases.'
    ]
  }
];

const projects = [
  ['DATA ENGINEERING · CLOUD', 'SafeEats NYC', 'An end-to-end NYC restaurant safety platform bringing together inspection records, 311 complaints, and geographic data through a cloud-based data pipeline.', '397K+ Source Rows', ['Python', 'AWS S3', 'Airflow', 'Docker', 'PySpark', 'dbt', 'Athena'], 'Restaurant Safety Intelligence Platform', 'Built an incremental ingestion pipeline that collects NYC Open Data through Python, orchestrates workflows with Airflow in Docker, and stores immutable Bronze JSON in Amazon S3.', ['397K+ Source Rows', '32 Automated Tests', 'Daily Incremental Loads']],
  ['DATA ENGINEERING · AI/ML', 'FinSight AI', 'A data and AI platform that turns live financial, news, macroeconomic, and SEC filing data into forecasts, anomaly detection, sentiment insights, and conversational analysis.', '25 Assets', ['Python', 'dbt', 'DuckDB', 'Prefect', 'Parquet', 'MLflow', 'FastAPI', 'Docker', 'LangGraph'], 'End-to-End Financial Intelligence Platform', 'Built the full pipeline from multi-source ingestion and dbt transformations to Prefect orchestration, ML pipelines, RAG, APIs, and a deployed analytical application.', ['25 Assets', '5 Asset Classes', '6 End-to-End Phases']],
  ['DATA ENGINEERING · ANALYTICS', 'Social Media Intelligence', 'A three-stage platform for collecting and analyzing Reddit and 4chan data through an interactive cross-platform dashboard.', 'Three-Stage Platform', ['Python', 'PostgreSQL', 'TimescaleDB', 'Faktory', 'Docker', 'FastAPI', 'LangChain', 'Next.js'], 'Cross-Platform Data & Analytics System', 'Built Faktory-powered ingestion into PostgreSQL/TimescaleDB, with toxicity analysis, FastAPI services, and AI-assisted analytics.', ['3M+ Data Records', '2 Social Platforms', '3 Pipeline Stages'], ['Collection', 'Analysis', 'Dashboard']],
  ['ANALYTICS · AI/ML', 'Accessible Health Bench', 'A reproducible evaluation framework exploring whether AI-generated nutrition and fitness advice adapts to financial, cultural, and lifestyle constraints.', '120 Prompts', ['Python', 'SQLite', 'Sentence-BERT', 'LLM Evaluation', 'Wikidata', 'BLS', 'USDA'], 'LLM Evaluation & Responsible AI Study', 'Built a six-phase experimental pipeline covering prompt generation, multi-model response collection, structured extraction, external grounding, evaluation, and human validation.', ['120 Prompts', '4 LLMs', '480 Responses']],
  ['DATA APPLICATION · AI', 'Job Hub', 'A full-stack job application workspace that tracks applications and uses AI to analyze resume-to-job fit, identify missing keywords, inspect sponsorship language, and draft tailored application content.', 'Live Application', ['FastAPI', 'React', 'PostgreSQL', 'SQLite', 'Docker', 'Anthropic API'], 'AI-Powered Application Tracker', 'Built a React + FastAPI application with persistent storage, secure server-side LLM integration, resume parsing, analytics, and production deployment.', []],
];

const projectLinks = {
  'SafeEats NYC': { github: 'https://github.com/Sanjanaa30/SafeEatsNYC', demo: 'https://safe-eats-nyc.vercel.app/' },
  'FinSight AI': { github: 'https://github.com/Sanjanaa30/finsight-ai', demo: 'https://sanjanaaa28-finsight-ai.hf.space' },
  'Social Media Intelligence': { github: 'https://github.com/Sanjanaa30/smdsp-insights-and-visualization-dashboard', demo: 'https://smdsp-frontend.vercel.app/' },
  'Accessible Health Bench': { github: 'https://github.com/Sanjanaa30/accessible-health-bench' },
  'Job Hub': { github: 'https://github.com/Sanjanaa30/Job_Hub' }
};

const skillGroups = [
  ['Programming & APIs', ['Python', 'SQL', 'PySpark', 'FastAPI', 'REST APIs', 'JavaScript', 'React']],
  ['Databases', ['PostgreSQL', 'MySQL', 'DuckDB', 'SQLite', 'MongoDB']],
  ['Analytics, BI & Automation', ['Power BI', 'Power Query', 'Excel', 'DAX', 'NumPy', 'Pandas', 'Data Visualization', 'Power Automate', 'Power Apps', 'SharePoint']],
  ['Data Engineering', ['ETL and Data Pipelines', 'Batch and Incremental Processing', 'Data Integration', 'Data Modeling', 'Schema Mapping', 'Data Validation', 'Data Quality Testing', 'dbt', 'Apache Airflow', 'Prefect']],
  ['Cloud & Platforms', ['AWS', 'Amazon S3', 'Athena', 'AWS Glue', 'Lambda', 'Azure', 'Docker', 'Linux', 'Git', 'GitHub']],
  ['Machine Learning, NLP & GenAI', ['scikit-learn', 'XGBoost', 'PyTorch', 'Hugging Face', 'FinBERT', 'SBERT', 'MLflow', 'Regression', 'Classification', 'Forecasting', 'Anomaly Detection', 'Sentiment Analysis', 'LangChain', 'LangGraph', 'RAG', 'Qdrant', 'LLM Agents', 'LLM Evaluation']]
];

function App() {
  useScrollMotion();
  const activeSection = usePortfolioInteractions();
  const scrollToSection = useInteractive3D();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedCards, setExpandedCards] = useState({});

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const jump = (id) => {
    scrollToSection(id);
    setMenuOpen(false);
  };

  const toggleCard = (id) => {
    setExpandedCards((current) => ({ ...current, [id]: !current[id] }));
  };

  return (
    <div className="site-shell">
      <Backdrop />
      <div className="data-scrim" aria-hidden="true" />
      <div className="reading-progress" aria-hidden="true"/>
      <header className={`topnav ${scrolled ? 'topnav--scrolled' : ''}`}>
        <button className="brand brand--signature" onClick={() => jump('home')} aria-label="Sanjana Shivanand — Go to home">
          <span className="brand-monogram" aria-hidden="true">S</span>
          <span className="brand__copy"><strong>Sanjana Shivanand</strong></span>
        </button>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation" aria-expanded={menuOpen} aria-controls="main-navigation"><span/><span/></button>
        <nav id="main-navigation" aria-label="Main navigation" className={`navlinks ${menuOpen ? 'navlinks--open' : ''}`}>
          {navItems.map((item) => <button key={item} className={activeSection === item.toLowerCase() ? 'nav-active' : undefined} aria-current={activeSection === item.toLowerCase() ? 'location' : undefined} onClick={() => jump(item.toLowerCase())}>{item}</button>)}
        </nav>
      </header>

      <main>
        <section id="home" className="section hero">
          <div className="wide hero-grid">
            <div className="hero-copy reveal">
              <p className="eyebrow">Hi! I’m Sanjana <span className="inline-emoji" aria-hidden="true">👋</span></p>
              <h1>Turning data into insights, and insights into impact.</h1>
              <p className="hero-mono">Data Analytics • Engineering • Cloud • Applied AI/ML</p>
              <p className="muted hero-lead">I like getting curious with data, finding stories behind the numbers, and turning it into something people can actually use.</p>
              <div className="hero-actions">
                <button className="primary-action" onClick={() => jump('projects')}><i className="fa-solid fa-layer-group"/> View Projects</button>
                <a className="resume-action" href={resumePdf} target="_blank" rel="noreferrer"><i className="fa-solid fa-file-arrow-down"/><span><strong>Resume</strong></span></a>
              </div>
              <div className="stat-grid">
                {stats.map(([value, label]) => <article key={label}><strong className={value === '∞' ? 'infinity-stat' : undefined}>{value}</strong><span>{label}</span></article>)}
              </div>
            </div>

            <aside className="console reveal reveal-delay">
              <div className="orbit-stage">
                <div className="portrait-halo"><div className="portrait-photo"><img src={profilePhoto} alt="Sanjana Shivanand" width="1024" height="1024" fetchPriority="high"/></div></div>
              </div>
              <div className="console-data">
                <p><span>Name</span><strong>Sanjana Shivanand</strong></p>
                <p><span>Location</span><strong>New York, NY</strong></p>
                <p><span>Right Now</span><strong>MS CS + Data Analytics Intern</strong></p>
                <p><span>Exploring</span><strong>Data Engineering + AI/ML</strong></p>
              </div>
            </aside>
          </div>

          <div className="wide pillar-grid">
            {pillars.map(([icon, title, signal, body], i) => <article className="pillar" style={{'--delay': `${i * 80}ms`}} key={title}><div className="icon-box"><i className={`fa-solid ${icon}`}/></div><h2>{title}</h2><p className="signal">{signal}</p><p>{body}</p></article>)}
          </div>

          <div className="wide marquee"><div>{[...techStack, ...techStack].map((x,i)=><span key={`${x}-${i}`}>{x}</span>)}</div></div>
        </section>

        <section id="systems" className="section systems-section">
          <div className="wide">
            <div className="section-heading split-heading"><div><p className="eyebrow">How I Like to Work</p><h2>Start with a messy problem.<br/>Figure it out.<br/> Build something better.</h2></div><p>I enjoy work where the answer isn’t obvious at first. Give me a dataset, a process that takes too long, or a problem that needs untangling, and I’m usually happiest figuring out what’s going on and finding a cleaner way forward.</p></div>
            <DataFlow/>
            <div className="system-cards">{systems.map(([num,label,title,body])=><article key={num}><span className="ghost-num">{num}</span><p className="node-label">{label}</p><h3>{title}</h3><p>{body}</p></article>)}</div>
            <div className="position-panel"><div><p className="eyebrow">Positioning</p><h3>Analytics-minded, always interested in what makes the data work behind the scenes.</h3></div><p>My background started closer to analytics, but the more I worked with data, the more interested I became in the systems behind it. I’m now building toward data engineering roles while continuing to bring the analytical thinking that got me here.</p><div className="stack-links"><a href="https://www.linkedin.com/in/sanjanashivanand28/" target="_blank" rel="noreferrer"><i className="fa-brands fa-linkedin"/> LinkedIn</a><a href="https://github.com/Sanjanaa30" target="_blank" rel="noreferrer"><i className="fa-brands fa-github"/> GitHub</a></div></div>
          </div>
        </section>

        <section id="education" className="section education-section">
          <div className="wide">
            <div className="section-heading">
              <p className="eyebrow">Education</p>
              <h2>Academic foundation in computer science and data.</h2>
            </div>
            <div className="education-grid education-grid--featured">
              <article>
                <p className="education-date">January 2025 – December 2026</p>
                <h3>M.S. in Computer Science</h3>
                <p className="education-school">Binghamton University, SUNY</p>
                <span className="education-location">Binghamton, NY</span>
                <small className="education-status">Expected December 2026</small>
              </article>
              <article>
                <p className="education-date">June 2020 – June 2024</p>
                <h3>B.E. in Computer Science</h3>
                <p className="education-school">JSS Academy of Technical Education</p>
                <span className="education-location">Bangalore, India</span>
              </article>
            </div>
          </div>
        </section>

        <section id="experience" className="section experience-section">
          <div className="wide"><div className="section-heading"><p className="eyebrow">Experience</p><h2>Production systems, analytics, and technical delivery.</h2></div>
            <div className="experience-stack">{experiences.map((item, i) => {
              const cardId = `experience-${i}`;
              const expanded = Boolean(expandedCards[cardId]);
              return <article className={`experience-card ${expanded ? 'is-expanded' : ''}`} key={item.role}>
                <aside>{String(i+1).padStart(2,'0')}</aside>
                <div className="experience-body">
                  <div className="experience-top"><div><p className="role-dates">{item.dates}</p><h3>{item.role}</h3><p className="muted">{item.company}</p></div><p className="muted location">{item.location}</p></div>
                  <button className="details-toggle" type="button" onClick={() => toggleCard(cardId)} aria-expanded={expanded} aria-controls={`${cardId}-details`}><span>{expanded ? 'Back to the snapshot' : 'Dive into the details'}</span><i className="fa-solid fa-chevron-down" aria-hidden="true"/></button>
                  <div className="experience-details" id={`${cardId}-details`}><div><div className="chips">{item.tags.map(t=><span key={t}>{t}</span>)}</div><ul>{item.bullets.map(b=><li key={b}>{b}</li>)}</ul></div></div>
                </div>
              </article>;
            })}</div>
          </div>
        </section>

        <section id="open-source" className="section open-source-section">
          <div className="wide">
            <div className="section-heading">
              <p className="eyebrow">Open Source Contribution</p>
              <h2>Collaborating on open data systems for real-world agricultural impact.</h2>
            </div>
            <div className="experience-stack">
              <article className={`experience-card open-source-card ${expandedCards['open-source-omdena'] ? 'is-expanded' : ''}`}>
                <div className="experience-body">
                  <div className="experience-top">
                    <div>
                      <p className="role-dates">July 2026 – September 2026</p>
                      <h3>Data Engineering &amp; Machine Learning Contributor</h3>
                      <p className="muted">Omdena · TerraYield Phase 2</p>
                    </div>
                    <p className="muted location">Remote</p>
                  </div>
                  <button className="details-toggle" type="button" onClick={() => toggleCard('open-source-omdena')} aria-expanded={Boolean(expandedCards['open-source-omdena'])} aria-controls="open-source-omdena-details"><span>{expandedCards['open-source-omdena'] ? 'Back to the snapshot' : 'Dive into the details'}</span><i className="fa-solid fa-chevron-down" aria-hidden="true"/></button>
                  <div className="experience-details" id="open-source-omdena-details"><div>
                    <div className="chips">
                      {['Python','ETL','Data Modeling','Validation','Geospatial Data','Machine Learning'].map(tag=><span key={tag}>{tag}</span>)}
                    </div>
                    <ul>
                      <li>Contributed to TerraYield’s crop yield benchmarking work by building a reproducible baseline training workflow. The goal was to measure how well approved regional and crop features could predict yield and give the team a clear starting point for future models.</li>
                      <li>Built the baseline training workflow using the project’s approved feature pipeline and crop yield target. Organized the code so models could be trained and evaluated consistently as the benchmark dataset evolved.</li>
                      <li>Evaluated crop yield predictions across years using a leave-one-year-out approach, which tested each model on a year excluded from its training data. Compared results with RMSE and MAE, using R² as additional context.</li>
                      <li>Documented model results and limitations so the team could reproduce the experiments, understand where predictions were less reliable, and use the baseline as a reference for future improvements.</li>
                    </ul>
                  </div></div>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section id="projects" className="section projects-section">
          <div className="wide"><div className="section-heading"><p className="eyebrow">Projects</p><h2>Applied projects across data engineering, analytics, and AI/ML.</h2></div>
            <div className="project-grid">{projects.map((p,i)=><article className="project-card" key={p[1]}>
              <div className="project-top"><span>{String(i+1).padStart(2,'0')}</span>{i <= 4 && <small className="project-category">{p[0]}</small>}</div>
              <div className="project-copy"><h3>{p[1]}</h3>{p[5] && <p className="project-subtitle">{p[5]}</p>}<p>{p[2]}</p><p className={p[6] ? 'project-engineering' : 'muted'}>{p[6] || 'Lorem ipsum architecture: ingestion → processing → storage → API → interface.'}</p>{p[9] && <p className="project-context">{p[9]}</p>}</div>
              <div className="project-meta">{(p[7] || [p[3]]).length > 0 && <div className="metrics">{(p[7] || [p[3]]).map(metric=><span key={metric}>{metric}</span>)}</div>}{p[8] && <div className="project-stages">{p[8].map((stage,index)=><React.Fragment key={stage}><span>{stage}</span>{index < p[8].length - 1 && <i className="fa-solid fa-arrow-right" aria-hidden="true"/>}</React.Fragment>)}</div>}<div className="chips project-tech">{p[4].map(t=><span key={t}>{t}</span>)}</div><div className="project-actions">{projectLinks[p[1]].demo && <a className="project-action project-action--demo" href={projectLinks[p[1]].demo} target="_blank" rel="noreferrer">Live Demo ↗</a>}<a className="project-action" href={projectLinks[p[1]].github} target="_blank" rel="noreferrer"><i className="fa-brands fa-github"/> GitHub ↗</a></div></div>
            </article>)}</div>

            <div className="planned-projects">
              <div className="planned-heading"><p className="eyebrow">Coming Soon · Planned</p><h3>What’s brewing next? <span className="inline-emoji" aria-hidden="true">🔮</span></h3><span aria-hidden="true"><i className="fa-solid fa-route"/></span></div>
              <article className="planned-project-card">
                <div className="planned-card-top"><div><p className="planned-category">Data Engineering · Analytics · ML</p><h3>NYC Transit Intelligence Platform</h3></div><div className="planned-badge"><i aria-hidden="true"/> Coming Soon · Planned</div></div>
                <p className="planned-summary">A planned data engineering and analytics platform bringing together public NYC transit data to explore ridership, reliability, disruptions, and demand across Subway, SIR, LIRR, and Metro-North.</p>
                <div className="planned-columns">
                  <div><h4>Planned focus</h4><div className="planned-tags">{['Multi-Source Pipelines','Data Quality','Ridership Analytics','Service Reliability','Forecasting'].map(item=><span key={item}>{item}</span>)}</div></div>
                  <div><h4>Planned stack</h4><div className="planned-tags planned-tags--stack">{['Python','SQL','PySpark','AWS','dbt','Airflow','Power BI / Streamlit'].map(item=><span key={item}>{item}</span>)}</div></div>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section id="skills" className="section skills-section">
          <div className="wide"><div className="section-heading"><p className="eyebrow">Technical Capability Map</p><h2>Tools I’ve used across work and projects.</h2></div>
            <div className="skills-grid">{skillGroups.map(([group,items],i)=><article key={group}><div className="skill-head"><span>{String(i+1).padStart(2,'0')}</span><h3>{group}</h3></div><div className="chips">{items.map(s=><span key={s}>{s}</span>)}</div></article>)}</div>
          </div>
        </section>

        <section id="certifications" className="section certifications-section" aria-labelledby="certifications-title">
          <div className="wide">
            <div className="section-heading"><h2 id="certifications-title">Certifications</h2></div>
            <ol className="certification-list">
              <li className="certification-row">
                <span className="certification-number" aria-hidden="true">01</span>
                <div className="certification-copy">
                  <p className="certification-provider">Udemy</p>
                  <h3><a href="https://www.udemy.com/certificate/UC-ed6b1174-2a60-44fd-a6cb-52f9550a6694/" target="_blank" rel="noreferrer">Data Engineering Bootcamp: SQL, ETL, PySpark & AWS (Hands-on)</a></h3>
                </div>
                <div className="certification-meta"><p>Issued <time dateTime="2026-08">Aug 2026</time></p><a className="project-action project-action--demo" href="https://www.udemy.com/certificate/UC-ed6b1174-2a60-44fd-a6cb-52f9550a6694/" target="_blank" rel="noreferrer">Show credential ↗</a></div>
              </li>
            </ol>
          </div>
        </section>

        <section id="contact" className="section contact-section">
          <div className="wide contact-grid"><div className="section-heading contact-heading"><p className="eyebrow">Resume & Contact</p><h2>Let’s build something useful with data.</h2><p>I’m currently exploring full-time opportunities in Data Engineering, Analytics, and other data-focused roles, with an interest in applied AI/ML.</p></div>
            <div className="connect-panel">
              <div className="connect-resume">
                <h3><span className="connect-emoji" aria-hidden="true">🙋‍♀️</span> Let’s connect <span className="connect-aside">(<span className="connect-aside-emoji" aria-hidden="true">🔌</span>no pipeline required)</span></h3>
                <p>One page, zero configuration.</p>
                <a className="connect-download" href={resumePdf} target="_blank" rel="noreferrer"><span><strong>View Resume</strong></span><i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"/></a>
              </div>
              <div className="connect-contact">
                <div className="connect-contact-heading"><h3>Contact</h3><span><i className="fa-solid fa-location-dot" aria-hidden="true"/> Jersey City, NJ · NYC Metropolitan Area.</span></div>
                <div className="connect-channels">
                  <a className="connect-channel" href="mailto:sanjanashivanand28@gmail.com" aria-label="Email Sanjana at sanjanashivanand28@gmail.com"><i className="fa-regular fa-envelope" aria-hidden="true"/><span>Email</span><span className="connect-channel-mark" aria-hidden="true">↗</span></a>
                  <a className="connect-channel" href="https://www.linkedin.com/in/sanjanashivanand28/" target="_blank" rel="noreferrer"><i className="fa-brands fa-linkedin-in" aria-hidden="true"/><span>LinkedIn</span><span className="connect-channel-mark" aria-hidden="true">↗</span></a>
                  <a className="connect-channel" href="https://github.com/Sanjanaa30" target="_blank" rel="noreferrer"><i className="fa-brands fa-github" aria-hidden="true"/><span>GitHub</span><span className="connect-channel-mark" aria-hidden="true">↗</span></a>
                </div>
              </div>
              <div className="connect-roles"><span className="connect-label">Roles I’m exploring</span><div>{['Data Engineer','Analytics Engineer','Data Analyst','BI Analyst','AI/ML Engineer'].map(r=><span key={r}>{r}</span>)}</div></div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer"><div className="wide footer-inner"><div className="footer-identity"><strong>Sanjana Shivanand</strong><p className="footer-note"><em>Built with data + curiosity.</em> <span className="inline-emoji" aria-hidden="true">☕</span></p></div><nav className="footer-nav" aria-label="Footer navigation"><a href="#home">Home</a><a href="#projects">Projects</a><a href="#contact">Contact</a></nav></div></footer>
    </div>
  );
}

export default App;
