import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "../../../ui/Input";
import { Button } from "../../../ui/Button";
import LineaService from "../../linea/services/linea-service";
import { SelectLinea } from "../../../../interfaces/gestion-producto/linea/interfaces-linea";

interface LineasSelectorProps {
  lineasSeleccionadas: SelectLinea[];
  onChange: (lineas: SelectLinea[]) => void;
  disabled?: boolean;
}

export default function LineasSelector({
  lineasSeleccionadas,
  onChange,
  disabled = false,
}: LineasSelectorProps) {
  const [busqueda, setBusqueda] = useState("");
  const [candidatas, setCandidatas] = useState<SelectLinea[]>([]);
  const [cargando, setCargando] = useState(false);

  const obtenerLineas = async () => {
    setCargando(true);
    try {
      const resp = await LineaService.obtener({ denominacion: busqueda, skip: 0, take: 50 });
      setCandidatas(resp?.data ?? []);
    } catch (error) {
      console.error("Error al buscar líneas:", error);
      setCandidatas([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerLineas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const estaSeleccionada = (id: number) => lineasSeleccionadas.some((l) => l.id === id);

  const toggleLinea = (linea: SelectLinea) => {
    if (disabled) return;
    if (estaSeleccionada(linea.id)) {
      onChange(lineasSeleccionadas.filter((l) => l.id !== linea.id));
    } else {
      onChange([...lineasSeleccionadas, linea]);
    }
  };

  const quitarLinea = (id: number) => {
    if (disabled) return;
    onChange(lineasSeleccionadas.filter((l) => l.id !== id));
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 shadow-sm">
      <div className="flex items-end gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          <Input
            type="text"
            placeholder="Buscar línea..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && obtenerLineas()}
            className="pl-10 w-full bg-white border-gray-300"
            disabled={disabled}
          />
        </div>
        <Button
          type="button"
          className="bg-blue-500 hover:bg-blue-600 text-white shrink-0"
          onClick={obtenerLineas}
          disabled={disabled}
        >
          <Search className="h-4 w-4 mr-2" />
          Buscar
        </Button>
      </div>

      {lineasSeleccionadas.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {lineasSeleccionadas.map((linea) => (
            <span
              key={linea.id}
              className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-full px-3 py-1 text-sm"
            >
              {linea.denominacion}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => quitarLinea(linea.id)}
                  className="text-blue-400 hover:text-blue-600"
                  aria-label="Quitar línea"
                >
                  <X size={14} />
                </button>
              )}
            </span>
          ))}
        </div>
      )}

      <div className="mt-3 max-h-60 overflow-y-auto border border-gray-200 rounded-lg bg-white">
        {cargando ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500" />
          </div>
        ) : candidatas.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">No se encontraron líneas.</p>
        ) : (
          candidatas.map((linea) => (
            <label
              key={linea.id}
              className={`flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                disabled ? "opacity-60 cursor-default" : ""
              }`}
            >
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                checked={estaSeleccionada(linea.id)}
                onChange={() => toggleLinea(linea)}
                disabled={disabled}
              />
              <span className="text-sm text-gray-700">{linea.denominacion}</span>
            </label>
          ))
        )}
      </div>
    </div>
  );
}