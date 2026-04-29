import {defineConfig, loadEnv} from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '');
const disableHmr = env.DISABLE_HMR === 'true';

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname),
      },
    },
return {
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname),
    },
  },
  server: {
    hmr: disableHmr ? false : undefined,
  },
  define: {
    __ASSET_APP_USERNAME__: JSON.stringify(env.ASSET_APP_USERNAME ?? ''),
    __ASSET_APP_PASSWORD__: JSON.stringify(env.ASSET_APP_PASSWORD ?? ''),
  },
};
    define: {
      __ASSET_APP_USERNAME__: JSON.stringify(env.ASSET_APP_USERNAME ?? ''),
      __ASSET_APP_PASSWORD__: JSON.stringify(env.ASSET_APP_PASSWORD ?? ''),
    },
  };
});
