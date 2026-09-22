import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Permite que el servidor sea accesible desde fuera del contenedor
    port: 5173, // Puerto que estás exponiendo en el docker-compose
    watch: {
      usePolling: true, // Necesario para que Vite detecte cambios dentro del contenedor
    },
  },
  test: {
    environment: 'jsdom',
    css: false,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{spec,test}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: 'coverage',
      exclude: [
        'src/**/*.{spec,test}.{ts,tsx}',
        'src/test/**',
        'src/main.tsx',
        'src/vite-env.d.ts',
      ],
    },
  },
})