import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import PresentacionService from "../services/presentacion-service";
import {
  FormValues,
  schema,
  transformData,
} from "../interfaces/interfaces-validaciones-presentacion";
import { Presentacion } from "../../../../interfaces/gestion-producto/presentacion/interfaces-presentacion";
import { parseApiError } from "../../../../utils/errores";
import { ResponsePost } from "../../../../interfaces/generales/interfaces-generales";
import { getUsuarioId } from "../../../../utils/auth";

export function usePresentacionForm(
  presentacion: Presentacion | undefined,
  onClose: () => void,
  onSuccess: (mensajeAlerta: string) => void
) {
  // ===================== TOKEN =====================
  const usuarioId = getUsuarioId();

  // ===================== FORM =====================
  const methods = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: presentacion ? transformData(presentacion) : { tipo: "pack" },
  });

  const {
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = methods;

  // ===================== SUBMIT =====================
  const onSubmit = async (formData: FormValues) => {
    let response: ResponsePost;

    try {
      const payload = {
        tipo: formData.tipo,
        quantity: formData.quantity ?? null,
        volumen: formData.volumen ?? null,
        unidad: formData.unidad ?? null,
      };

      if (presentacion) {
        response = await PresentacionService.actualizar(presentacion.id, {
          ...payload,
          usuarioUpdatedId: usuarioId,
        });
      } else {
        response = await PresentacionService.nuevo({
          ...payload,
          usuarioCreatedId: usuarioId,
        });
      }

      onClose();
      onSuccess(response.mensaje);
    } catch (error) {
      const errorMessage = parseApiError(error);

      setError("root", {
        type: "manual",
        message: errorMessage,
      });
    }
  };

  return {
    methods,
    handleSubmit,
    onSubmit,
    isSubmitting,
    errors,
  };
}