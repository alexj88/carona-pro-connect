import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      // Redireciona qualquer requisição que comece com /api
      '/api': {
        target: 'http://localhost:3001', // A porta do seu backend
        changeOrigin: true, // Necessário para evitar erros de origem
      }
    }
  }
}));
