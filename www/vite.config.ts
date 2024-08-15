import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  root: './www/',
  build: {
    rollupOptions: {
      input: {
        app: './www/index.html'
      },
      output: {
        entryFileNames: 'assets/[name].js', // No hash in entry file names
        chunkFileNames: 'assets/[name].js', // No hash in chunk file names
        assetFileNames: 'assets/[name].[ext]' // No hash in asset file names
      }
    }
  }
});
