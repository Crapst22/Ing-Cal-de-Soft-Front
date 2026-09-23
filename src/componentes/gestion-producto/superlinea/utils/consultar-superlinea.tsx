import { useEffect, useState } from "react";
import SuperlineaService from "../services/superlinea-service";
import type { Superlinea } from "../../../../interfaces/gestion-producto/superlinea/interfaces-superlinea";
import Paginacion from "../../../herramientas/reutilizables/paginacion";
import { Card, CardContent, CardHeader } from "../../../ui/Card";
import { useFiltrosContext } from "../../../../context/filtros-contesxt";
import { Alertas, TipoAlerta, TituloAlerta, useAlerts } from "../../../herramientas/alertas/alertas";
import {
  TipoAlertaConfirmacion,
  TituloAlertaConfirmacion,
  useConfirmation,
} from "../../../herramientas/alertas/alertas-confirmacion";
import { Auditoria, ResponsePost } from "../../../../interfaces/generales/interfaces-generales";
import { useSuperlineaModal } from "../hooks/use-superlinea-modal";
import { SuperlineaModal } from "../modales/superlinea-modal";
import { DatosTabla } from "../componentes/datos-tabla";
import { DatosCards } from "../componentes/datos-card";
import { Header } from "../componentes/header";
import { HeaderLg } from "../componentes/header-lg";
import { FiltrosSuperlinea, FiltrosSuperlineaValues } from "../componentes/filtros-superlinea";
import { getUsuarioId } from "../../../../utils/auth";
import { parseApiError } from "../../../../utils/errores";

const NOMBRE_COMPONENTE = "consultar-superlinea";

