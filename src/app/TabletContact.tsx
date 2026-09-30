"use client";

import { AnimatePresence, motion, type Transition } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import ArrowUpRight from "./ArrowUpRight";
import ContactForm from "./ContactForm";

// Tablet del contacto: al tocarla, un clon de la tablet (fijo en pantalla) hace zoom hasta que su
// pantalla cubre todo el viewport y, desde el icono central, se abre la "app" con el formulario.
// idle → zoomIn → open → appClosing → zoomOut → idle
type Phase = "idle" | "zoomIn" | "open" | "appClosing" | "zoomOut";
type Geometry = { left: number; top: number; width: number; height: number; x: number; y: number; scale: number };

const TABLET_TILT = -2;
const zoomInTransition: Transition = { duration: 1, ease: [0.76, 0, 0.24, 1] };
const zoomOutTransition: Transition = { duration: 0.8, ease: [0.76, 0, 0.24, 1] };
const appTransition: Transition = { type: "spring", stiffness: 320, damping: 30 };

const sideApps = [
  { label: "proyectos", glyph: "▦", color: "yellow", className: "app-left-top" },
  { label: "música", glyph: "♪", color: "mint", className: "app-left-bottom" },
  { label: "github", glyph: "⌘", color: "paper", className: "app-right-top" },
  { label: "café", glyph: "☕", color: "yellow", className: "app-right-bottom" },
];
const dockApps = ["✎", "◐", "✉", "⌂"];

function TabletFace() {
  return (
    <span className="tablet-face">
      <span className="tablet-camera" />
      <span className="tablet-screen">
        <span className="tablet-status"><b>9:41</b><span>ceci-os</span><span>●●● 87%</span></span>
        {sideApps.map((app) => (
          <span key={app.label} className={`tablet-icon ${app.className}`}>
            <span className={`tablet-icon-tile tile-${app.color}`}>{app.glyph}</span>
            <span className="tablet-icon-label">{app.label}</span>
          </span>
        ))}
        <span className="tablet-main-app">
          <span className="tablet-main-tile">✦</span>
          <span className="tablet-main-label">nueva-idea</span>
          <span className="tablet-main-hint">toca para entrar <ArrowUpRight /></span>
        </span>
        <span className="tablet-dock">{dockApps.map((glyph) => <i key={glyph}>{glyph}</i>)}</span>
      </span>
    </span>
  );
}

export default function TabletContact() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [geometry, setGeometry] = useState<Geometry | null>(null);
  const tabletRef = useRef<HTMLButtonElement>(null);
  const appRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef(false);

  // Mide la tablet real y calcula cuánto hay que escalarla para que su pantalla cubra el viewport.
  const measure = (): Geometry | null => {
    const tablet = tabletRef.current;
    const screen = tablet?.querySelector<HTMLElement>(".tablet-screen");
    if (!tablet || !screen) return null;
    const rect = tablet.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const width = tablet.offsetWidth;
    const height = tablet.offsetHeight;
    const scale = Math.max(window.innerWidth / screen.offsetWidth, window.innerHeight / screen.offsetHeight) * 1.04;
    return { left: cx - width / 2, top: cy - height / 2, width, height, x: window.innerWidth / 2 - cx, y: window.innerHeight / 2 - cy, scale };
  };

  const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const enter = () => {
    if (phase !== "idle") return;
    if (reducedMotion()) {
      setGeometry(null);
      return setPhase("open");
    }
    setGeometry(measure());
    setPhase("zoomIn");
  };

  const leave = () => {
    if (phase !== "open") return;
    setGeometry(reducedMotion() ? null : measure());
    setPhase("appClosing");
  };

  const finish = () => {
    setPhase("idle");
    setGeometry(null);
    returnFocus.current = true;
  };

  // Al volver a la web, el foco regresa a la tablet (cuando ya vuelve a ser visible).
  useEffect(() => {
    if (phase !== "idle" || !returnFocus.current) return;
    returnFocus.current = false;
    tabletRef.current?.focus({ preventScroll: true });
  }, [phase]);

  useEffect(() => {
    if (phase === "idle") return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "open") return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") leave();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const zoomed = geometry && { x: geometry.x, y: geometry.y, scale: geometry.scale, rotate: 0 };
  const rest = { x: 0, y: 0, scale: 1, rotate: TABLET_TILT };

  return (
    <div className="contact-tablet-slot">
      <button ref={tabletRef} type="button" className={`contact-tablet ${phase !== "idle" ? "is-away" : ""}`} onClick={enter} aria-haspopup="dialog" aria-expanded={phase === "open"} aria-label="Entrar en la tablet para escribirme">
        <TabletFace />
      </button>
      <p className="tablet-caption">psst… la idea se escribe <em>dentro</em> de la tablet</p>

      {phase !== "idle" && createPortal(
        <div className="tablet-portal">
          <motion.div className="tablet-backdrop" initial={{ opacity: 0 }} animate={{ opacity: phase === "zoomOut" ? 0 : 1 }} transition={phase === "zoomOut" ? zoomOutTransition : zoomInTransition} />
          {geometry && zoomed && (
            <motion.div
              className="tablet-clone"
              aria-hidden="true"
              style={{ left: geometry.left, top: geometry.top, width: geometry.width, height: geometry.height }}
              initial={rest}
              animate={phase === "zoomOut" ? rest : zoomed}
              transition={phase === "zoomOut" ? zoomOutTransition : zoomInTransition}
              onAnimationComplete={() => {
                if (phase === "zoomIn") setPhase("open");
                else if (phase === "zoomOut") finish();
              }}
            >
              <TabletFace />
            </motion.div>
          )}
          <AnimatePresence onExitComplete={() => (geometry ? setPhase("zoomOut") : finish())}>
            {phase === "open" && (
              <motion.div
                key="tablet-app"
                ref={appRef}
                className="tablet-app"
                role="dialog"
                aria-modal="true"
                aria-label="Formulario de contacto"
                tabIndex={-1}
                initial={{ opacity: 0, scale: 0.3, borderRadius: 60 }}
                animate={{ opacity: 1, scale: 1, borderRadius: 0 }}
                exit={{ opacity: 0, scale: 0.3, borderRadius: 60, transition: { duration: 0.3, ease: [0.4, 0, 1, 1] } }}
                transition={appTransition}
                onAnimationComplete={() => appRef.current?.focus({ preventScroll: true })}
              >
                <div className="tablet-app-status"><b>9:41</b><span>nueva-idea</span><span>●●● 87%</span></div>
                <div className="tablet-app-body"><ContactForm /></div>
                <button type="button" className="tablet-home" onClick={leave}><span className="tablet-home-bar" />volver al portfolio</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>,
        document.body,
      )}
    </div>
  );
}
