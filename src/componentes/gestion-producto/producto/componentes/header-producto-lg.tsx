import { Package, PlusCircle, Search, TrendingUp } from "lucide-react";
import { Button } from "../../../ui/Button";
import { CardHeader, CardTitle } from "../../../ui/Card";
import { Input } from "../../../ui/Input";
import { EstadisticasSimples } from "../../../herramientas/reutilizables/estadisticas-simples";
import { ImpresionForm } from "../../../herramientas/reutilizables/impresion-form";
import { puedeAgregarProducto, puedeActualizarPreciosMasivo } from "../domain/permisos-producto";

interface Props {
  codigo: string;
  exacto: boolean;
  roles: number[];
  onChangeCodigo: (value: string) => void;
  onChangeExacto: (value: boolean) => void;
  onBuscarRapido: () => void;
  onNuevo: () => void;
  onCambioPreciosMasivo?: () => void;
  total: number;
  mostrados: number;
  paginaActual: number;
  onImprimirTodo: () => void;
  onImprimirPagina: () => void;
}

export function ProductosHeaderLg({
  codigo,
  exacto,
  roles,
  onChangeCodigo,
  onChangeExacto,
  onBuscarRapido,
  onNuevo,
  onCambioPreciosMasivo,
  total,
  mostrados,
  paginaActual,
  onImprimirTodo,
  onImprimirPagina,
}: Props) {
  return (
    <CardHeader className="flex flex-col md:flex-row gap-4 p-4">
      <div className="flex flex-col md:flex-row flex-wrap gap-4 w-full">
        <CardTitle className="flex items-center gap-2">
          <Package className="consultar-icon" />
          <span>Productos</span>
        </CardTitle>

        {/* Buscador rápido */}
        <div className="flex items-center gap-2">
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={codigo}
              placeholder="Código..."
              className="text-black pl-10"
              onChange={(e) => onChangeCodigo(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onBuscarRapido()}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={exacto}
              onChange={(e) => onChangeExacto(e.target.checked)}
            />
            Exacto
          </label>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {puedeActualizarPreciosMasivo(roles) && onCambioPreciosMasivo && (
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 px-3 py-2 rounded-lg shadow-sm"
            onClick={onCambioPreciosMasivo}
            title="Ajuste masivo de precios por línea o global"
          >
            <TrendingUp className="h-4 w-4" />
          </Button>
        )}
        {puedeAgregarProducto(roles) && (
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-1.5 px-3 py-2 rounded-lg shadow-sm"
            onClick={onNuevo}
          >
            <PlusCircle className="h-4 w-4" />
          </Button>
        )}
      </div>
    </CardHeader>
  );
}

