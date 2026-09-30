"use client";

import { useState } from "react";

const CONTACT_EMAIL = "hola@ceci.dev";

const topics = [
  { id: "proyecto", label: "Un proyecto", color: "coral" },
  { id: "colaboracion", label: "Colaborar", color: "lilac" },
  { id: "empleo", label: "Oferta de trabajo", color: "mint" },
  { id: "cafe", label: "Solo un café", color: "yellow" },
];

export default function ContactForm() {
  const [topic, setTopic] = useState("proyecto");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const topicLabel = topics.find((item) => item.id === topic)?.label ?? "";
    const subject = `${topicLabel} · ${name}`;
    const body = `${message}\n\n— ${name} (${email})`;

    setStatus("sending");
    window.setTimeout(() => {
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setStatus("sent");
    }, 900);
  };

  const reset = () => {
    setStatus("idle");
    setMessage("");
    setTopic("proyecto");
  };

  return (
    <div className={`contact-form-window is-${status}`}>
      <span className="contact-tape" aria-hidden="true" />
      <div className="explorer-topbar"><div className="window-dots"><i /><i /><i /></div><span>ceci / nueva-idea.txt</span><span className="contact-form-status">{status === "sent" ? "enviado ✓" : "sin guardar ●"}</span></div>

      {status === "sent" ? (
        <div className="contact-sent" role="status">
          <span className="contact-sent-stamp">✦</span>
          <h3>¡Idea en el buzón!</h3>
          <p>Se ha abierto tu correo con el mensaje listo. Dale a enviar y te contesto pronto.</p>
          <button type="button" className="contact-again" onClick={reset}>escribir otra ↺</button>
        </div>
      ) : (
        <form className="contact-form" onSubmit={handleSubmit}>
          <fieldset className="contact-topics">
            <legend>¿De qué va?</legend>
            {topics.map((item) => (
              <label key={item.id} className={`topic-chip chip-${item.color}`}>
                <input type="radio" name="topic" value={item.id} checked={topic === item.id} onChange={() => setTopic(item.id)} />
                <span>{item.label}</span>
              </label>
            ))}
          </fieldset>

          <div className="contact-row">
            <label className="contact-field"><span>nombre</span><input name="name" type="text" required autoComplete="name" placeholder="¿Cómo te llamas?" /></label>
            <label className="contact-field"><span>email</span><input name="email" type="email" required autoComplete="email" placeholder="tu@correo.com" /></label>
          </div>

          <label className="contact-field contact-message">
            <span>mensaje <small>{message.length}/800</small></span>
            <textarea name="message" required maxLength={800} rows={5} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Cuéntame la idea, aunque todavía no tenga nombre…" />
          </label>

          <div className="contact-form-footer">
            <p>respondo en 24–48h <span aria-hidden="true">☕</span></p>
            <button type="submit" className="contact-submit" disabled={status === "sending"}>
              {status === "sending" ? "doblando el papel…" : "Enviar idea"} <span aria-hidden="true">✉</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
