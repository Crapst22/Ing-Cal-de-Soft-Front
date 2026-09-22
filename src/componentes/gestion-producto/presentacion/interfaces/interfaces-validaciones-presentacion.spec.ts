import { describe, expect, it } from "vitest";
import { schema, transformData } from "./interfaces-validaciones-presentacion";
import { Presentacion } from "../../../../interfaces/gestion-producto/presentacion/interfaces-presentacion";

describe("schema de validacion de Presentacion", () => {
  describe("tipo", () => {
    it("es obligatorio", async () => {
      await expect(schema.validate({})).rejects.toThrow(
        "El tipo es obligatorio."
      );
    });

    it("solo admite 'volume' o 'pack'", async () => {
      await expect(schema.validate({ tipo: "litros" })).rejects.toThrow(
        "El tipo debe ser 'volume' o 'pack'."
      );
    });

    it("acepta 'volume' y 'pack'", async () => {
      const volume = await schema.validate({ tipo: "volume" });
      const pack = await schema.validate({ tipo: "pack" });

      expect(volume.tipo).toBe("volume");
      expect(pack.tipo).toBe("pack");
    });
  });

  describe("quantity", () => {
    it("rechaza cantidades menores a 1", async () => {
      await expect(
        schema.validate({ tipo: "pack", quantity: 0 })
      ).rejects.toThrow("La cantidad debe ser mayor o igual a 1.");
    });

    it("acepta cantidades iguales o mayores a 1", async () => {
      const value = await schema.validate({ tipo: "pack", quantity: 1 });

      expect(value.quantity).toBe(1);
    });

    it("convierte '' en null (opcional)", async () => {
      const value = await schema.validate({ tipo: "pack", quantity: "" });

      expect(value.quantity).toBeNull();
    });

    it("casting: convierte string numerico a number", async () => {
      const value = await schema.validate({ tipo: "pack", quantity: "5" });

      expect(value.quantity).toBe(5);
    });
  });

  describe("volumen", () => {
    it("rechaza volumenes negativos", async () => {
      await expect(
        schema.validate({ tipo: "volume", volumen: -1 })
      ).rejects.toThrow("El volumen no puede ser negativo.");
    });

    it("acepta 0 y valores positivos", async () => {
      const cero = await schema.validate({ tipo: "volume", volumen: 0 });
      const positivo = await schema.validate({ tipo: "volume", volumen: 500 });

      expect(cero.volumen).toBe(0);
      expect(positivo.volumen).toBe(500);
    });

    it("convierte '' en null (opcional)", async () => {
      const value = await schema.validate({ tipo: "volume", volumen: "" });

      expect(value.volumen).toBeNull();
    });
  });

  describe("unidad", () => {
    it("rechaza unidades de mas de 20 caracteres", async () => {
      await expect(
        schema.validate({ tipo: "volume", unidad: "a".repeat(21) })
      ).rejects.toThrow("La unidad no puede superar los 20 caracteres.");
    });

    it("acepta exactamente 20 caracteres", async () => {
      const value = await schema.validate({
        tipo: "volume",
        unidad: "a".repeat(20),
      });

      expect(value.unidad).toBe("a".repeat(20));
    });

    it("aplica trim", async () => {
      const value = await schema.validate({ tipo: "volume", unidad: "  ml  " });

      expect(value.unidad).toBe("ml");
    });

    it("acepta '' como vacio (opcional)", async () => {
      const value = await schema.validate({ tipo: "volume", unidad: "" });

      expect(value.unidad).toBe("");
    });
  });
});

describe("transformData", () => {
  it("mapea una Presentacion a FormValues", () => {
    const presentacion: Presentacion = {
      id: 1,
      tipo: "volume",
      quantity: 10,
      volumen: 0.5,
      unidad: "l",
      denominacion: "volumen 10 x 0.5 l",
      sistema: 0,
      deletedAt: null,
    };

    expect(transformData(presentacion)).toEqual({
      tipo: "volume",
      quantity: 10,
      volumen: 0.5,
      unidad: "l",
    });
  });

  it("conserva los nulos", () => {
    const presentacion: Presentacion = {
      id: 2,
      tipo: "pack",
      quantity: null,
      volumen: null,
      unidad: null,
      denominacion: "pack 12",
      sistema: 0,
      deletedAt: null,
    };

    expect(transformData(presentacion)).toEqual({
      tipo: "pack",
      quantity: null,
      volumen: null,
      unidad: null,
    });
  });
});