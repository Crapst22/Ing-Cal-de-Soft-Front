import { History } from "lucide-react";
import { CardHeader, CardTitle } from "../../../../ui/Card";
import { EstadisticasSimples } from "../../../../herramientas/reutilizables/estadisticas-simples";

interface HeaderHistorialPreciosProps {
  entidadesTotales: number;
  datosLength: number;
}

export default function HeaderHistorialPrecios({
  entidadesTotales,
  datosLength,
}: HeaderHistorialPreciosProps) {
  return (
    <CardHeader className="flex flex-row items-center justify-between p-4 gap-4">
      <div className="flex items-center gap-6">
        <CardTitle className="flex items-center space-x-2">
          <History className="consultar-icon w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-base sm:text-xl font-semibold">
            Historial de Precios
          </span>
        </CardTitle>
        <EstadisticasSimples
          filtrados={entidadesTotales}
          mostrados={datosLength}
        />
      </div>
    </CardHeader>
  );
}