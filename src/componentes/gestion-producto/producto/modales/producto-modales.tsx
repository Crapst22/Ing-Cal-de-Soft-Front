import { Producto } from "../../../../interfaces/gestion-producto/producto/interfaces-producto";
import InformacionAuditoria from "../../../herramientas/reutilizables/informacion-auditoria";
import RegistrarActualizarProductoForm from "../utils/registrar-actualizar-producto";
import ActualizarPreciosMasivoModal from "./actualizar-precios-masivo-modal";
import CambioPrecioModal from "./cambio-precio-modal";

interface Props {
  isAltaOpen: boolean;
  mostrarActualizarProducto: boolean;
  mostrarInfoAuditoria: boolean;
  mostrarMovimientosStock: boolean;
  mostrarHistorialPrecios: boolean;
  mostrarCambioPrecios: boolean;
  mostrarProductosAlternativos: boolean;
  mostrarDeQuienEsAlternativo: boolean;
  productoSeleccionado: Producto | null;
  productoInfo: any;
  auditoria: any;
  onCloseAlta: () => void;
  onCloseActualizar: () => void;
  onCloseAuditoria: () => void;
  onCloseMovimientosStock: () => void;
  onCloseHistorialPrecios: () => void;
  onCloseCambioPrecios: () => void;
  onCloseProductosAlternativos: () => void;
  onCloseDeQuienEsAlternativo: () => void;
  onSuccessAlta: (mensaje: string, producto?: Producto) => void;
  onSuccessActualizar: (mensaje: string) => void;
  onSuccessCambioPrecios: (mensaje: string) => void;
  onRefetch: () => void;
}

export function ProductosModales({
  isAltaOpen,
  mostrarActualizarProducto,
  mostrarInfoAuditoria,
  mostrarMovimientosStock,
  mostrarHistorialPrecios,
  mostrarCambioPrecios,
  mostrarProductosAlternativos,
  mostrarDeQuienEsAlternativo,
  productoSeleccionado,
  productoInfo,
  auditoria,
  onCloseAlta,
  onCloseActualizar,
  onCloseAuditoria,
  onCloseMovimientosStock,
  onCloseHistorialPrecios,
  onCloseCambioPrecios,
  onCloseProductosAlternativos,
  onCloseDeQuienEsAlternativo,
  onSuccessAlta,
  onSuccessActualizar,
  onSuccessCambioPrecios,
  onRefetch,
}: Props) {
  return (
    <>
      {isAltaOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <RegistrarActualizarProductoForm
            onClose={onCloseAlta}
            onSuccess={onSuccessAlta}
          />
        </div>
      )}

      {mostrarActualizarProducto && productoSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <RegistrarActualizarProductoForm
            producto={productoSeleccionado}
            onClose={onCloseActualizar}
            onSuccess={onSuccessActualizar}
          />
        </div>
      )}

      {mostrarInfoAuditoria && auditoria && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <InformacionAuditoria auditoria={auditoria} onClose={onCloseAuditoria} />
        </div>
      )}

{mostrarCambioPrecios && productoInfo?.id && (
        <CambioPrecioModal
          producto={productoInfo as Producto}
          onClose={onCloseCambioPrecios}
          onSuccess={onSuccessCambioPrecios}
        />
      )}

      {mostrarCambioPrecios && !productoInfo?.id && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <ActualizarPreciosMasivoModal
            onClose={onCloseCambioPrecios}
            onSuccess={(mensaje) => {
              onSuccessCambioPrecios(mensaje);
              onRefetch();
            }}
          />
        </div>
      )}
    </>
  );
}

