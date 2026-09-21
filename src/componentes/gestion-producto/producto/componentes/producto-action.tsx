import { Bell, History, Info, Layers, Pencil, Tag, Trash } from "lucide-react";
import type { ConsultarProducto } from "../../../../interfaces/gestion-producto/producto/interfaces-producto";
import { ActionButton } from "../../../herramientas/reutilizables/action-button";

interface Props {
  producto: ConsultarProducto;
  onEditar: (id: number) => void;
  onInfo: (id: number) => void;
  onDelete: (id: number) => void;
  compact?: boolean;
}

export function ProductoActions({
  producto,
  onEditar,
  onInfo,
  onDelete,
  compact = false,
}: Props) {
  return (
    <div className={`flex items-center gap-1 ${compact ? "justify-end" : ""}`}>
      <ActionButton
        variant="info"
        title="Ver información"
        onClick={() => onInfo(producto.id)}
      >
        <Info className="h-4 w-4" />
      </ActionButton>

      <ActionButton
        variant="primary"
        title="Editar producto"
        onClick={() => onEditar(producto.id)}
      >
        <Pencil className="h-4 w-4" />
      </ActionButton>

      <ActionButton
        variant="danger"
        title="Eliminar producto"
        onClick={() => onDelete(producto.id)}
      >
        <Trash className="h-4 w-4" />
      </ActionButton>

      <ActionButton
        variant="secondary"
        title="Etiquetas"
        onClick={() => onInfo(producto.id)}
      >
        <Tag className="h-4 w-4" />
      </ActionButton>

      <ActionButton
        variant="secondary"
        title="Capas"
        onClick={() => onInfo(producto.id)}
      >
        <Layers className="h-4 w-4" />
      </ActionButton>

      <ActionButton
        variant="secondary"
        title="Historial"
        onClick={() => onInfo(producto.id)}
      >
        <History className="h-4 w-4" />
      </ActionButton>

      <ActionButton
        variant="secondary"
        title="Notificaciones"
        onClick={() => onInfo(producto.id)}
      >
        <Bell className="h-4 w-4" />
      </ActionButton>
    </div>
  );
}

