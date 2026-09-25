import { useEffect, useState } from "react";
import ProductoService from "../producto/services/producto-service";
import { HistorialPrecio } from "../../../interfaces/gestion-producto/historial-precios/interfaces-historial-precios";

const PAGE_SIZE = 50;

export default function HistorialPreciosPage() {
  const [rows, setRows] = useState<HistorialPrecio[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let activo = true;
    setLoading(true);
    ProductoService.obtenerHistorialPrecios({ skip: page * PAGE_SIZE, take: PAGE_SIZE })
      .then((result) => {
        if (!activo) return;
        setRows(result.data ?? []);
        setTotal(result.total ?? 0);
        setError("");
      })
      .catch(() => {
        if (activo) setError("No se pudo cargar el historial de precios.");
      })
      .finally(() => {
        if (activo) setLoading(false);
      });
    return () => { activo = false; };
  }, [page]);

  return (
    <main className="p-4 md:p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Historial de Precios</h1>
      {error && <p role="alert" className="text-red-600">{error}</p>}
      <div className="overflow-x-auto rounded-lg border bg-white dark:bg-slate-900">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-left dark:bg-slate-800">
            <tr>
              <th className="p-3">Producto</th><th className="p-3">Tipo de cambio</th>
              <th className="p-3">Precio anterior</th><th className="p-3">Precio nuevo</th>
              <th className="p-3">Fecha</th><th className="p-3">Motivo</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td className="p-4" colSpan={6}>Cargando...</td></tr> : rows.length ? rows.map((row) => (
              <tr key={row.id} className="border-t">
                <td className="p-3">{row.producto}</td>
                <td className="p-3">{row.tipoCambio === "MASIVO" ? "Masivo" : "Individual"}</td>
                <td className="p-3">{Number(row.precioAnterior).toLocaleString("es-AR", { style: "currency", currency: "ARS" })}</td>
                <td className="p-3">{Number(row.precioNuevo).toLocaleString("es-AR", { style: "currency", currency: "ARS" })}</td>
                <td className="p-3">{new Date(row.fecha).toLocaleString("es-AR")}</td>
                <td className="p-3">{row.motivo}</td>
              </tr>
            )) : <tr><td className="p-4" colSpan={6}>No hay cambios de precio registrados.</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between">
        <span>{total} cambios</span>
        <div className="flex gap-2">
          <button className="rounded border px-3 py-1 disabled:opacity-50" disabled={page === 0 || loading} onClick={() => setPage((value) => value - 1)}>Anterior</button>
          <button className="rounded border px-3 py-1 disabled:opacity-50" disabled={(page + 1) * PAGE_SIZE >= total || loading} onClick={() => setPage((value) => value + 1)}>Siguiente</button>
        </div>
      </div>
    </main>
  );
}
