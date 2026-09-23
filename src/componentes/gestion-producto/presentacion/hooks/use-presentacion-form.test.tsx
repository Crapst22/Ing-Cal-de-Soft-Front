import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usePresentacionForm } from "./use-presentacion-form";
import { Presentacion } from "../../../../interfaces/gestion-producto/presentacion/interfaces-presentacion";

vi.mock("../../../../utils/auth", () => ({
  getUsuarioId: () => 7,
}));

const serviceMock = vi.hoisted(() => ({
  nuevo: vi.fn(),
  actualizar: vi.fn(),
}));

vi.mock("../services/presentacion-service", () => ({
  default: serviceMock,
}));

const presentacionEdicion: Presentacion = {
  id: 3,
  tipo: "volume",
  quantity: null,
  volumen: 1,
  unidad: "l",
  denominacion: "1l",
  sistema: 0,
  deletedAt: null,
};

function setup() {
  const onClose = vi.fn();
  const onSuccess = vi.fn();
  const utils = renderHook(() =>
    usePresentacionForm(undefined, onClose, onSuccess),
  );
  return { ...utils, onClose, onSuccess };
}

describe("usePresentacionForm", () => {
  beforeEach(() => {
    serviceMock.nuevo.mockReset();
    serviceMock.actualizar.mockReset();
  });

  it("en alta llama al servicio nuevo con el payload y el usuario logueado", async () => {
    serviceMock.nuevo.mockResolvedValue({
      mensaje: "Presentación creada con éxito con denominacion: Pack x6 de 500ml",
    });

    const { result, onClose, onSuccess } = setup();

    await act(async () => {
      await result.current.onSubmit({
        tipo: "pack",
        quantity: 6,
        volumen: 500,
        unidad: "ml",
      });
    });

    expect(serviceMock.nuevo).toHaveBeenCalledTimes(1);
    expect(serviceMock.nuevo).toHaveBeenCalledWith({
      tipo: "pack",
      quantity: 6,
      volumen: 500,
      unidad: "ml",
      usuarioCreatedId: 7,
    });
    expect(onSuccess).toHaveBeenCalledWith(
      "Presentación creada con éxito con denominacion: Pack x6 de 500ml",
    );
    expect(onClose).toHaveBeenCalled();
  });

  it("en alta convierte undefined/null opcionales en null", async () => {
    serviceMock.nuevo.mockResolvedValue({ mensaje: "ok" });

    const { result } = setup();

    await act(async () => {
      await result.current.onSubmit({ tipo: "pack", quantity: null, volumen: null, unidad: null });
    });

    expect(serviceMock.nuevo).toHaveBeenCalledWith({
      tipo: "pack",
      quantity: null,
      volumen: null,
      unidad: null,
      usuarioCreatedId: 7,
    });
  });

  it("en edición llama actualizar con id y usuarioUpdatedId", async () => {
    const onClose = vi.fn();
    const onSuccess = vi.fn();
    const { result } = renderHook(() =>
      usePresentacionForm(presentacionEdicion, onClose, onSuccess),
    );
    serviceMock.actualizar.mockResolvedValue({
      mensaje: "Presentación editada con éxito con denominacion: 1l",
    });

    await act(async () => {
      await result.current.onSubmit({ tipo: "volume", volumen: 1, unidad: "l" });
    });

    expect(serviceMock.actualizar).toHaveBeenCalledTimes(1);
    expect(serviceMock.actualizar).toHaveBeenCalledWith(3, {
      tipo: "volume",
      quantity: null,
      volumen: 1,
      unidad: "l",
      usuarioUpdatedId: 7,
    });
    expect(onSuccess).toHaveBeenCalledWith(
      "Presentación editada con éxito con denominacion: 1l",
    );
    expect(onClose).toHaveBeenCalled();
  });

  it("setea el error en root cuando falla el servicio y no notifica éxito", async () => {
    serviceMock.nuevo.mockRejectedValue({
      response: { data: { message: "El tipo no es válido." } },
    });

    const { result, onClose, onSuccess } = setup();

    await act(async () => {
      await result.current.onSubmit({ tipo: "pack", quantity: null, volumen: null, unidad: null });
    });

    expect(result.current.errors.root?.message).toBe("El tipo no es válido.");
    expect(onSuccess).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });
});