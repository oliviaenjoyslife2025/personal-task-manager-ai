import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Configure development server proxy
  server: {
    proxy: {
      // Capture all requests starting with /v1
      // and forward them to Django backend server
      '/v1': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/v1/, ''), // This step is not needed in our Django setup
      },
    },
    // Ensure frontend runs on port 3000
    port: 3000, 
  },
});