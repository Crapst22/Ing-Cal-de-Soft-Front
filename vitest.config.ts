import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    fileParallelism: false,
    coverage: {
      provider: 'v8',
      include: [
        'src/componentes/gestion-producto/presentacion/hooks/**',
        'src/componentes/gestion-producto/presentacion/interfaces/**',
        'src/componentes/gestion-producto/presentacion/utils/**',
      ],
      exclude: [
        '**/*.test.ts',
        '**/*.test.tsx',
        'src/componentes/gestion-producto/presentacion/utils/consultar-presentacion.tsx',
      ],
      reporter: ['text', 'html'],
    },
  },
});