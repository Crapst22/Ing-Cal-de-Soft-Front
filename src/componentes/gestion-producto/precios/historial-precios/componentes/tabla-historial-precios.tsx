import { Column, TablaAGGrid } from "../../../../herramientas/tablas/tabla-flexible-ag-grid";
import { HistorialPrecio } from "../../../../../interfaces/gestion-producto/historial-precios/interfaces-historial-precios";

type Props = {
  historial: HistorialPrecio[];
  columns: Column<HistorialPrecio>[];
};

export default function TablaHistorialPrecios({ historial, columns }: Props) {
  return (
    <div className="overflow-x-auto">
      <TablaAGGrid
        columns={columns}
        data={historial}
        onUpdate={() => {}}
        actionsFlex={0}
        rowHeight={55}
      />
    </div>
  );
}