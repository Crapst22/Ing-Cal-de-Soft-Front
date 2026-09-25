export type TipoCambioPrecio = "INDIVIDUAL" | "MASIVO";

export interface HistorialPrecio {
  id: number;
  productoId: number;
  producto: string;
  tipoCambio: TipoCambioPrecio;
  precioAnterior: number;
  precioNuevo: number;
  fecha: string;
  motivo: string;
}

export interface DtoConsultarHistorialPrecios {
  data: HistorialPrecio[];
  total: number;
}
