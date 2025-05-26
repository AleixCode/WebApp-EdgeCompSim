import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  build: {
    outDir: 'build',     // Output directory for production builds
  },
  plugins: [react()],    // Use the React plugin
});
