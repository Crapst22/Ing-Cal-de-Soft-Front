import { useRef, useState } from "react";
import { Package, PlusCircle, Search, TrendingUp } from "lucide-react";
import { Button } from "../../../ui/Button";
import { CardHeader, CardTitle } from "../../../ui/Card";
import { Input } from "../../../ui/Input";
import { EstadisticasSimples } from "../../../herramientas/reutilizables/estadisticas-simples";
import { ImpresionForm } from "../../../herramientas/reutilizables/impresion-form";
import { puedeAgregarProducto, puedeActualizarPreciosMasivo } from "../domain/permisos-producto";
import ProductoService from "../services/producto-service";
import { ConsultarProducto } from "../../../../interfaces/gestion-producto/producto/interfaces-producto";

interface Props {
  roles: number[];
  codigo: string;
  exacto: boolean;
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

export function ProductosHeader({
  roles,
  codigo,
  exacto,
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
  const [sugerencias, setSugerencias] = useState<ConsultarProducto[]>([]);
  const [abierto, setAbierto] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const manejarCambio = (value: string) => {
    onChangeCodigo(value);
    if (timer.current) clearTimeout(timer.current);
    if (!value.trim()) {
      setSugerencias([]);
      setAbierto(false);
      return;
    }
    timer.current = setTimeout(async () => {
      try {
        const res = await ProductoService.buscarPorTexto({
          texto: value,
          skip: 0,
          take: 8,
        });
        setSugerencias(res.data ?? []);
        setAbierto(true);
      } catch {
        setSugerencias([]);
        setAbierto(false);
      }
    }, 300);
  };

  const seleccionar = (producto: ConsultarProducto) => {
    onChangeCodigo(producto.codigoProveedor || producto.denominacion);
    setAbierto(false);
  };

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
              placeholder="Buscar..."
              className="text-black pl-10"
              onChange={(e) => manejarCambio(e.target.value)}
              onFocus={() => {
                if (sugerencias.length > 0) setAbierto(true);
              }}
              onBlur={() => {
                setTimeout(() => setAbierto(false), 150);
              }}
            // onKeyDown={(e) => e.key === "Enter" && onBuscarRapido()}
            />

            {abierto && sugerencias.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 max-h-60 overflow-auto z-50 bg-white border border-gray-300 rounded-md shadow-md">
                {sugerencias.map((producto) => (
                  <button
                    key={producto.id}
                    type="button"
                    className="w-full text-left px-3 py-2 text-sm text-black hover:bg-gray-100"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => seleccionar(producto)}
                  >
                    <span className="font-medium">{producto.codigoProveedor}</span>{" "}
                    <span className="text-gray-500">{producto.denominacion}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={exacto}
              onChange={(e) => onChangeExacto(e.target.checked)}
            />
            Exacto
          </label>
        </div>

        <EstadisticasSimples filtrados={total} mostrados={mostrados} />
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <ImpresionForm
          entityName="Productos"
          onImprimirTodo={onImprimirTodo}
          onImprimirPagina={onImprimirPagina}
          totalItems={total}
          currentPage={paginaActual}
        />
        {puedeActualizarPreciosMasivo(roles) && onCambioPreciosMasivo && (
          <Button
            onClick={onCambioPreciosMasivo}
            className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5"
            title="Ajuste masivo de precios por línea o global"
          >
            <TrendingUp className="h-4 w-4" />
            <span>Ajuste Masivo</span>
          </Button>
        )}
        {puedeAgregarProducto(roles) && (
          <Button onClick={onNuevo} className="bg-blue-500 hover:bg-blue-700 text-white">
            <PlusCircle className="mr-2 h-4 w-4" />
            Añadir
          </Button>
        )}
      </div>
    </CardHeader>
  );
}

