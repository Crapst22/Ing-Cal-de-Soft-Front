import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CardContent, CardFooter } from "../../../ui/Card";
import { Button } from "../../../ui/Button";
import FormInput from "../../../herramientas/formateo-de-campos/form-input";
import React from "react";
import { Card } from "../../../ui/Card";
import { FormValues, schema, transformData } from "../interfaces/interfaces-validaciones-superlinea";
import SuperlineaService from "../services/superlinea-service";
import { Superlinea } from "../../../../interfaces/gestion-producto/superlinea/interfaces-superlinea";
import { SelectLinea } from "../../../../interfaces/gestion-producto/linea/interfaces-linea";

import { Boxes } from "lucide-react";
import { parseApiError } from "../../../../utils/errores";
import { ResponsePost } from "../../../../interfaces/generales/interfaces-generales";
import { getUsuarioId } from "../../../../utils/auth";
import EncabezadoFormularios from "../../../ui/encabezadoFormularios";
import {
  TipoAlertaConfirmacion,
  TituloAlertaConfirmacion,
  useConfirmation,
} from "../../../herramientas/alertas/alertas-confirmacion";
import LineasSelector from "../componentes/lineas-selector";

export default function RegistrarActualizarSuperlineaForm({
  superlinea,
  onClose,
  onSuccess,
}: {
  superlinea?: Superlinea;
  onClose: () => void;
  onSuccess: (mensajeAlerta: string) => void;
}) {
  const usuarioId = getUsuarioId();
  const { showConfirmation, AlertasConfirmacion } = useConfirmation();
  const [lineasSeleccionadas, setLineasSeleccionadas] = useState<SelectLinea[]>([]);

  const methods = useForm<FormValues>({
    resolver: yupResolver(schema) as any,
    defaultValues: superlinea ? transformData(superlinea) : {},
  });

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    setValue,
    setError,
  } = methods;

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        if (superlinea) {
          setValue("denominacion", superlinea.denominacion || "");
          setValue("observacion", superlinea.observacion || null);

          const lineas: SelectLinea[] = await SuperlineaService.obtenerLineas(superlinea.id);
          setLineasSeleccionadas(lineas ?? []);
          setValue("lineaIds", (lineas ?? []).map((linea) => linea.id));
        }
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };
    fetchDatos();
  }, []);

  const handleCambioLineas = (lineas: SelectLinea[]) => {
    setLineasSeleccionadas(lineas);
    setValue("lineaIds", lineas.map((linea) => linea.id));
  };

  const onSubmit = async (formData: FormValues) => {
    let response: ResponsePost;
    try {
      const payload = {
        denominacion: formData.denominacion,
        observacion: formData.observacion ?? null,
        lineaIds: lineasSeleccionadas.map((linea) => linea.id),
      };

      if (superlinea) {
        response = await SuperlineaService.actualizar(superlinea.id, {
          ...payload,
          usuarioUpdatedId: usuarioId,
        });
      } else {
        response = await SuperlineaService.nuevo({
          ...payload,
          usuarioCreatedId: usuarioId,
        });
      }
      onClose();
      onSuccess(response.mensaje);
    } catch (error) {
      setError("root", { type: "manual", message: parseApiError(error) });
    }
  };

  const handleOnClose = async () => {
    const confirmed = await showConfirmation({
      type: TipoAlertaConfirmacion.DEFAULT,
      title: TituloAlertaConfirmacion.DEFAULT,
      message: "¿Estás seguro de que quieres cerrar el formulario? NO se guardaran los cambios.",
      confirmText: "Aceptar",
      cancelText: "Cancelar",
      onConfirm: () => {},
    });
    if (confirmed) onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-y-auto py-5">
      <Card className="relative w-full max-w-4xl bg-white mx-auto shadow-lg rounded-lg overflow-hidden mt-10 mb-12">
        <EncabezadoFormularios
          title={superlinea ? "Actualizar Superlínea" : "Registrar Superlínea"}
          subtitle={
            superlinea
              ? "Modifica los detalles de la superlínea y sus líneas asociadas."
              : "Ingresa los datos de la nueva superlínea."
          }
          icon={<Boxes className="form-icon" />}
          onClose={handleOnClose}
        />

        <fieldset disabled={superlinea?.sistema === 1}>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 px-6 py-4">
                <FormInput name="denominacion" label="Denominación" placeholder="Ingresa la denominación" />

                <FormInput name="observacion" label="Observación" placeholder="Ingresa una observación (opcional)" />

                <div className="md:col-span-2">
                  <LineasSelector
                    lineasSeleccionadas={lineasSeleccionadas}
                    onChange={handleCambioLineas}
                    disabled={superlinea?.sistema === 1}
                  />
                </div>
              </CardContent>
              {errors.root?.message && (
                <div className="text-red-600 text-center mb-4">{String(errors.root.message)}</div>
              )}

              <CardFooter className="flex justify-center">
                <Button type="submit" disabled={isSubmitting} className="btn btn-dark">
                  {isSubmitting
                    ? superlinea
                      ? "Actualizando..."
                      : "Registrando..."
                    : superlinea
                      ? "Actualizar"
                      : "Registrar"}
                </Button>
              </CardFooter>
            </form>
          </FormProvider>
        </fieldset>
      </Card>

      <AlertasConfirmacion />
    </div>
  );
}