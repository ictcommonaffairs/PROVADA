import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  // Project-pagina op GitHub Pages: https://ictcommonaffairs.github.io/PROVADA/
  // Bij een eigen domein (root) terugzetten naar '/'.
  base: '/PROVADA/',
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        afspraak: resolve(__dirname, 'afspraak/index.html'),
      },
    },
  },
});
