export interface HistorialPrecio {
  id: number;
  productoId: number;
  denominacion: string;
  precioAnterior: number;
  precioNuevo: number;
  fecha: string;
  motivo: string | null;
}

export interface DtoConsultarHistorialPrecios {
  data: HistorialPrecio[];
  total: number;
}