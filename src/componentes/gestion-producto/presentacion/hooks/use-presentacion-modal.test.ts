import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usePresentacionModal } from "./use-presentacion-modal";
import { Presentacion } from "../../../../interfaces/gestion-producto/presentacion/interfaces-presentacion";

const presentacion: Presentacion = {
  id: 1,
  tipo: "pack",
  quantity: 6,
  volumen: 500,
  unidad: "ml",
  denominacion: "Pack x6 de 500ml",
  sistema: 0,
  deletedAt: null,
};

const auditoria = { id: 1, detalle: "Presentación 1l" } as any;

describe("usePresentacionModal", () => {
  it("inicia cerrado sin datos", () => {
    const { result } = renderHook(() => usePresentacionModal());

    expect(result.current.tipo).toBeNull();
    expect(result.current.presentacion).toBeNull();
    expect(result.current.auditoria).toBeNull();
  });

  it("abrirAlta limpia los datos y marca el modo alta", () => {
    const { result } = renderHook(() => usePresentacionModal());

    act(() => {
      result.current.abrirEdicion(presentacion);
      result.current.abrirAlta();
    });

    expect(result.current.tipo).toBe("alta");
    expect(result.current.presentacion).toBeNull();
    expect(result.current.auditoria).toBeNull();
  });

  it("abrirEdicion guarda la presentación y marca el modo edicion", () => {
    const { result } = renderHook(() => usePresentacionModal());

    act(() => {
      result.current.abrirEdicion(presentacion);
    });

    expect(result.current.tipo).toBe("edicion");
    expect(result.current.presentacion).toEqual(presentacion);
    expect(result.current.auditoria).toBeNull();
  });

  it("abrirAuditoria guarda la auditoría y marca el modo auditoria", () => {
    const { result } = renderHook(() => usePresentacionModal());

    act(() => {
      result.current.abrirAuditoria(auditoria);
    });

    expect(result.current.tipo).toBe("auditoria");
    expect(result.current.auditoria).toEqual(auditoria);
    expect(result.current.presentacion).toBeNull();
  });

  it("cerrar resetea todo el estado", () => {
    const { result } = renderHook(() => usePresentacionModal());

    act(() => {
      result.current.abrirEdicion(presentacion);
    });
    act(() => {
      result.current.cerrar();
    });

    expect(result.current.tipo).toBeNull();
    expect(result.current.presentacion).toBeNull();
    expect(result.current.auditoria).toBeNull();
  });
});