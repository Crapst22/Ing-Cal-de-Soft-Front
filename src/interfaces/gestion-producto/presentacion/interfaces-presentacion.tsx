export type TipoPresentacion = "volume" | "pack";

export interface Presentacion {
  id: number;
  tipo: TipoPresentacion;
  quantity: number | null;
  volumen: number | null;
  unidad: string | null;
  denominacion: string;
  sistema: number;
  deletedAt: string | null;
}

export interface ConsultarPresentacion {
  id: number;
  denominacion: string;
}

export interface SelectPresentacion {
  id: number;
  denominacion: string;
}