import * as yup from "yup";
import { Presentacion } from "../../../../interfaces/gestion-producto/presentacion/interfaces-presentacion";

//===================== schema de validacion ============================================//

export const schema = yup.object().shape({
  tipo: yup
    .string()
    .oneOf(["volume", "pack"], "El tipo debe ser 'volume' o 'pack'.")
    .required("El tipo es obligatorio."),

  quantity: yup
    .number()
    .nullable()
    .optional()
    .transform((value, originalValue) =>
      originalValue === "" ? null : value
    )
    .min(1, "La cantidad debe ser mayor o igual a 1."),

  volumen: yup
    .number()
    .nullable()
    .optional()
    .transform((value, originalValue) =>
      originalValue === "" ? null : value
    )
    .min(0, "El volumen no puede ser negativo."),

  unidad: yup
    .string()
    .nullable()
    .optional()
    .trim()
    .max(20, "La unidad no puede superar los 20 caracteres."),
});

export type FormValues = yup.InferType<typeof schema>;

//===================== transform data ============================================//

export const transformData = (presentacion: Presentacion): FormValues => {
  return {
    tipo: presentacion.tipo,
    quantity: presentacion.quantity,
    volumen: presentacion.volumen,
    unidad: presentacion.unidad,
  };
};