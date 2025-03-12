
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    minify: command === 'build',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        ...(command === 'build' && {
          'entry-server': path.resolve(__dirname, 'src/entry-server.tsx'),
        }),
      },
    },
  },
  ssr: {
    // SSR specific configuration
    noExternal: ['@/components/**', '@/pages/**'],
  },
}));
