import { useCallback, useState } from "react";
import HistorialPreciosService from "../historial-precios-service";
import { HistorialPrecio } from "../../../../../interfaces/gestion-producto/historial-precios/interfaces-historial-precios";

export function useHistorialPrecios() {
  const [historial, setHistorial] = useState<HistorialPrecio[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistorial = useCallback(
    async (skip: number, take: number, productoId?: number) => {
      setLoading(true);
      setError(null);
      try {
        const response = await HistorialPreciosService.obtenerHistorial(
          skip,
          take,
          productoId,
        );
        setHistorial(response.data);
        setTotal(response.total);
      } catch {
        setError("No se pudieron cargar los historiales de precios.");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    historial,
    total,
    loading,
    error,
    fetchHistorial,
  };
}