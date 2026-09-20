export interface Presentacion {
  id: number;
  tipo: "volume" | "pack";
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

export interface SelectEnvase {
  id: number;
  denominacion: string;
}

export interface SelectUnidad {
  id: number;
  denominacion: string;
}