import * as yup from "yup";
import { Presentacion, TipoPresentacion } from "../../../../interfaces/gestion-producto/presentacion/interfaces-presentacion";

export const schema = yup.object().shape({
  tipo: yup
    .string()
    .oneOf(["volume", "pack"], "El tipo de presentación es inválido.")
    .required("El tipo de presentación es obligatorio."),

  quantity: yup
    .number()
    .typeError("La cantidad debe ser un número entero.")
    .transform((value) => (value === "" || value === null ? null : value))
    .nullable()
    .integer("La cantidad debe ser un número entero.")
    .min(1, "La cantidad debe ser mayor o igual a 1.")
    .optional(),

  volumen: yup
    .number()
    .typeError("El volumen debe ser un valor numérico.")
    .transform((value) => (value === "" || value === null ? null : value))
    .nullable()
    .min(0, "El volumen no puede ser negativo.")
    .when("tipo", {
      is: "volume",
      then: (s) =>
        s
          .required("El volumen es obligatorio.")
          .moreThan(0, "El volumen debe ser mayor a 0."),
      otherwise: (s) => s.optional(),
    }),

  unidad: yup
    .string()
    .trim()
    .max(20, "La unidad no puede superar 20 caracteres.")
    .transform((value) => (value === "" ? null : value))
    .nullable()
    .when(["tipo", "volumen"], {
      is: (tipo: TipoPresentacion, volumen: number | null) =>
        tipo === "volume" || (volumen != null && Number(volumen) > 0),
      then: (s) => s.required("La unidad es obligatoria."),
      otherwise: (s) => s.optional(),
    }),
});

export type FormValues = yup.InferType<typeof schema>;

export const transformData = (presentacion: Presentacion): FormValues => {
  return {
    tipo: presentacion.tipo,
    quantity: presentacion.quantity ?? null,
    volumen: presentacion.volumen ?? null,
    unidad: presentacion.unidad ?? null,
  };
};