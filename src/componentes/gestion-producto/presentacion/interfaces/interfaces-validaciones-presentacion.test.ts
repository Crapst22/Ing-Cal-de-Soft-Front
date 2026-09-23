import { describe, it, expect } from "vitest";
import { schema, transformData } from "./interfaces-validaciones-presentacion";
import { Presentacion } from "../../../../interfaces/gestion-producto/presentacion/interfaces-presentacion";

async function expectInvalidWithPath(input: unknown, path: string) {
  try {
    await schema.validate(input);
  } catch (error: any) {
    expect(error.path).toBe(path);
    return;
  }
  throw new Error(`Se esperaba un error en "${path}"`);
}

describe("schema de validación de presentación (yup)", () => {
  describe("Validación exitosa", () => {
    it("acepta un pack completo", async () => {
      await expect(
        schema.validate({ tipo: "pack", quantity: 6, volumen: 500, unidad: "ml" }),
      ).resolves.toBeDefined();
    });

    it("acepta un volumen completo", async () => {
      await expect(
        schema.validate({ tipo: "volume", volumen: 1, unidad: "l" }),
      ).resolves.toBeDefined();
    });

    it("acepta campos opcionales vacíos convirtiendo quantity/volumen a null", async () => {
      const value = await schema.validate({ tipo: "pack", quantity: "", volumen: "", unidad: "" });
      expect(value.quantity).toBeNull();
      expect(value.volumen).toBeNull();
      expect(value.unidad).toBe("");
    });
  });

  describe("Validación del tipo", () => {
    it("rechaza un tipo ausente", async () => {
      await expectInvalidWithPath({ quantity: 6 }, "tipo");
    });

    it("rechaza un tipo inválido", async () => {
      await expectInvalidWithPath({ tipo: "litro" }, "tipo");
    });
  });

  describe("Validación de cantidad y volumen", () => {
    it("rechaza una cantidad menor a 1", async () => {
      await expectInvalidWithPath({ tipo: "pack", quantity: 0 }, "quantity");
    });

    it("rechaza un volumen negativo", async () => {
      await expectInvalidWithPath(
        { tipo: "volume", volumen: -1, unidad: "l" },
        "volumen",
      );
    });
  });

  describe("Validación de la unidad", () => {
    it("rechaza una unidad de más de 20 caracteres", async () => {
      await expectInvalidWithPath(
        { tipo: "volume", unidad: "u".repeat(21) },
        "unidad",
      );
    });
  });
});

describe("transformData", () => {
  it("mapea una entidad Presentacion a valores de formulario", () => {
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

    expect(transformData(presentacion)).toEqual({
      tipo: "pack",
      quantity: 6,
      volumen: 500,
      unidad: "ml",
    });
  });
});