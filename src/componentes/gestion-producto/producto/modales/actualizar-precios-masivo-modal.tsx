import React, { useState, useEffect } from "react";
import { TrendingUp, AlertTriangle, Layers, Globe, DollarSign, Percent, Loader2 } from "lucide-react";
import Select from "react-select";
import EncabezadoFormularios from "../../../ui/encabezadoFormularios";
import { Button } from "../../../ui/Button";
import { Input } from "../../../ui/Input";
import { Card, CardContent, CardFooter } from "../../../ui/Card";
import ProductoService from "../services/producto-service";
import LineaService from "../../linea/services/linea-service";
import { SelectLinea } from "../../../../interfaces/gestion-producto/linea/interfaces-linea";
import { TipoAumento, ActualizarPreciosMasivoDto } from "../../../../interfaces/gestion-producto/producto/interfaces-producto";
import { getUsuarioId } from "../../../../utils/auth";
import { parseApiError } from "../../../../utils/errores";
import {
  TipoAlertaConfirmacion,
  TituloAlertaConfirmacion,
  useConfirmation,
} from "../../../herramientas/alertas/alertas-confirmacion";

interface Props {
  onClose: () => void;
  onSuccess: (mensaje: string) => void;
  lineaPreseleccionadaId?: number | null;
}

