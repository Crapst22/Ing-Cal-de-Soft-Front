import { useEffect, useMemo } from "react";
import { Card, CardContent } from "../../../../ui/Card";
import Paginacion from "../../../../herramientas/reutilizables/paginacion";
import { Column } from "../../../../herramientas/tablas/tabla-flexible-ag-grid";
import { formatFechaHora, formatPrice } from "../../../../herramientas/formateo-de-campos/fucion-formateo";
import { HistorialPrecio } from "../../../../../interfaces/gestion-producto/historial-precios/interfaces-historial-precios";
import { usePaginacion } from "../../../../../hooks/use-paginacion";
import { PAGINACION } from "../../../../../config/paginacion";
import { useHistorialPrecios } from "../hooks/useHistorialPrecios";
import TablaHistorialPrecios from "../componentes/tabla-historial-precios";
import HeaderHistorialPrecios from "../componentes/header-historial-precios";

export default function ConsultarHistorialPrecios() {
  const { paginaActual, skip, take, handlePageChange } = usePaginacion(
    PAGINACION.TAKE_DEFAULT
  );

  const { historial, total, loading, error, fetchHistorial } =
    useHistorialPrecios();

  useEffect(() => {
    fetchHistorial(skip, take);
  }, [skip, take, fetchHistorial]);

  const columns = useMemo<Column<HistorialPrecio>[]>(
    () => [
      {
        header: "Producto",
        accessor: "denominacion",
        flex: 1.5,
        type: "text",
        editable: false,
        scrollable: false,
      },
      {
        header: "Precio anterior",
        accessor: "precioAnterior",
        flex: 0.5,
        type: "text",
        editable: false,
        align: "right",
        formatFunction: ({ value }) => (
          <span>{formatPrice(value, "ARS")}</span>
        ),
      },
      {
        header: "Precio nuevo",
        accessor: "precioNuevo",
        flex: 0.5,
        type: "text",
        editable: false,
        align: "right",
        formatFunction: ({ value }) => (
          <span>{formatPrice(value, "ARS")}</span>
        ),
      },
      {
        header: "Fecha del cambio",
        accessor: "fecha",
        flex: 0.6,
        type: "text",
        editable: false,
        formatFunction: ({ value }) => (
          <span>{formatFechaHora(value)}</span>
        ),
      },
      {
        header: "Motivo",
        accessor: "motivo",
        flex: 1,
        type: "text",
        editable: false,
        formatFunction: ({ value }) => <span>{value ? value : "-"}</span>,
      },
    ],
    []
  );

  return (
    <div className="w-full">
      <div className="p-6">
        <Card className="border-gray-200 dark:border-slate-700">
          <HeaderHistorialPrecios
            entidadesTotales={total}
            datosLength={historial.length}
          />
          <CardContent className="p-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Cargando historial de precios...
                </p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md">
                  <p className="text-red-600 dark:text-red-400 text-center font-medium">
                    {error}
                  </p>
                </div>
              </div>
            ) : (
              <TablaHistorialPrecios historial={historial} columns={columns} />
            )}
          </CardContent>
        </Card>

        <div className="mt-6">
          <Paginacion
            entidadesTotales={total}
            take={take}
            paginaActual={paginaActual}
            onChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}