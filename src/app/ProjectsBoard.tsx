"use client";

import Image from "next/image";
import { AnimatePresence, motion, type Transition } from "motion/react";
import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import ArrowUpRight from "./ArrowUpRight";
import { projects } from "./projects";

// La bandeja de abajo y la ventana del proyecto comparten layoutId: al soltar una card,
// la bandeja se estira hasta convertirse en la ventana (y al cerrar vuelve a encogerse).
const viewerOpenTransition: Transition = { type: "spring", stiffness: 360, damping: 32, mass: 0.9 };
const viewerCloseTransition: Transition = { type: "tween", duration: 0.28, ease: [0.4, 0, 1, 1] };

// Solo se arrastra con ratón/trackpad; en táctil el gesto chocaría con el scroll y basta con tocar.
const finePointerQuery = "(hover: hover) and (pointer: fine)";
const subscribePointer = (onChange: () => void) => {
  const media = window.matchMedia(finePointerQuery);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
};

export default function ProjectsBoard() {
  const canDrag = useSyncExternalStore(subscribePointer, () => window.matchMedia(finePointerQuery).matches, () => false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overDock, setOverDock] = useState(false);
  const dockRef = useRef<HTMLDivElement>(null);
  const dragged = useRef(false);
  const lastOpened = useRef<string | null>(null);
  const openProject = projects.find((project) => project.id === openId);

  // info.point viene en coordenadas de página; el rect de la bandeja, en coordenadas de viewport.
  const isOverDock = (point: { x: number; y: number }) => {
    const rect = dockRef.current?.getBoundingClientRect();
    if (!rect) return false;
    const x = point.x - window.scrollX;
    const y = point.y - window.scrollY;
    const slack = 24;
    return x > rect.left - slack && x < rect.right + slack && y > rect.top - slack && y < rect.bottom + slack;
  };

  const open = (id: string) => {
    lastOpened.current = id;
    setOpenId(id);
  };
  const close = () => setOpenId(null);

  useEffect(() => {
    if (!openId) return;
    document.body.style.overflow = "hidden";
    document.querySelector<HTMLButtonElement>(".project-modal .minimize-button")?.focus({ preventScroll: true });
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [openId]);

  const dockState = overDock ? "is-hot" : draggingId ? "is-armed" : "";
  const dockText = overDock ? "¡suéltalo! ✦" : draggingId ? "suéltalo aquí ↓" : canDrag ? "arrastra aquí un proyecto para abrirlo" : "toca un proyecto para abrirlo";

  return (
    <>
      <div className="project-grid">
        {projects.map((project) => (
          <motion.div
            key={project.id}
            data-project={project.id}
            className={`project-drag ${canDrag ? "can-drag" : ""} ${draggingId === project.id ? "is-dragging" : ""} ${openId === project.id ? "is-open" : ""}`}
            drag={canDrag && !openId}
            dragSnapToOrigin
            dragMomentum={false}
            whileDrag={{ scale: 1.04, rotate: -2.5 }}
            onPointerDownCapture={() => { dragged.current = false; }}
            onDragStartCapture={(event) => event.preventDefault()}
            onDragStart={() => {
              dragged.current = true;
              setDraggingId(project.id);
            }}
            onDrag={(_, info) => setOverDock(isOverDock(info.point))}
            onDragEnd={(_, info) => {
              setDraggingId(null);
              setOverDock(false);
              if (isOverDock(info.point)) open(project.id);
            }}
            onClick={(event) => {
              if (dragged.current || (event.target as HTMLElement).closest("a, button")) return;
              open(project.id);
            }}
          >
            <article className={`project-card ${project.featured ? "featured" : ""} ${project.color}-card`}>
              <div className="project-top"><span className="project-number">{project.number}</span><span className="project-top-end"><span className={`project-status ${project.status.tone ?? ""}`}>● {project.status.label}</span><button className="project-open" onClick={() => open(project.id)} aria-haspopup="dialog" aria-label={`Abrir ${project.title}`}>abrir <ArrowUpRight /></button></span></div>
              {project.visual}
              <div className="project-content"><h3>{project.title}{project.subtitle && <> <small>{project.subtitle}</small></>}</h3><p>{project.summary}</p><div className="tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div>
            </article>
          </motion.div>
        ))}
      </div>

      <div className={`viewer-dock-slot ${overDock ? "is-hot" : ""}`}>
        {/* Igual que la carpeta de "Sobre mí": mientras la ventana está abierta, la bandeja deja un hueco del mismo tamaño */}
        {openId ? <div className="viewer-dock is-placeholder" aria-hidden="true" /> : (
          <motion.div ref={dockRef} layoutId="project-viewer" className={`viewer-dock ${dockState}`} transition={viewerCloseTransition}>
            <span className="cs-bar"><i /><i /><i /><em>/abrir-proyecto</em></span>
            <span className="viewer-dock-body"><span className="viewer-dock-icon" aria-hidden="true">⇣</span>{dockText}</span>
          </motion.div>
        )}
      </div>

      <AnimatePresence onExitComplete={() => document.querySelector<HTMLButtonElement>(`[data-project="${lastOpened.current}"] .project-open`)?.focus({ preventScroll: true })}>
        {openProject && (
          <div key="project-modal" className="project-modal">
            <motion.div className="project-backdrop" onClick={close} initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.3 } }} exit={{ opacity: 0, transition: { duration: 0.25 } }} />
            <motion.div layoutId="project-viewer" className="project-window" role="dialog" aria-modal="true" aria-label={openProject.title} transition={viewerOpenTransition} style={{ "--accent": `var(--${openProject.color === "green" ? "mint" : openProject.color})`, boxShadow: "10px 10px 0 var(--accent)" } as CSSProperties}>
              <motion.div className="project-window-inner" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.14, duration: 0.2 } }} exit={{ opacity: 0, transition: { duration: 0.08 } }}>
                <div className="explorer-topbar"><div className="window-dots"><i /><i /><i /></div><span>ceci / proyectos / {openProject.id}</span><button className="minimize-button" onClick={close} aria-label="Cerrar proyecto">×</button></div>
                <div className="project-detail">
                  <div className="project-detail-copy">
                    <span className="project-detail-kicker">{openProject.number} · <span className={`project-status ${openProject.status.tone ?? ""}`}>● {openProject.status.label}</span></span>
                    <h2>{openProject.title}{openProject.subtitle && <> <small>{openProject.subtitle}</small></>}</h2>
                    <p className="project-detail-lead">{openProject.summary}</p>
                    <h3>El reto</h3>
                    <p>{openProject.problem}</p>
                    <h3>Qué construí</h3>
                    <ul>{openProject.built.map((item) => <li key={item}>{item}</li>)}</ul>
                    <div className="tags">{openProject.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                    {openProject.link && <a className="project-detail-link" href={openProject.link.href} target="_blank" rel="noreferrer">{openProject.link.label} <ArrowUpRight /></a>}
                  </div>
                  <div className="project-detail-gallery">
                    {openProject.shots.map((shot) => {
                      const wide = shot.width > shot.height;
                      return (
                        <figure key={shot.src} className={`project-shot ${wide ? "is-wide" : ""}`}>
                          <span className="cs-bar"><i /><i /><i /><em>{shot.label}</em></span>
                          <Image src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} sizes={wide ? "(max-width: 760px) 90vw, 520px" : "(max-width: 760px) 45vw, 250px"} />
                        </figure>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