export default function ActualizarPreciosMasivoModal({
  onClose,
  onSuccess,
  lineaPreseleccionadaId = null,
}: Props) {
  const usuarioId = getUsuarioId();
  const { showConfirmation, AlertasConfirmacion } = useConfirmation();

  // Estados del formulario
  const [esGlobal, setEsGlobal] = useState<boolean>(!lineaPreseleccionadaId);
  const [lineas, setLineas] = useState<SelectLinea[]>([]);
  const [lineaSeleccionada, setLineaSeleccionada] = useState<SelectLinea | null>(null);
  const [tipoAumento, setTipoAumento] = useState<number>(TipoAumento.PORCENTAJE);
  const [valor, setValor] = useState<string>("");

  // Estados de control
  const [cargandoLineas, setCargandoLineas] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorValidacion, setErrorValidacion] = useState<string | null>(null);
  const [errorApi, setErrorApi] = useState<string | null>(null);

  // Cargar líneas disponibles
  useEffect(() => {
    const fetchLineas = async () => {
      setCargandoLineas(true);
      try {
        const response = await LineaService.obtenerTotales({ denominacion: " " }, "lineas");
        const listaLineas = response?.data ?? [];
        setLineas(listaLineas);


        if (lineaPreseleccionadaId) {
          const pre = listaLineas.find((l: SelectLinea) => l.id === lineaPreseleccionadaId);
          if (pre) {
            setLineaSeleccionada(pre);
            setEsGlobal(false);
          }
        }
      } catch (err) {
        console.error("Error al cargar líneas para cambio de precios:", err);
      } finally {
        setCargandoLineas(false);
      }
    };
    fetchLineas();
  }, [lineaPreseleccionadaId]);

  const handleValidar = (): boolean => {
    setErrorValidacion(null);
    setErrorApi(null);

    const valorNum = parseFloat(valor);
    if (isNaN(valorNum) || valorNum <= 0) {
      setErrorValidacion("Debe ingresar un valor mayor a 0.");
      return false;
    }

    if (!esGlobal && !lineaSeleccionada) {
      setErrorValidacion("Debe seleccionar una línea o marcar la opción Global.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handleValidar()) return;

    const valorNum = parseFloat(valor);
    const alcanceTexto = esGlobal
      ? "TODOS los productos del catálogo"
      : `todos los productos de la línea "${lineaSeleccionada?.denominacion}"`;

    const aumentoTexto =
      tipoAumento === TipoAumento.PORCENTAJE
        ? `${valorNum}% de incremento`
        : `$${valorNum} de incremento fijo`;

    const confirmed = await showConfirmation({
      type: TipoAlertaConfirmacion.DESTRUCTIVE,
      title: TituloAlertaConfirmacion.DESTRUCTIVE,
      message: `¿Estás seguro de que deseas aplicar un aumento de ${aumentoTexto} a ${alcanceTexto}? Esta operación modificará los precios en la base de datos.`,
      confirmText: "Aplicar Aumento",
      cancelText: "Cancelar",
      onConfirm: () => {},
    });

    if (!confirmed) return;

    setIsSubmitting(true);
    setErrorApi(null);

    try {
      const payload: ActualizarPreciosMasivoDto = {
        tipoAumento,
        valor: valorNum,
        lineaId: esGlobal ? null : (lineaSeleccionada?.id ?? null),
        usuarioId,
      };

      const response = await ProductoService.actualizarPreciosMasivo(payload);
      onSuccess(response?.mensaje || "Actualización de precios realizada con éxito.");
      onClose();
    } catch (err) {
      const mensaje = parseApiError(err);
      setErrorApi(mensaje || "Ocurrió un error al actualizar los precios.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Card className="w-full max-w-lg bg-white dark:bg-slate-800 shadow-2xl rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
        <EncabezadoFormularios
          title="Actualización Masiva de Precios"
          subtitle="Aumento general o por línea"
          icon={<TrendingUp className="w-6 h-6 text-blue-500 mr-2" />}
          onClose={onClose}
        />

        <form onSubmit={handleSubmit}>
          <CardContent className="p-6 space-y-6">
            {/* Mensajes de error */}
            {errorApi && (
              <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
                {errorApi}
              </div>
            )}

            {errorValidacion && (
              <div className="p-3 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg text-amber-800 dark:text-amber-300 text-sm">
                {errorValidacion}
              </div>
            )}

            {/* Selector de Ámbito (Global vs Por Línea) */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 block">
                Alcance del Aumento
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setEsGlobal(true)}
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-sm font-medium transition-all ${
                    esGlobal
                      ? "bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-700 dark:text-blue-300 shadow-sm ring-1 ring-blue-500"
                      : "bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600"
                  }`}
                >
                  <Globe className="w-4 h-4 text-blue-500" />
                  <span>Global (Todos)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setEsGlobal(false)}
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-sm font-medium transition-all ${
                    !esGlobal
                      ? "bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-700 dark:text-blue-300 shadow-sm ring-1 ring-blue-500"
                      : "bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600"
                  }`}
                >
                  <Layers className="w-4 h-4 text-indigo-500" />
                  <span>Por Línea</span>
                </button>
              </div>
            </div>

            {/* Selector de Línea si no es global */}
            {!esGlobal && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 block">
                  Seleccionar Línea de Productos
                </label>
                <Select
                  value={lineaSeleccionada}
                  options={lineas}
                  getOptionLabel={(option) => option.denominacion}
                  getOptionValue={(option) => String(option.id)}
                  onChange={(option) => setLineaSeleccionada(option)}
                  placeholder={cargandoLineas ? "Cargando líneas..." : "Seleccione una línea"}
                  isLoading={cargandoLineas}
                  isClearable
                  className="text-black text-sm"
                  menuPortalTarget={document.body}
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    control: (base) => ({
                      ...base,
                      minHeight: "42px",
                      borderRadius: "0.5rem",
                    }),
                  }}
                />
              </div>
            )}

            {/* Selector de Tipo de Aumento */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 block">
                Tipo de Aumento
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTipoAumento(TipoAumento.PORCENTAJE)}
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-sm font-medium transition-all ${
                    tipoAumento === TipoAumento.PORCENTAJE
                      ? "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-500 text-emerald-700 dark:text-emerald-300 shadow-sm ring-1 ring-emerald-500"
                      : "bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600"
                  }`}
                >
                  <Percent className="w-4 h-4 text-emerald-500" />
                  <span>Porcentaje (%)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTipoAumento(TipoAumento.MONTO_FIJO)}
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-sm font-medium transition-all ${
                    tipoAumento === TipoAumento.MONTO_FIJO
                      ? "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-500 text-emerald-700 dark:text-emerald-300 shadow-sm ring-1 ring-emerald-500"
                      : "bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600"
                  }`}
                >
                  <DollarSign className="w-4 h-4 text-emerald-500" />
                  <span>Monto Fijo ($)</span>
                </button>
              </div>
            </div>

            {/* Input de Valor */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 block">
                {tipoAumento === TipoAumento.PORCENTAJE
                  ? "Porcentaje de Aumento (%)"
                  : "Monto Fijo a Aumentar ($)"}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  {tipoAumento === TipoAumento.PORCENTAJE ? (
                    <Percent className="w-4 h-4" />
                  ) : (
                    <DollarSign className="w-4 h-4" />
                  )}
                </div>
                <Input
                  type="number"
                  step="any"
                  min="0.01"
                  placeholder={
                    tipoAumento === TipoAumento.PORCENTAJE ? "Ej: 15.5" : "Ej: 500"
                  }
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  className="pl-10 h-11 text-base bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isSubmitting}
                  autoFocus
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {tipoAumento === TipoAumento.PORCENTAJE
                  ? "Ingrese el porcentaje que se sumará a los precios base de los productos."
                  : "Ingrese el monto fijo en pesos que se sumará a los precios base."}
              </p>
            </div>

            {/* Banner Informativo de Advertencia */}
            <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                <span className="font-semibold block mb-0.5">Operación Masiva:</span>
                Esta acción modificará de forma inmediata los precios de{" "}
                <strong>
                  {esGlobal
                    ? "todos los productos del sistema"
                    : lineaSeleccionada
                    ? `los productos de la línea "${lineaSeleccionada.denominacion}"`
                    : "los productos de la línea seleccionada"}
                </strong>
                .
              </div>
            </div>
          </CardContent>

          <CardFooter className="p-4 bg-gray-50 dark:bg-slate-800/80 border-t border-gray-200 dark:border-slate-700 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-slate-600 dark:text-gray-300 dark:hover:bg-slate-700"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center gap-2 px-5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Aplicando...</span>
                </>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4" />
                  <span>Aplicar Aumento</span>
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
      <AlertasConfirmacion />
    </>
  );
}
