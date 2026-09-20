import { FormProvider } from "react-hook-form";
import { CardContent, CardFooter } from "../../../ui/Card";
import { Card } from "../../../ui/Card";
import { Button } from "../../../ui/Button";
import FormInput from "../../../herramientas/formateo-de-campos/form-input";
import {
  TipoAlertaConfirmacion,
  TituloAlertaConfirmacion,
  useConfirmation,
} from "../../../herramientas/alertas/alertas-confirmacion";
import { Package } from "lucide-react";
import EncabezadoFormularios from "../../../ui/encabezadoFormularios";
import { usePresentacionForm } from "../hooks/use-presentacion-form";
import { Presentacion } from "../../../../interfaces/gestion-producto/presentacion/interfaces-presentacion";
import Select from "react-select";

const NOMBRE_ENTIDAD = "Presentación";

const OPCIONES_TIPO = [
  { value: "volume", label: "Volumen" },
  { value: "pack", label: "Pack" },
];

export default function RegistrarActualizarPresentacionForm({
  presentacion,
  onClose,
  onSuccess,
}: {
  presentacion?: Presentacion;
  onClose: () => void;
  onSuccess: (mensajeAlerta: string) => void;
}) {
  // ===================== HOOK DEL FORM =====================
  const { methods, handleSubmit, onSubmit, isSubmitting, errors } =
    usePresentacionForm(presentacion, onClose, onSuccess);

  const isEdit = !!presentacion;
  const tipo = methods.watch("tipo");

  // ===================== CONFIRMACION DE CIERRE =====================
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
      <Card className="w-full max-w-2xl bg-white mx-auto shadow-lg rounded-2xl overflow-hidden transform transition-all duration-300 ease-in-out">
        <EncabezadoFormularios
          title={presentacion ? `Actualizar ${NOMBRE_ENTIDAD}` : NOMBRE_ENTIDAD}
          subtitle={presentacion ? "Sólo puede visualizarse." : "Ingresa los datos."}
          icon={<Package className="form-icon" />}
          onClose={handleOnClose}
        />

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-3 px-3 py-2">
              <div className="space-y-1 sm:space-y-2">
                <label className="label-base">Tipo</label>
                <Select
                  options={OPCIONES_TIPO}
                  value={OPCIONES_TIPO.find((o) => o.value === tipo) ?? null}
                  onChange={(opcion) =>
                    methods.setValue("tipo", opcion?.value ?? "pack")
                  }
                  isDisabled={presentacion?.sistema ? true : false}
                  placeholder="Selecciona el tipo"
                />
                {errors.tipo?.message && (
                  <small className="text-red-500">{String(errors.tipo.message)}</small>
                )}
              </div>

              <FormInput
                name="quantity"
                label="Cantidad por pack"
                type="number"
                placeholder="Solo para tipo Pack (opcional)"
                disabled={presentacion?.sistema ? true : false}
              />

              <FormInput
                name="volumen"
                label="Volumen"
                type="number"
                placeholder="Ej: 0.5 o 500 (opcional)"
                disabled={presentacion?.sistema ? true : false}
              />

              <FormInput
                name="unidad"
                label="Unidad"
                placeholder="Ej: l, ml, kg, g (opcional)"
                disabled={presentacion?.sistema ? true : false}
              />
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