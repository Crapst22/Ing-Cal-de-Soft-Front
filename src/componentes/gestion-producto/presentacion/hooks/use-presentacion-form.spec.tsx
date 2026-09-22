import { renderHook, act } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { usePresentacionForm } from "./use-presentacion-form";
import PresentacionService from "../services/presentacion-service";
import { getUsuarioId } from "../../../../utils/auth";
import { Presentacion } from "../../../../interfaces/gestion-producto/presentacion/interfaces-presentacion";

vi.mock("../../../../utils/auth", () => ({
  getUsuarioId: () => 42,
}));

vi.mock("../services/presentacion-service", () => ({
  default: {
    nuevo: vi.fn(),
    actualizar: vi.fn(),
  },
}));

const presentacion: Presentacion = {
  id: 7,
  tipo: "volume",
  quantity: null,
  volumen: 500,
  unidad: "ml",
  denominacion: "volumen 500 ml",
  sistema: 0,
  deletedAt: null,
};

describe("usePresentacionForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("envia un alta con usuarioCreatedId y datos normalizados", async () => {
    const onClose = vi.fn();
    const onSuccess = vi.fn();

    vi.mocked(PresentacionService.nuevo).mockResolvedValueOnce({
      mensaje: "Presentación registrada.",
    });

    const { result } = renderHook(() =>
      usePresentacionForm(undefined, onClose, onSuccess)
    );

    await act(async () => {
      await result.current.onSubmit({
        tipo: "pack",
        quantity: 10,
        volumen: null,
        unidad: null,
      });
    });

    expect(PresentacionService.nuevo).toHaveBeenCalledTimes(1);
    expect(PresentacionService.nuevo).toHaveBeenCalledWith({
      tipo: "pack",
      quantity: 10,
      volumen: null,
      unidad: null,
      usuarioCreatedId: 42,
    });
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledWith("Presentación registrada.");
  });

  it("envia una actualizacion con usuarioUpdatedId y el id correspondiente", async () => {
    const onClose = vi.fn();
    const onSuccess = vi.fn();

    vi.mocked(PresentacionService.actualizar).mockResolvedValueOnce({
      mensaje: "Presentación actualizada.",
    });

    const { result } = renderHook(() =>
      usePresentacionForm(presentacion, onClose, onSuccess)
    );

    await act(async () => {
      await result.current.onSubmit({
        tipo: "volume",
        quantity: null,
        volumen: 500,
        unidad: "ml",
      });
    });

    expect(PresentacionService.actualizar).toHaveBeenCalledTimes(1);
    expect(PresentacionService.actualizar).toHaveBeenCalledWith(7, {
      tipo: "volume",
      quantity: null,
      volumen: 500,
      unidad: "ml",
      usuarioUpdatedId: 42,
    });
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledWith("Presentación actualizada.");
  });

  it("no usa el otro service (regresion del endpoint)", async () => {
    const { result } = renderHook(() =>
      usePresentacionForm(undefined, () => {}, () => {})
    );

    vi.mocked(PresentacionService.nuevo).mockResolvedValueOnce({
      mensaje: "ok",
    });

    await act(async () => {
      await result.current.onSubmit({
        tipo: "pack",
        quantity: 2,
        volumen: null,
        unidad: null,
      });
    });

    expect(PresentacionService.actualizar).not.toHaveBeenCalled();
  });

  it("ante un error de servicio no cierra y setea el error root", async () => {
    const onClose = vi.fn();
    const onSuccess = vi.fn();

    vi.mocked(PresentacionService.nuevo).mockRejectedValueOnce(
      new Error("boom")
    );

    const { result } = renderHook(() =>
      usePresentacionForm(undefined, onClose, onSuccess)
    );

    await act(async () => {
      await result.current.onSubmit({
        tipo: "pack",
        quantity: 12,
        volumen: null,
        unidad: null,
      });
    });

    expect(onClose).not.toHaveBeenCalled();
    expect(onSuccess).not.toHaveBeenCalled();
    expect(result.current.errors.root?.message).toBe(
      "Ocurrió un error inesperado."
    );
  });
});