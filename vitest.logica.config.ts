import { defineConfig } from "vitest/config";
import base from "./vite.config";

export default defineConfig({
  ...base,
  test: {
    ...base.test,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      reportsDirectory: "coverage-logica",
      include: [
        "src/componentes/gestion-producto/presentacion/interfaces/interfaces-validaciones-presentacion.tsx",
        "src/componentes/gestion-producto/presentacion/hooks/use-presentacion-form.ts",
        "src/componentes/gestion-producto/presentacion/hooks/use-presentacion-modal.ts",
        "src/componentes/gestion-producto/producto/domain/denominacion-producto.ts",
      ],
      thresholds: {
        lines: 70,
        statements: 70,
        functions: 70,
        branches: 70,
      },
    },
  },
});