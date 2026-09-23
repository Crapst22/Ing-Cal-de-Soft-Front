import { Info, Pencil, Trash } from "lucide-react";
import { TablaAGGrid, type Column } from "../../../herramientas/tablas/tabla-flexible-ag-grid";
import {
  denominacionNotScrollColumnProps,
  observacionesColumnProps,
} from "../../../herramientas/tablas/formateo-columnas-documentos";
import type { Presentacion } from "../../../../interfaces/gestion-producto/presentacion/interfaces-presentacion";
import { ActionButton } from "../../../herramientas/reutilizables/action-button";
import { formatFechaHora } from "../../../herramientas/formateo-de-campos/fucion-formateo";
import { formatearUnidad, formatearVolumen } from "../utils/presentacion-nombre";

interface Props {
  presentaciones: Presentacion[];
  onEditar: (id: number) => void;
  onInfo: (id: number) => void;
  onDelete: (id: number) => void;
}

function detalle(presentacion: Presentacion): string {
  const vol = formatearVolumen(presentacion.volumen);
  const uni = formatearUnidad(presentacion.unidad);
  const volumenTexto = vol && uni ? `${vol}${uni}` : "-";

  if (presentacion.tipo === "volume") return volumenTexto;

  const qty = presentacion.quantity && presentacion.quantity > 0 ? `x${presentacion.quantity}` : "";
  if (!qty && volumenTexto === "-") return "-";
  if (qty && volumenTexto === "-") return qty;
  if (!qty && volumenTexto !== "-") return `de ${volumenTexto}`;
  return `${qty} de ${volumenTexto}`;
}

export function DatosTabla({ presentaciones, onEditar, onInfo, onDelete }: Props) {
  const columns: Column<Presentacion>[] = [
    {
      header: "Denominación",
      accessor: "denominacion",
      ...denominacionNotScrollColumnProps,
      formatFunction: ({ value, row }) => (
        <div className="flex flex-col">
          <span>{value}</span>
          {row.deletedAt && (
            <span className="text-xs text-red-500 font-medium">
              Eliminada el {formatFechaHora(row.deletedAt)}
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Tipo",
      accessor: "tipo",
      ...observacionesColumnProps,
      formatFunction: ({ value }) => (
        <span>{value === "volume" ? "Volumen" : "Pack"}</span>
      ),
    },
    {
      header: "Detalle",
      accessor: "volumen",
      ...observacionesColumnProps,
      formatFunction: ({ row }) => <span>{detalle(row)}</span>,
    },
  ];

  return (
    <TablaAGGrid
      columns={columns}
      data={presentaciones}
      getRowClass={(params: any) =>
        params.data?.deletedAt ? "opacity-50 bg-gray-100 dark:bg-slate-800 pointer-events-none" : ""
      }
      actions={(row: Presentacion) => {
        if (row.deletedAt) return <div className="w-full" />;

        return (
          <div className="flex justify-end gap-1">
            <ActionButton variant="info" title="Ver información" onClick={() => onInfo(row.id)}>
              <Info size={16} />
            </ActionButton>
            <ActionButton variant="edit" title="Editar" onClick={() => onEditar(row.id)}>
              <Pencil size={16} />
            </ActionButton>
            <ActionButton
              variant="delete"
              title="Eliminar"
              disabled={!!row.sistema}
              onClick={() => onDelete(row.id)}
            >
              <Trash size={16} />
            </ActionButton>
          </div>
        );
      }}
      actionsFlex={0.5}
      rowHeight={60}
    />
  );
}