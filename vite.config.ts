import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // Aumenta o limite de aviso para 1600kb para evitar warnings desnecessários no Vercel
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        // Divide bibliotecas grandes em arquivos separados para melhor carregamento
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-recharts': ['recharts'],
          'vendor-genai': ['@google/genai'],
          'vendor-icons': ['lucide-react'],
        },
      },
    },
  },
});