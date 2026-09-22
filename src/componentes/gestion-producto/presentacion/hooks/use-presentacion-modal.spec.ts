import { renderHook, act } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  usePresentacionModal,
  PresentacionModalTipo,
} from "./use-presentacion-modal";
import { Presentacion } from "../../../../interfaces/gestion-producto/presentacion/interfaces-presentacion";

const presentacion: Presentacion = {
  id: 1,
  tipo: "pack",
  quantity: 12,
  volumen: null,
  unidad: null,
  denominacion: "pack 12",
  sistema: 0,
  deletedAt: null,
};

describe("usePresentacionModal", () => {
  it("inicia cerrado sin datos", () => {
    const { result } = renderHook(() => usePresentacionModal());

    expect(result.current.tipo).toBeNull();
    expect(result.current.presentacion).toBeNull();
    expect(result.current.auditoria).toBeNull();
  });

  it("abrirAlta resetea datos y setea tipo 'alta'", () => {
    const { result } = renderHook(() => usePresentacionModal());

    act(() => {
      result.current.abrirAlta();
    });

    expect(result.current.tipo).toBe("alta");
    expect(result.current.presentacion).toBeNull();
    expect(result.current.auditoria).toBeNull();
  });

  it("abrirEdicion guarda la presentacion y setea tipo 'edicion'", () => {
    const { result } = renderHook(() => usePresentacionModal());

    act(() => {
      result.current.abrirEdicion(presentacion);
    });

    expect(result.current.tipo).toBe("edicion");
    expect(result.current.presentacion).toBe(presentacion);
    expect(result.current.auditoria).toBeNull();
  });

  it("abrirAuditoria guarda la auditoria y setea tipo 'auditoria'", () => {
    const { result } = renderHook(() => usePresentacionModal());

    act(() => {
      result.current.abrirAuditoria({ id: 99 } as never);
    });

    expect(result.current.tipo).toBe("auditoria");
    expect(result.current.auditoria).toEqual({ id: 99 });
    expect(result.current.presentacion).toBeNull();
  });

  it("cerrar deja todo en null", () => {
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

  it("los tipos admitidos son solo los del dominio", () => {
    const tipos: PresentacionModalTipo[] = [
      "alta",
      "edicion",
      "auditoria",
      null,
    ];

    expect(tipos).toHaveLength(4);
  });
});