export default function ConsultarSuperlineas() {
  // ===========================
  // ESTADOS PRINCIPALES
  // ===========================
  const [superlineas, setSuperlineas] = useState<Superlinea[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { alerts, addAlert, removeAlert } = useAlerts();
  const { showConfirmation, AlertasConfirmacion } = useConfirmation();

  const modal = useSuperlineaModal();
  const usuarioId = getUsuarioId();

  // ===========================
  // FILTROS LOCALES
  // ===========================
  const [filtrosSuperlinea, setFiltrosSuperlinea] = useState<FiltrosSuperlineaValues>({
    denominacion: "",
  });

  // ===========================
  // PAGINACIÓN
  // ===========================
  const [paginaActual, setPaginaActual] = useState(1);
  const [entidadesTotales, setEntidadesTotales] = useState(0);
  const [skip, setSkip] = useState(0);
  const [take, setTake] = useState(10);

  // ===========================
  // FILTROS CONTEXTO
  // ===========================
  const [filtrosInicializados, setFiltrosInicializados] = useState(false);
  const { setFiltrosNecesarios, limpiarFiltros, buscar, setBuscar } = useFiltrosContext();

  useEffect(() => {
    limpiarFiltros();
    setBuscar({ cont: 0, componente: NOMBRE_COMPONENTE });
    setFiltrosNecesarios({ denominacion: true });
    setFiltrosInicializados(true);
  }, []);

  useEffect(() => {
    if (buscar.cont > 0 && buscar.componente === NOMBRE_COMPONENTE) {
      handleBuscarSuperlineas(true);
    }
  }, [buscar]);

  // ===========================
  // CRUD / ACCIONES
  // ===========================
  const handleAltaSuperlinea = () => {
    modal.abrirAlta();
  };

  const handleAbrirEdicion = async (id: number) => {
    const superlinea = await SuperlineaService.obtenerId(id);
    modal.abrirEdicion(superlinea);
  };

  const handleMostrarInfo = async (id: number) => {
    const auditoria = await SuperlineaService.obtenerAuditoria(id);
    modal.abrirAuditoria(auditoria);
  };

  const handleDelete = async (id: number) => {
    const confirmed = await showConfirmation({
      type: TipoAlertaConfirmacion.DESTRUCTIVE,
      title: TituloAlertaConfirmacion.DESTRUCTIVE,
      message: "¿Estás seguro de que quieres eliminar este elemento? Esta acción no se puede deshacer.",
      confirmText: "Eliminar",
      cancelText: "Cancelar",
      onConfirm: () => {},
    });

    if (!confirmed) return;

    try {
      const response: ResponsePost = await SuperlineaService.eliminar(id, usuarioId);
      setSuperlineas((prev) => prev.filter((s) => s.id !== id));

      addAlert({
        type: TipoAlerta.SUCCESS,
        title: TituloAlerta.SUCCESS,
        message: response.mensaje,
        autoClose: true,
      });
    } catch {
      addAlert({
        type: TipoAlerta.ERROR,
        title: TituloAlerta.ERROR,
        message: "No se puede eliminar este elemento porque tiene una o más líneas asociadas.",
        autoClose: true,
      });
    }
  };

  // ===========================
  // BÚSQUEDA
  // ===========================
  const handleBuscarSuperlineas = async (botonBuscar?: boolean) => {
    if (botonBuscar) {
      setSkip(0);
      setPaginaActual(1);
    }

    setLoading(true);

    const filtrosConPaginacion = {
      denominacion: filtrosSuperlinea.denominacion,
      ...(filtrosSuperlinea.incluirEliminados ? { incluirEliminados: true } : {}),
      skip,
      take,
    };

    try {
      const response = await SuperlineaService.obtener(filtrosConPaginacion);
      setSuperlineas(response.data);
      setEntidadesTotales(response.total);
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleBuscarDesdeFiltro = (filtros: FiltrosSuperlineaValues) => {
    setFiltrosSuperlinea(filtros);
  };

  useEffect(() => {
    if (filtrosInicializados) {
      handleBuscarSuperlineas();
    }
  }, [paginaActual, filtrosInicializados]);

  useEffect(() => {
    if (filtrosInicializados) {
      handleBuscarSuperlineas(true);
    }
  }, [filtrosSuperlinea]);

  const handleImprimirTodo = async () => {
    try {
      const pdfBlob = await SuperlineaService.imprimirTodo();
      const fileURL = URL.createObjectURL(new Blob([pdfBlob], { type: "application/pdf" }));
      window.open(fileURL, "_blank");
    } catch (err) {
      addAlert({
        type: TipoAlerta.ERROR,
        title: TituloAlerta.ERROR,
        message: parseApiError(err),
        autoClose: true,
      });
    }
  };

  const handleImprimirPagina = async () => {
    try {
      const pdfBlob = await SuperlineaService.imprimirPagina();
      const fileURL = URL.createObjectURL(new Blob([pdfBlob], { type: "application/pdf" }));
      window.open(fileURL, "_blank");
    } catch (err) {
      addAlert({
        type: TipoAlerta.ERROR,
        title: TituloAlerta.ERROR,
        message: parseApiError(err),
        autoClose: true,
      });
    }
  };

  const handlePageChange = (skip: number, take: number, paginaActual: number) => {
    setSkip(skip);
    setTake(take);
    setPaginaActual(paginaActual);
  };

  // ===========================
  // SUCCESS MODAL
  // ===========================
  const handleSuccess = async (mensajeAlerta: string) => {
    modal.cerrar();

    addAlert({
      type: TipoAlerta.SUCCESS,
      title: TituloAlerta.SUCCESS,
      message: mensajeAlerta,
      autoClose: true,
    });

    await handleBuscarSuperlineas();
  };

  // ===========================
  // RENDER
  // ===========================
  if (error) {
    return (
      <div className="w-full p-6">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full p-6">
      <>
        <Card>
          <CardHeader className="flex justify-between">
            <div className="hidden lg:block">
              <Header
                entidadesTotales={entidadesTotales}
                datosLength={superlineas.length}
                paginaActual={paginaActual}
                openModal={handleAltaSuperlinea}
                handleImprimirTodo={handleImprimirTodo}
                handleImprimirPagina={handleImprimirPagina}
              />
            </div>

            <div className="lg:hidden">
              <HeaderLg
                entidadesTotales={entidadesTotales}
                datosLength={superlineas.length}
                paginaActual={paginaActual}
                openModal={handleAltaSuperlinea}
                handleImprimirTodo={handleImprimirTodo}
                handleImprimirPagina={handleImprimirPagina}
              />
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <FiltrosSuperlinea onBuscar={handleBuscarDesdeFiltro} mostrarIncluirEliminados />

            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4" />
                <p className="text-gray-600 text-lg">Cargando superlíneas...</p>
              </div>
            ) : (
              <>
                {/* Desktop */}
                <div className="hidden lg:block">
                  <DatosTabla
                    superlineas={superlineas}
                    onEditar={handleAbrirEdicion}
                    onInfo={handleMostrarInfo}
                    onDelete={handleDelete}
                  />
                </div>

                {/* Mobile */}
                <div className="lg:hidden space-y-4">
                  {superlineas.map((superlinea) => (
                    <DatosCards
                      key={superlinea.id}
                      superlinea={superlinea}
                      onEditar={handleAbrirEdicion}
                      onInfo={handleMostrarInfo}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <div className="mt-6">
          <Paginacion
            entidadesTotales={entidadesTotales}
            take={take}
            paginaActual={paginaActual}
            onChange={handlePageChange}
          />
        </div>

        <Alertas alerts={alerts} onRemove={removeAlert} />
        <AlertasConfirmacion />
      </>

      {/* MODAL ÚNICO */}
      <SuperlineaModal
        open={modal.tipo !== null}
        tipo={modal.tipo}
        superlinea={modal.superlinea}
        auditoria={modal.auditoria as Auditoria | null}
        onClose={modal.cerrar}
        onSuccess={handleSuccess}
      />
    </div>
  );
}