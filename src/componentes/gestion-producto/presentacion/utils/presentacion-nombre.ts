import { TipoPresentacion } from "../../../../interfaces/gestion-producto/presentacion/interfaces-presentacion";

export function formatearVolumen(volumen: number | null | undefined): string {
  if (volumen == null) return "";
  return String(parseFloat(Number(volumen).toString()));
}

export function formatearUnidad(unidad: string | null | undefined): string {
  return unidad ? unidad.trim() : "";
}

export function generarDenominacionPresentacion(
  tipo: TipoPresentacion,
  quantity?: number | null,
  volumen?: number | null,
  unidad?: string | null,
): string {
  const vol = formatearVolumen(volumen);
  const uni = formatearUnidad(unidad);
  const volumenTexto = vol && uni ? `${vol}${uni}` : "";

  if (tipo === "volume") {
    return volumenTexto || "Volumen";
  }

  const qty = quantity && quantity > 0 ? `x${quantity}` : "";

  if (!qty && !volumenTexto) return "Pack";
  if (qty && !volumenTexto) return `Pack ${qty}`;
  if (!qty && volumenTexto) return `Pack de ${volumenTexto}`;
  return `Pack ${qty} de ${volumenTexto}`;
}