import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Declare process to avoid TypeScript errors in the config environment if @types/node isn't picked up automatically
declare const process: any;

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // By default, Vite doesn't expose process.env to the browser.
      // We define it here so the `process.env.API_KEY` usage in geminiService.ts works.
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});