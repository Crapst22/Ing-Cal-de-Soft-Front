import { FormProvider } from "react-hook-form";
import { Card, CardContent, CardFooter } from "../../../ui/Card";
import { Button } from "../../../ui/Button";
import { Presentacion, TipoPresentacion } from "../../../../interfaces/gestion-producto/presentacion/interfaces-presentacion";
import {
  TipoAlertaConfirmacion,
  TituloAlertaConfirmacion,
  useConfirmation,
} from "../../../herramientas/alertas/alertas-confirmacion";
import { Package } from "lucide-react";
import EncabezadoFormularios from "../../../ui/encabezadoFormularios";
import { usePresentacionForm } from "../hooks/use-presentacion-form";
import { generarDenominacionPresentacion } from "../utils/presentacion-nombre";

const NOMBRE_ENTIDAD = "Presentación";

export default function RegistrarActualizarPresentacionForm({
  presentacion,
  onClose,
  onSuccess,
}: {
  presentacion?: Presentacion;
  onClose: () => void;
  onSuccess: (mensajeAlerta: string) => void;
}) {
  const { methods, handleSubmit, onSubmit, isSubmitting, errors } =
    usePresentacionForm(presentacion, onClose, onSuccess);

  const isEdit = !!presentacion;

  const { watch, setValue } = methods;

  const tipo = (watch("tipo") ?? "pack") as TipoPresentacion;
  const quantity = watch("quantity");
  const volumen = watch("volumen");
  const unidad = watch("unidad");

  const denominacionPreview = generarDenominacionPresentacion(
    tipo,
    quantity,
    volumen,
    unidad,
  );

  const { showConfirmation, AlertasConfirmacion } = useConfirmation();

  const handleOnClose = async () => {
    const confirmed = await showConfirmation({
      type: TipoAlertaConfirmacion.DEFAULT,
      title: TituloAlertaConfirmacion.DEFAULT,
      message:
        "¿Estás seguro de que quieres cerrar el formulario? NO se guardaran los cambios.",
      confirmText: "Aceptar",
      cancelText: "Cancelar",
      onConfirm: () => {},
    });

    if (confirmed) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <Card className="w-full max-w-xl bg-white mx-auto shadow-lg rounded-2xl overflow-hidden transform transition-all duration-300 ease-in-out">
        <EncabezadoFormularios
          title={presentacion ? `Actualizar ${NOMBRE_ENTIDAD}` : NOMBRE_ENTIDAD}
          subtitle={
            presentacion
              ? "Sólo puede visualizarse, no modificarse."
              : "Ingresa los datos."
          }
          icon={<Package className="form-icon" />}
          onClose={handleOnClose}
        />

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4 px-4 py-3">
              {/* Tipo */}
              <div className="space-y-1">
                <label className="label-base">Tipo</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={presentacion?.sistema ? true : false}
                    onClick={() =>
                      setValue("tipo", "volume", { shouldValidate: true })
                    }
                    className={`py-2 rounded-md text-sm font-medium border transition ${
                      tipo === "volume"
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-gray-100 text-gray-700 border-gray-300"
                    }`}
                  >
                    Volumen
                  </button>
                  <button
                    type="button"
                    disabled={presentacion?.sistema ? true : false}
                    onClick={() =>
                      setValue("tipo", "pack", { shouldValidate: true })
                    }
                    className={`py-2 rounded-md text-sm font-medium border transition ${
                      tipo === "pack"
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-gray-100 text-gray-700 border-gray-300"
                    }`}
                  >
                    Pack
                  </button>
                </div>
                {errors.tipo && (
                  <small className="text-red-500">
                    {errors.tipo.message as string}
                  </small>
                )}
              </div>

              {/* Cantidad (solo pack) */}
              {tipo === "pack" && (
                <div className="space-y-1">
                  <label className="label-base">Cantidad (opcional)</label>
                  <input
                    type="number"
                    min={1}
                    step={1}
                    placeholder="Ej: 6"
                    value={quantity ?? ""}
                    onChange={(e) => {
                      const v = e.target.value;
                      setValue("quantity", v === "" ? null : Number(v), {
                        shouldValidate: true,
                      });
                    }}
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-800 text-sm"
                  />
                  {errors.quantity && (
                    <small className="text-red-500">
                      {errors.quantity.message as string}
                    </small>
                  )}
                </div>
              )}

              {/* Volumen */}
              <div className="space-y-1">
                <label className="label-base">
                  Volumen {tipo === "volume" ? "" : "(opcional)"}
                </label>
                <input
                  type="number"
                  min={0}
                  step="any"
                  placeholder="Ej: 500"
                  value={volumen ?? ""}
                  onChange={(e) => {
                    const v = e.target.value;
                    setValue("volumen", v === "" ? null : Number(v), {
                      shouldValidate: true,
                    });
                  }}
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-800 text-sm"
                />
                {errors.volumen && (
                  <small className="text-red-500">
                    {errors.volumen.message as string}
                  </small>
                )}
              </div>

              {/* Unidad */}
              <div className="space-y-1">
                <label className="label-base">Unidad</label>
                <input
                  type="text"
                  placeholder="Ej: ml, l, kg"
                  value={unidad ?? ""}
                  onChange={(e) =>
                    setValue("unidad", e.target.value, { shouldValidate: true })
                  }
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-800 text-sm"
                />
                {errors.unidad && (
                  <small className="text-red-500">
                    {errors.unidad.message as string}
                  </small>
                )}
              </div>

              {/* Preview */}
              <div className="rounded-md bg-gray-50 border border-gray-200 px-3 py-2">
                <p className="text-xs text-gray-500">Vista previa</p>
                <p className="text-sm font-semibold text-gray-800">
                  {denominacionPreview}
                </p>
              </div>
            </CardContent>

            {errors.root?.message && (
              <div className="text-red-600 text-center mb-4">
                {String(errors.root.message)}
              </div>
            )}

            <CardFooter className="flex justify-center">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-dark"
              >
                {isSubmitting
                  ? isEdit
                    ? "Actualizando..."
                    : "Registrando..."
                  : isEdit
                  ? "Actualizar"
                  : "Registrar"}
              </Button>
            </CardFooter>
          </form>
        </FormProvider>
      </Card>

      <AlertasConfirmacion />
    </div>
  );
}