"use client";

import { AnimatePresence, MotionConfig, motion, type Transition } from "motion/react";
import { useEffect, useRef, useState } from "react";
import ArrowUpRight from "./ArrowUpRight";
import ProjectsBoard from "./ProjectsBoard";
import TabletContact from "./TabletContact";

const pleatColors = ["coral", "yellow", "lilac", "mint"].flatMap((color) => Array(4).fill(color) as string[]);

// Carpeta "Sobre mí": la carpeta y la ventana comparten layoutId, así Motion calcula el viaje
// desde la posición real de la carpeta hasta el panel (y de vuelta al cerrar).
const aboutOpenTransition: Transition = { type: "spring", stiffness: 380, damping: 30, mass: 0.9 };
const aboutCloseTransition: Transition = { type: "tween", duration: 0.28, ease: [0.4, 0, 1, 1] };

const profileText = "Con una mentalidad curiosa y proactiva, busco constantemente ampliar mis conocimientos y habilidades a través del aprendizaje autónomo. Me adapto con facilidad a nuevos entornos y desafíos, trabajando eficazmente en equipo y con una clara orientación a la consecución de objetivos.";

export default function Home() {
  const [selectedFolder, setSelectedFolder] = useState("sobre-mi");
  const [aboutOpen, setAboutOpen] = useState(false);
  const [folderLaunching, setFolderLaunching] = useState(false);
  const folderButtonRef = useRef<HTMLButtonElement>(null);
  const [typedCharacters, setTypedCharacters] = useState(0);
  const [projectsTransition, setProjectsTransition] = useState<"idle" | "covering" | "revealing">("idle");
  const [noteStuck, setNoteStuck] = useState(false);
  const [loaderProgress, setLoaderProgress] = useState(0);
  const [loaderPhase, setLoaderPhase] = useState<"loading" | "leaving" | "done">("loading");
  const loaderTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("loader-seen") === "1";
    } catch {}
    if (seen || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const skip = window.setTimeout(() => setLoaderPhase("done"), 0);
      return () => window.clearTimeout(skip);
    }
    document.body.style.overflow = "hidden";
    const start = performance.now();
    let loaded = document.readyState === "complete";
    const onLoad = () => { loaded = true; };
    window.addEventListener("load", onLoad);
    loaderTimer.current = window.setInterval(() => {
      const elapsed = performance.now() - start;
      const ready = (loaded && elapsed > 1400) || elapsed > 2800;
      setLoaderProgress((current) => ready ? Math.min(100, current + 5) : Math.min(90, current + Math.max(0.6, (90 - current) * 0.06)));
    }, 40);
    return () => {
      window.clearInterval(loaderTimer.current);
      window.removeEventListener("load", onLoad);
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (loaderPhase !== "loading" || loaderProgress < 100) return;
    window.clearInterval(loaderTimer.current);
    const leave = window.setTimeout(() => {
      setLoaderPhase("leaving");
      document.body.style.overflow = "";
      try {
        sessionStorage.setItem("loader-seen", "1");
      } catch {}
    }, 300);
    return () => window.clearTimeout(leave);
  }, [loaderProgress, loaderPhase]);

  useEffect(() => {
    if (loaderPhase !== "leaving") return;
    const done = window.setTimeout(() => setLoaderPhase("done"), 900);
    return () => window.clearTimeout(done);
  }, [loaderPhase]);

  const loaderPercent = Math.round(loaderProgress);
  const loaderStatus = loaderPercent < 30 ? "abriendo carpetas…" : loaderPercent < 60 ? "pegando post-its…" : loaderPercent < 95 ? "afilando el subrayado…" : "¡listo!";
  const transitionRef = useRef(projectsTransition);

  useEffect(() => {
    transitionRef.current = projectsTransition;
  }, [projectsTransition]);

  useEffect(() => {
    const note = document.querySelector(".heading-note");
    if (!note) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && transitionRef.current === "idle") {
        setNoteStuck(true);
        observer.disconnect();
      }
    }, { threshold: 0.6 });
    observer.observe(note);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const showText = window.setTimeout(() => setTypedCharacters(profileText.length), 0);
      return () => window.clearTimeout(showText);
    }

    const timer = window.setInterval(() => {
      setTypedCharacters((current) => {
        if (current >= profileText.length) {
          window.clearInterval(timer);
          return current;
        }
        return current + 1;
      });
    }, 8);

    return () => window.clearInterval(timer);
  }, []);
  const academicRecords = [
    ["Grado Superior en Desarrollo de Aplicaciones Multiplataforma (DAM)", "Salesianos Zaragoza", "En curso"],
    ["Ciberseguridad: Prevención, Análisis y Respuesta a Incidentes de Seguridad · 49h", "Mainjobs Internacional Educativa y Tecnológica, S.A.", "2025"],
    ["Herramientas del Big Data y Gobierno del Dato · 60h", "Mainjobs Internacional Educativa y Tecnológica, S.A.", "2025"],
    ["Desarrollo Web FullStack Development · 180h", "CEI: Centro de estudios de Diseño, Marketing y Nuevas Tecnologías", "2024-2025"],
    ["Titulación Superior de Música en la especialidad de Violoncello", "Conservatorio Superior de Música de Navarra", "2017-2021"],
    ["Título de Bachillerato", "IES Torre de los Espejos", "2012-2015"],
    ["Titulación de Grado Medio de Música en la especialidad de Violoncello", "Conservatorio Profesional de Música de Zaragoza", "2010-2016"],
  ];
  const workRecords: [string, string, string, string[]][] = [
    ["Profesora de música", "Guardería Pequeños Venecianos, Centro San Gabriel de Zuera, colegios Julián Nieto Tapia, Jerónimo Blancas, Nuestra Señora del Huerto y Escuela Kithara (Pamplona).", "docencia", ["Clases de música a niños de infantil y primaria", "Diseño de actividades lúdicas y pedagógicas"]],
    ["Música y arte", "Violonchelista en OSN, Joven Orquesta de Pamplona, OSCZ y otras formaciones.", "creatividad", ["Colaboraciones con Raphael, Pablo López y Sôber", "Duo Dídyma: composición, grabación e ilustración", "Autora e ilustradora de Mimi y Fafa, las exploradoras de la música"]],
    ["Departamento IT", "Belsué Mediación de Seguros", "actualidad", ["Administración tecnológica", "Soporte técnico", "Desarrollo de herramientas internas"]],
  ];
  const folderDetails: Record<string, { label: string; detail: string; items: string[] }> = {
    "sobre-mi": { label: "sobre-mi", detail: "perfil y contexto personal", items: ["Cecilia Ferraz Fernández", "DAM · Salesianos Zaragoza", "Belsué Mediación de Seguros"] },
    formacion: { label: "formacion-academica", detail: "aprendizaje en expansión", items: ["DAM · En curso", "Ciberseguridad · 2025", "Big Data · 2025", "FullStack · 2024-2025"] },
    experiencia: { label: "experiencia-laboral", detail: "problemas reales, soluciones reales", items: ["Profesora de música", "Música y arte", "Departamento IT"] },
  };
  const currentFolder = folderDetails[selectedFolder];
  // La carpeta se aplasta y se estira (efecto elástico) y, en el pico del estirón, sale la ventana.
  const openAbout = () => {
    if (aboutOpen || folderLaunching) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setAboutOpen(true);
    setFolderLaunching(true);
    window.setTimeout(() => setAboutOpen(true), 210);
    window.setTimeout(() => setFolderLaunching(false), 460);
  };
  const closeAbout = () => setAboutOpen(false);

  useEffect(() => {
    if (!aboutOpen) return;
    document.body.style.overflow = "hidden";
    document.querySelector<HTMLButtonElement>(".about-modal .minimize-button")?.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = "";
    };
  }, [aboutOpen]);

  useEffect(() => {
    if (!aboutOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeAbout();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  useEffect(() => {
    if (projectsTransition !== "revealing") return;
    const stickNote = window.setTimeout(() => setNoteStuck(true), 600);
    const pleats = Array.from(document.querySelectorAll<HTMLElement>(".page-wipe .pleat"));
    const width = window.innerWidth / pleats.length;
    const half = pleats.length / 2;
    const steps = 16;
    const maxAngle = 88;
    const animations = pleats.map((pleat, index) => {
      const fromLeft = index < half;
      const position = fromLeft ? index : pleats.length - 1 - index;
      const direction = fromLeft ? 1 : -1;
      const folded = position % 2 === 1;
      pleat.style.transformOrigin = fromLeft ? "left center" : "right center";
      const frames = Array.from({ length: steps + 1 }, (_, step) => {
        const progress = step / steps;
        const angle = (maxAngle * progress * Math.PI) / 180;
        const shift = -direction * position * width * (1 - Math.cos(angle));
        const depth = folded ? -width * Math.sin(angle) : 0;
        const rotation = direction * (folded ? -1 : 1) * maxAngle * progress;
        return {
          transform: `translateX(${shift}px) translateZ(${depth}px) rotateY(${rotation}deg)`,
          filter: `brightness(${1 - (folded ? 0.35 : 0.08) * progress})`,
          opacity: progress > 0.85 ? (1 - progress) / 0.15 : 1,
        };
      });
      return pleat.animate(frames, { duration: 750, delay: 150, easing: "cubic-bezier(.6,0,.3,1)", fill: "forwards" });
    });
    return () => {
      window.clearTimeout(stickNote);
      animations.forEach((animation) => animation.cancel());
    };
  }, [projectsTransition]);

  const goToProjects = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const projects = document.getElementById("proyectos");
    if (!projects || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    event.preventDefault();
    if (projectsTransition !== "idle") return;
    setProjectsTransition("covering");
    window.setTimeout(() => {
      projects.scrollIntoView({ behavior: "instant", block: "start" });
      setProjectsTransition("revealing");
    }, 1200);
    window.setTimeout(() => setProjectsTransition("idle"), 2650);
  };

  return (
    <MotionConfig reducedMotion="user">
    <main className={loaderPhase === "loading" ? "is-loading" : undefined}>
      {loaderPhase !== "done" && <><div className={`site-loader is-${loaderPhase}`} suppressHydrationWarning role="progressbar" aria-label="Cargando portfolio" aria-valuemin={0} aria-valuemax={100} aria-valuenow={loaderPercent}>
        <div className="loader-inner">
          <span className="loader-kicker">00 / cargando</span>
          <strong className="loader-title">Preparando el entorno...<br />
          </strong>
          <div className="loader-bar"><span style={{ width: `${loaderProgress}%` }} /></div>
          <div className="loader-meta"><span>{loaderStatus}</span><b>{loaderPercent}%</b></div>
        </div>
      </div>
      <script dangerouslySetInnerHTML={{ __html: `try{if(sessionStorage.getItem("loader-seen")==="1"||matchMedia("(prefers-reduced-motion: reduce)").matches)document.currentScript.previousElementSibling.style.display="none"}catch(e){}` }} /></>}
      <nav className="site-nav" aria-label="Navegación principal">
        
        <div className="nav-links">
          <a href="#sobre-mi" onClick={(event) => { event.preventDefault(); openAbout(); }}>Sobre mí</a>
          <a href="#proyectos">Proyectos</a>
          <a href="#contacto">Hablemos <span aria-hidden="true"><ArrowUpRight /></span></a>
        </div>
      </nav>

      <section className="hero section-shell" id="top">
        <div className="hero-copy reveal-up">
          <p className="eyebrow"><span className="status-dot" /> Estudiante DAM + builder en Zaragoza</p>
          <h1><span className="hero-name"><span className="name-underline"><span>Cecilia </span><span>Ferraz </span><span>Fernández</span></span></span><span className="hero-tagline">Programo soluciones para <em>problemas reales.</em></span></h1>
          <p className="hero-intro">Soy Cecilia. Desarrollo herramientas, asistentes y productos digitales con curiosidad, criterio y una obsesión bastante sencilla: hacer que las cosas funcionen y que el trabajo sea un poco más fácil.</p>
          <div className="hero-actions">
            <a className="text-link" href="#contacto">Cuéntame una idea <span aria-hidden="true"><ArrowUpRight /></span></a>
          </div>
        </div>
        <div className="hero-folder-slot reveal-up"><div className={`folder-gate ${aboutOpen ? "is-away" : ""}`}><span className="gate-kicker">01 / CONTEXTO</span>{/* Solo puede haber un elemento con layoutId montado: mientras la ventana está abierta, la carpeta deja un hueco del mismo tamaño */}{aboutOpen ? <div className="folder-morph folder-placeholder" aria-hidden="true" /> : <motion.div layoutId="about-window" className="folder-morph" transition={aboutCloseTransition}><button ref={folderButtonRef} className={`floating-folder ${folderLaunching ? "is-launching" : ""}`} onClick={openAbout} aria-haspopup="dialog" aria-expanded={aboutOpen} aria-label="Abrir carpeta Sobre mí"><span className="folder-tab" /><span className="folder-papers" aria-hidden="true"><i /><i /></span><span className="folder-label">sobre-mi</span><span className="folder-subtitle">haz click para abrir</span><span className="folder-arrow"><ArrowUpRight /></span></button></motion.div>}<p className="gate-hint">aquí dentro hay más de una historia</p></div>{aboutOpen && <div className="open-folder-state"><span className="gate-kicker">01 / ABIERTA</span><a className="open-folder" href="#sobre-mi" aria-label="Ir a la carpeta Sobre mí abierta"><span className="open-folder-back" /><span className="open-folder-paper" aria-hidden="true"><i /><i /><i /><i /></span><span className="open-folder-front"><span className="folder-label">sobre-mi</span><span className="folder-subtitle">abierta · sigue leyendo abajo ↓</span></span></a><p className="gate-hint">la estás leyendo ahora mismo</p></div>}</div>
        <div className="hero-cta reveal-up"><span className="cta-hint">psst… empieza por aquí</span><a className={`button button-primary projects-launch ${projectsTransition === "covering" ? "is-launching" : ""}`} href="#proyectos" onClick={goToProjects}>Ver lo que estoy haciendo <span aria-hidden="true">↓</span></a></div>
      </section>


      <section className="about section-shell" id="sobre-mi">
      </section>

      <section className={`projects section-shell ${projectsTransition === "revealing" ? "is-arriving" : ""}`} id="proyectos">
        <div className="section-heading"><div className="section-marker">02 / LO QUE HAGO</div><h2>Proyectos con <em>historia propia.</em></h2><p className={`heading-note ${noteStuck ? "is-stuck" : ""}`}>Algunos nacieron de una necesidad real, otros de la curiosidad.</p></div>
        <ProjectsBoard />
      </section>

      <section className="concept section-shell"><div className="concept-stamp">IDEA<br />EN<br />PAUSA</div><div><div className="section-marker">03 / IDEAS Y CONCEPTOS</div><h2>SuperFinder</h2><p>Una app colaborativa, estilo Waze, para encontrar productos en supermercados gracias a las ubicaciones compartidas por la comunidad.</p><span className="concept-label">concepto de hackathon · todavía no implementado</span></div><span className="concept-arrow"><ArrowUpRight /></span></section>

      <section className="skills section-shell"><div className="section-marker">04 / MI CAJA DE HERRAMIENTAS</div><div className="skills-grid"><div><h2>Las herramientas<br /><em>son el medio.</em></h2><p className="skills-intro">Un stack que crece conmigo: de la interfaz a los datos, pasando por la infraestructura que hace que todo aguante.</p></div><div className="skill-groups"><div className="skill-group"><span className="skill-group-label">Frontend</span><div className="skill-cloud"><span className="skill-pill large blue-pill">HTML · CSS</span><span className="skill-pill coral-pill">JavaScript</span><span className="skill-pill green-pill">React</span><span className="skill-pill yellow-pill">Next.js</span><span className="skill-pill pink-pill">TypeScript</span><span className="skill-pill outline-pill">Tailwind CSS</span></div></div><div className="skill-group"><span className="skill-group-label">Backend + datos</span><div className="skill-cloud"><span className="skill-pill coral-pill">Node.js</span><span className="skill-pill green-pill">Express.js</span><span className="skill-pill outline-pill">PostgreSQL</span><span className="skill-pill yellow-pill">MongoDB</span><span className="skill-pill outline-pill">MySQL</span></div></div><div className="skill-group"><span className="skill-group-label">Ecosistema</span><div className="skill-cloud"><span className="skill-pill small-pill">Git</span><span className="skill-pill outline-pill">Supabase</span><span className="skill-pill blue-pill">AWS · VPC · EC2</span><span className="skill-pill outline-pill">Load Balancers · Auto Scaling</span><span className="skill-pill coral-pill">VS Code</span><span className="skill-pill yellow-pill">Eclipse</span><span className="skill-pill outline-pill">Visual Studio Community · Windows/iOS</span><span className="skill-pill green-pill">Inglés B1</span></div></div></div></div></section>

      <section className="contact section-shell" id="contacto"><div className="contact-copy"><div className="section-marker">05 / CONTACTO</div><h2>¿Tienes una idea<br />dando vueltas?</h2><p>Me encantan los problemas concretos, las conversaciones con café y las ideas que todavía no tienen nombre.</p><div className="contact-links"><a href="mailto:hola@ceci.dev"><span>✉</span> hola@ceci.dev <b><ArrowUpRight /></b></a><a href="https://www.linkedin.com" target="_blank" rel="noreferrer"><span>in</span> LinkedIn <b><ArrowUpRight /></b></a><a href="https://github.com" target="_blank" rel="noreferrer"><span>⌘</span> GitHub <b><ArrowUpRight /></b></a></div></div><TabletContact /></section>

      <footer><span>Hecho con curiosidad y demasiadas pestañas abiertas.</span><span>© 2026 Ceci</span></footer>
      {projectsTransition !== "idle" && <div className={`page-wipe is-${projectsTransition}`} aria-hidden="true">{projectsTransition === "revealing" ? pleatColors.map((color, index) => <i className="pleat" key={index} style={{ background: `var(--${color})` }} />) : <><i /><i /><i /><i /></>}<span>02 / proyectos ↓</span></div>}
      <AnimatePresence onExitComplete={() => folderButtonRef.current?.focus({ preventScroll: true })}>{aboutOpen && <div key="about-modal" className="about-modal">
        <motion.div className="about-backdrop" onClick={closeAbout} initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.3 } }} exit={{ opacity: 0, transition: { duration: 0.25 } }} />
        <motion.div layoutId="about-window" className="file-explorer" role="dialog" aria-modal="true" aria-label="Sobre mí" transition={aboutOpenTransition} style={{ boxShadow: "10px 10px 0 #1d9089" }}>
        <motion.div className="explorer-inner" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.14, duration: 0.2 } }} exit={{ opacity: 0, transition: { duration: 0.08 } }}>
          <div className="explorer-topbar"><div className="window-dots"><i /><i /><i /></div><span>ceci / sobre-mi</span><button className="minimize-button" onClick={closeAbout} aria-label="Minimizar explorador">−</button></div>
          <div className="explorer-path"><span>⌂</span><span>portfolio</span><b>/</b><strong>{currentFolder.label}</strong></div>
          <div className="explorer-body">
            <aside className="explorer-sidebar"><span className="explorer-label">MIS CARPETAS</span>{Object.keys(folderDetails).map((folder) => <button className={`folder ${folder === selectedFolder ? "active-folder" : ""}`} key={folder} onClick={() => setSelectedFolder(folder)} aria-pressed={folder === selectedFolder}>{folder === selectedFolder ? "▾" : "▸"}<span>{folderDetails[folder].label}</span></button>)}<span className="explorer-label explorer-label-bottom">ESTADO</span><div className="explorer-status"><i /> disponible para crear</div></aside>
            <div className={`explorer-content folder-${selectedFolder}`}><div className="explorer-content-heading"><div><span className="section-marker">01 / CONTEXTO</span><h2>No solo estudio<br /><span>cómo se construye.</span><br />Lo estoy haciendo.</h2></div><div className="file-meta">{selectedFolder === "formacion" ? academicRecords.length : selectedFolder === "experiencia" ? workRecords.length : currentFolder.items.length} elementos<br />abierto ahora</div></div><div className="about-origin"><span>carpeta abierta</span><strong>{currentFolder.label}</strong></div><div className="folder-preview"><div><span className="preview-icon">⌂</span><div><strong>{currentFolder.label}</strong><small>{currentFolder.detail}</small></div></div><div className="preview-items">{currentFolder.items.map((item) => <span key={item}>▹ {item}</span>)}</div></div>{selectedFolder === "formacion" && <div className="education-list">{academicRecords.map(([title, school, period]) => <article key={title}><span className="education-period">{period}</span><div><strong>{title}</strong><small>{school}</small></div></article>)}</div>}{selectedFolder === "experiencia" && <div className="education-list work-list">{workRecords.map(([title, place, period, tasks]) => <article key={title}><span className="education-period">{period}</span><div><strong>{title}</strong><small>{place}</small><ul>{tasks.map((task) => <li key={task}>{task}</li>)}</ul></div></article>)}</div>}<div className="roadmap" aria-label="Recorrido personal y profesional"><div className="roadmap-track" /><div className="roadmap-stop stop-one"><span className="roadmap-pin">01</span><div className="roadmap-card"><small>2023</small><strong>Empiezo DAM</strong><span>primer checkpoint</span></div></div><div className="roadmap-stop stop-two"><span className="roadmap-pin">02</span><div className="roadmap-card"><small>2024</small><strong>Me uno a Belsué</strong><span>el mundo real aparece</span></div></div><div className="roadmap-stop stop-now"><span className="roadmap-pin">✦</span><div className="roadmap-card"><small>AHORA</small><strong>Construyo, aprendo y pruebo</strong><span className="now-label">en movimiento</span></div></div><span className="roadmap-end">siguiente capítulo →</span></div><div className="about-text"><p className="typewriter-text" aria-label={profileText}>{profileText.slice(0, typedCharacters)}<span className="typewriter-cursor" aria-hidden="true" /></p><div className="about-signature">Ceci <span>⌁</span></div></div></div>
          </div>
        </motion.div>
        </motion.div>
      </div>}</AnimatePresence>
    </main>
    </MotionConfig>
  );
}
