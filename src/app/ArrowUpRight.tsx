// "↗" es un carácter con variante emoji: en iOS/Android se pinta como emoji azul, así que usamos un SVG
// que hereda el tamaño (1em) y el color (currentColor) del texto que lo rodea.
export default function ArrowUpRight() {
  return (
    <svg className="icon-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="square" aria-hidden="true">
      <path d="M6 18 18 6M8 6h10v10" />
    </svg>
  );
}
