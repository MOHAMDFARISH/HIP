import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      // FIX: Removed the `define` block. Vite automatically exposes variables
      // prefixed with `VITE_` on `import.meta.env` in a type-safe way. The `define`
      // option is a legacy method that can interfere with TypeScript's type inference,
      // causing the "Property 'env' does not exist on type 'ImportMeta'" error.
      resolve: {
        // FIX: Replaced `__dirname` which is not available in ES modules with
        // `process.cwd()`. This correctly resolves the alias to the project root
        // in an ESM-compatible manner.
        alias: {
          '@': path.resolve(process.cwd()),
        }
      }
    };
});
