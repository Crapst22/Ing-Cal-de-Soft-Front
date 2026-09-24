import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Layers } from "lucide-react";
import { Card, CardContent, CardFooter } from "../../../ui/Card";
import { Button } from "../../../ui/Button";
import EncabezadoFormularios from "../../../ui/encabezadoFormularios";
import PriceInput from "../../../herramientas/formateo-de-campos/price-input";
import { Producto } from "../../../../interfaces/gestion-producto/producto/interfaces-producto";
import ProductoService from "../services/producto-service";
import { parseApiError } from "../../../../utils/errores";
import { getUsuarioId } from "../../../../utils/auth";

interface FormValues {
  nuevoPrecio: number;
  motivo: string;
}

const schema = yup.object().shape({
  nuevoPrecio: yup
    .number()
    .typeError("El precio nuevo debe ser un número válido.")
    .positive("El precio nuevo debe ser mayor a 0.")
    .required("El precio nuevo es obligatorio."),
  motivo: yup
    .string()
    .trim()
    .required("El motivo es obligatorio."),
});

export default function CambioPrecioModal({
  producto,
  onClose,
  onSuccess,
}: {
  producto: Producto;
  onClose: () => void;
  onSuccess: (mensaje: string) => void;
}) {
  const methods = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      nuevoPrecio: 0,
      motivo: "",
    },
  });

  const { handleSubmit, setValue, setError, watch } = methods;

  const nuevoPrecio = watch("nuevoPrecio");
  const motivo = watch("motivo");
  const motivoValido = !!motivo && motivo.trim().length > 0;

  useEffect(() => {
    if (producto) {
      setValue("nuevoPrecio", producto.precio ?? 0);
    }
  }, [producto, setValue]);

  const onSubmit = async (formData: FormValues) => {
    try {
      const response = await ProductoService.actualizarPreciosProducto(
        producto.id,
        {
          precio: formData.nuevoPrecio,
          motivo: formData.motivo.trim(),
          usuarioId: getUsuarioId(),
        }
      );

      onSuccess(
        response?.mensaje ?? "Precio del producto actualizado con éxito"
      );
    } catch (error) {
      setError("root", {
        type: "manual",
        message: parseApiError(error),
      });
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="fixed inset-0 flex items-start justify-center bg-black bg-opacity-50 z-50 overflow-y-auto py-5">
        <Card className="w-full max-w-2xl bg-white mx-auto shadow-lg rounded-2xl overflow-hidden relative mt-10 mb-12">
          <EncabezadoFormularios
            title="Cambio de Precio"
            subtitle={producto.denominacion}
            icon={<Layers className="form-icon" />}
            onClose={onClose}
          />

          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4 px-6 py-4">
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <PriceInput
                    name="precioAnterior"
                    label="Precio anterior"
                    value={producto.precio ?? 0}
                    onChange={() => {}}
                    disabled
                  />

                  <PriceInput
                    name="nuevoPrecio"
                    label="Precio nuevo"
                    value={nuevoPrecio || 0}
                    onChange={(value) =>
                      setValue("nuevoPrecio", Number(value))
                    }
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700">
                    Motivo <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={watch("motivo")}
                    onChange={(e) => setValue("motivo", e.target.value)}
                    className="bg-white text-black border rounded px-2 py-1 min-h-[80px]"
                    placeholder="Ingresa el motivo del cambio"
                  />
                  {methods.formState.errors.motivo?.message && (
                    <p className="text-red-500 text-sm mt-1">
                      {methods.formState.errors.motivo.message}
                    </p>
                  )}
                </div>

                {methods.formState.errors.root?.message && (
                  <p className="text-red-500 text-sm">
                    {methods.formState.errors.root.message}
                  </p>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex justify-center py-3">
              <Button
                type="submit"
                className="btn btn-dark"
                disabled={!motivoValido}
              >
                Confirmar
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </FormProvider>
  );
}