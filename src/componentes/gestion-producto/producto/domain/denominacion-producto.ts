export interface DenominacionPart {
  denominacion?: string | null;
}

export function componerDenominacion(
  marca?: DenominacionPart | null,
  linea?: DenominacionPart | null,
  presentacion?: DenominacionPart | null
): string {
  const partes = [
    marca?.denominacion,
    linea?.denominacion,
    presentacion?.denominacion,
  ];

  return partes
    .filter(Boolean)
    .join(" ")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}