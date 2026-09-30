import Image from "next/image";
import type { ReactNode } from "react";
import ArrowUpRight from "./ArrowUpRight";

type Shot = { src: string; alt: string; width: number; height: number; label: string };

export type Project = {
  id: string;
  number: string;
  title: string;
  subtitle?: string;
  status: { label: string; tone?: "live" | "pilot" };
  color: "coral" | "ink" | "blue" | "pink" | "green" | "yellow";
  featured?: boolean;
  summary: string;
  tags: string[];
  visual: ReactNode;
  // Contenido de la ventana abierta (borrador: revisar y completar)
  problem: string;
  built: string[];
  shots: Shot[];
  link?: { href: string; label: string };
};

export const projects: Project[] = [
  {
    id: "belchat",
    number: "01",
    title: "BelChat",
    status: { label: "En producción", tone: "live" },
    color: "coral",
    featured: true,
    summary: "WhatsApp Business convertido en un sistema de tickets con IA, seguimiento y un panel de atención en tiempo real.",
    tags: ["Meta API", "IA", "Webhooks", "Tiempo real"],
    visual: <div className="project-visual belchat-visual"><span className="cs-window bc-window-back"><span className="cs-bar"><i /><i /><i /><em>belchat · tickets</em></span><Image src="/imagenes/belchat/belchat-panel.png" alt="Panel de tickets de BelChat con la bandeja de pendientes" width={1910} height={955} sizes="(max-width: 760px) 65vw, 330px" /></span><span className="cs-window bc-window-front"><span className="cs-bar"><i /><i /><i /><em>/conversacion</em></span><Image src="/imagenes/belchat/belchat-conversacion.png" alt="Conversación de WhatsApp atendida desde BelChat" width={1913} height={952} sizes="(max-width: 760px) 60vw, 300px" /></span><span className="bc-phone"><Image src="/imagenes/belchat/belchat-movil-recorte.png" alt="BelChat en WhatsApp dando la bienvenida a un cliente" width={650} height={1290} sizes="130px" /></span><span className="cs-sticker bc-sticker">WhatsApp → tickets</span></div>,
    problem: "Las consultas de clientes llegaban por WhatsApp sin orden ni seguimiento: costaba saber qué estaba pendiente y quién se encargaba de cada una.",
    built: [
      "Integración con la API de WhatsApp Business de Meta mediante webhooks.",
      "Un asistente con IA que da la bienvenida y recoge la consulta del cliente.",
      "Cada conversación se convierte en un ticket con su estado y su historial.",
      "Panel de atención en tiempo real con la bandeja de pendientes.",
    ],
    shots: [
      { src: "/imagenes/belchat/belchat-panel.png", alt: "Panel de tickets de BelChat con la bandeja de pendientes", width: 1910, height: 955, label: "belchat · tickets" },
      { src: "/imagenes/belchat/belchat-conversacion.png", alt: "Conversación de WhatsApp atendida desde BelChat", width: 1913, height: 952, label: "/conversacion" },
      { src: "/imagenes/belchat/belchat-movil-recorte.png", alt: "BelChat en WhatsApp dando la bienvenida a un cliente", width: 650, height: 1290, label: "whatsapp" },
    ],
  },
  {
    id: "correseguro",
    number: "02",
    title: "CorreSeguro",
    status: { label: "En producción", tone: "live" },
    color: "ink",
    featured: true,
    summary: "Web de Belsué para contratar un seguro deportivo para runners: coberturas claras, contratación online en 7 pasos y un chat con IA disponible 24/7.",
    tags: ["JavaScript", "Formulario multipaso", "Chat IA", "Analytics"],
    visual: <div className="project-visual correseguro-visual"><span className="cs-window cs-window-back"><span className="cs-bar"><i /><i /><i /><em>correseguro.es</em></span><Image src="/imagenes/correseguro/correseguro-portada.png" alt="Portada de CorreSeguro: el seguro pensado por runners, para runners" width={1904} height={935} sizes="(max-width: 760px) 70vw, 380px" /></span><span className="cs-window cs-window-front"><span className="cs-bar"><i /><i /><i /><em>/contratar</em></span><Image src="/imagenes/correseguro/correseguro-contratacion.png" alt="Formulario de contratación en 7 pasos, empezando por los datos personales del asegurado" width={1328} height={909} sizes="(max-width: 760px) 60vw, 300px" /></span><span className="cs-chat"><Image src="/imagenes/correseguro/correseguro-chat.png" alt="Asistente CorreSeguro con IA saludando y mostrando preguntas frecuentes" width={495} height={729} sizes="120px" /></span><span className="cs-sticker">7 pasos + chat IA</span><a className="bib-link" href="https://correseguro.es" target="_blank" rel="noreferrer">correseguro.es <b><ArrowUpRight /></b></a></div>,
    problem: "Contratar un seguro deportivo suele ser lento y confuso. La idea era que un corredor entendiera las coberturas y pudiera contratar online sin tener que llamar a nadie.",
    built: [
      "Web de producto con las coberturas explicadas de forma clara.",
      "Formulario de contratación en 7 pasos, empezando por los datos del asegurado.",
      "Chat con IA disponible 24/7 para resolver las preguntas frecuentes.",
      "Analítica para entender cómo se usa la web.",
    ],
    shots: [
      { src: "/imagenes/correseguro/correseguro-portada.png", alt: "Portada de CorreSeguro: el seguro pensado por runners, para runners", width: 1904, height: 935, label: "correseguro.es" },
      { src: "/imagenes/correseguro/correseguro-contratacion.png", alt: "Formulario de contratación en 7 pasos, empezando por los datos personales del asegurado", width: 1328, height: 909, label: "/contratar" },
      { src: "/imagenes/correseguro/correseguro-chat.png", alt: "Asistente CorreSeguro con IA saludando y mostrando preguntas frecuentes", width: 495, height: 729, label: "chat IA" },
    ],
    link: { href: "https://correseguro.es", label: "correseguro.es" },
  },
  {
    id: "formador",
    number: "03",
    title: "El Formador",
    subtitle: "(Asistente Belsué)",
    status: { label: "En piloto", tone: "pilot" },
    color: "blue",
    featured: true,
    summary: "Un asistente interno que centraliza productos, compañías y cotizaciones, siempre citando sus fuentes.",
    tags: ["Next.js", "IA + RAG", "Vercel"],
    visual: <div className="project-visual formador-collage"><span className="cs-window fm-window-back"><span className="cs-bar"><i /><i /><i /><em>asistente belsué</em></span><Image src="/imagenes/formador/formador-portal.png" alt="Portal del Asistente Belsué con El Formador, Procedimientos internos y Administración" width={1908} height={763} sizes="(max-width: 760px) 65vw, 340px" /></span><span className="cs-window fm-window-front"><span className="cs-bar"><i /><i /><i /><em>/chat</em></span><Image src="/imagenes/formador/formador-chat.png" alt="Chat de El Formador respondiendo consultas con sus fuentes" width={1536} height={948} sizes="(max-width: 760px) 60vw, 300px" /></span><span className="cs-sticker fm-sticker">responde citando fuentes ✦</span></div>,
    problem: "La información sobre productos, compañías y cotizaciones estaba repartida en muchos sitios y encontrarla llevaba demasiado tiempo.",
    built: [
      "Portal interno con El Formador, Procedimientos internos y Administración.",
      "Asistente con IA + RAG que responde a partir de la documentación interna.",
      "Cada respuesta cita sus fuentes para poder comprobarla.",
      "Desplegado en Vercel y en fase piloto con el equipo.",
    ],
    shots: [
      { src: "/imagenes/formador/formador-portal.png", alt: "Portal del Asistente Belsué con El Formador, Procedimientos internos y Administración", width: 1908, height: 763, label: "asistente belsué" },
      { src: "/imagenes/formador/formador-chat.png", alt: "Chat de El Formador respondiendo consultas con sus fuentes", width: 1536, height: 948, label: "/chat" },
    ],
  },
  {
    id: "neurodate",
    number: "04",
    title: "Neurodate",
    status: { label: "Construido" },
    color: "pink",
    summary: "App de citas y conexiones para personas neurodivergentes y LGBTIQ+.",
    tags: ["React Native", "UX inclusiva"],
    visual: <div className="project-visual phone-visual neurodate-visual"><span className="neurodate-poster"><Image src="/imagenes/neurodate/neurodate-portada.png" alt="Portada de NeuroDate: Encuentra tu match mental" width={2000} height={2000} sizes="180px" /></span><span className="neurodate-screen"><Image src="/imagenes/neurodate/neurodate-app.jpg" alt="Pantalla de bienvenida de la app NeuroDate" width={739} height={1600} sizes="130px" /></span></div>,
    problem: "Las apps de citas no suelen estar pensadas para personas neurodivergentes ni para el colectivo LGBTIQ+.",
    built: [
      "App móvil desarrollada con React Native.",
      "Una experiencia de usuario inclusiva, clara y sin ruido.",
      "Conexiones por afinidad: «Encuentra tu match mental».",
    ],
    shots: [
      { src: "/imagenes/neurodate/neurodate-portada.png", alt: "Portada de NeuroDate: Encuentra tu match mental", width: 2000, height: 2000, label: "neurodate" },
      { src: "/imagenes/neurodate/neurodate-app.jpg", alt: "Pantalla de bienvenida de la app NeuroDate", width: 739, height: 1600, label: "bienvenida" },
    ],
  },
  {
    id: "homi",
    number: "05",
    title: "HOMI",
    status: { label: "En desarrollo" },
    color: "green",
    summary: "Organizar las tareas de casa en equipo, sin que todo dependa de una sola persona.",
    tags: ["React Native", "Producto"],
    visual: <div className="project-visual homi-visual"><span className="homi-phone"><Image src="/imagenes/homi/homi-movil.png" alt="Pantalla de inicio de HOMI con los botones Iniciar sesión y Crear cuenta" width={416} height={816} sizes="130px" /></span><span className="homi-screen hs-inicio"><Image src="/imagenes/homi/homi-inicio.jpg" alt="Inicio de HOMI con el hogar principal y los accesos rápidos" width={400} height={870} sizes="96px" /></span><span className="homi-screen hs-tareas"><Image src="/imagenes/homi/homi-tareas.jpg" alt="Lista de tareas de la semana en HOMI" width={400} height={870} sizes="96px" /></span><span className="homi-screen hs-hogares"><Image src="/imagenes/homi/homi-hogares.jpg" alt="Listado de hogares con el hogar principal marcado" width={400} height={870} sizes="96px" /></span><span className="cs-window homi-chat"><span className="cs-bar"><i /><i /><i /><em>/chat</em></span><Image src="/imagenes/homi/homi-chat.jpg" alt="Chat del hogar en HOMI" width={400} height={452} sizes="130px" /></span></div>,
    problem: "En muchas casas las tareas acaban recayendo siempre en la misma persona.",
    built: [
      "App móvil desarrollada con React Native.",
      "Varios hogares por cuenta, con uno marcado como principal.",
      "Lista de tareas de la semana para repartir el trabajo.",
      "Chat del hogar para coordinarse sin salir de la app.",
    ],
    shots: [
      { src: "/imagenes/homi/homi-inicio.jpg", alt: "Inicio de HOMI con el hogar principal y los accesos rápidos", width: 400, height: 870, label: "inicio" },
      { src: "/imagenes/homi/homi-tareas.jpg", alt: "Lista de tareas de la semana en HOMI", width: 400, height: 870, label: "tareas" },
      { src: "/imagenes/homi/homi-hogares.jpg", alt: "Listado de hogares con el hogar principal marcado", width: 400, height: 870, label: "hogares" },
      { src: "/imagenes/homi/homi-chat.jpg", alt: "Chat del hogar en HOMI", width: 400, height: 452, label: "/chat" },
    ],
  },
  {
    id: "spotifake",
    number: "06",
    title: "SpotiFake",
    status: { label: "Construido" },
    color: "yellow",
    summary: "Una plataforma musical para explorar el stack completo de un producto moderno.",
    tags: ["Next.js", "Supabase", "TypeScript"],
    visual: <div className="project-visual spotify-visual"><span>SPOTI</span><strong>FAKE</strong><i>PLAYLISTS FOR REAL LIFE</i><span className="cs-window sf-window"><span className="cs-bar"><i /><i /><i /><em>spotifake · inicio</em></span><Image src="/imagenes/spotifake/spotifake-inicio.jpg" alt="Inicio de SpotiFake con las portadas de los álbumes girando en círculos alrededor del logo" width={1400} height={727} sizes="(max-width: 760px) 60vw, 340px" /></span></div>,
    problem: "Quería practicar el stack completo de un producto moderno con algo que me apeteciera usar a diario.",
    built: [
      "Plataforma musical construida con Next.js y TypeScript.",
      "Backend y datos con Supabase.",
      "Un inicio con las portadas de los álbumes girando alrededor del logo.",
    ],
    shots: [
      { src: "/imagenes/spotifake/spotifake-inicio.jpg", alt: "Inicio de SpotiFake con las portadas de los álbumes girando en círculos alrededor del logo", width: 1400, height: 727, label: "spotifake · inicio" },
    ],
  },
];
