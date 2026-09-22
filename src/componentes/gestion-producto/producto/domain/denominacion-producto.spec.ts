import { describe, expect, it } from "vitest";
import { componerDenominacion } from "./denominacion-producto";

describe("componerDenominacion (regla CR-002: marca + linea + presentacion)", () => {
  it("compone marca, linea y presentacion en minusculas", () => {
    const resultado = componerDenominacion(
      { denominacion: "Coca Cola" },
      { denominacion: "Gaseosas" },
      { denominacion: "Pack 12 Unidades" }
    );

    expect(resultado).toBe("coca cola gaseosas pack 12 unidades");
  });

  it("omite partes ausentes", () => {
    const soloMarca = componerDenominacion({ denominacion: "Marca" });
    const sinLinea = componerDenominacion(
      { denominacion: "Marca" },
      null,
      { denominacion: "Pack 6" }
    );
    const soloPresentacion = componerDenominacion(undefined, undefined, {
      denominacion: "Volumen 500 ml",
    });

    expect(soloMarca).toBe("marca");
    expect(sinLinea).toBe("marca pack 6");
    expect(soloPresentacion).toBe("volumen 500 ml");
  });

  it("normaliza espacios multiples y bordes", () => {
    const resultado = componerDenominacion(
      { denominacion: "  Marca   Doble  " },
      { denominacion: "  Linea  " },
      { denominacion: "  Pack 12  " }
    );

    expect(resultado).toBe("marca doble linea pack 12");
  });

  it("devuelve cadena vacia cuando no hay ninguna parte", () => {
    expect(componerDenominacion()).toBe("");
    expect(componerDenominacion(null, null, null)).toBe("");
  });
});