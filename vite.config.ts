import {defineConfig, loadEnv} from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname),
      },
    },
    define: {
      __ASSET_APP_USERNAME__: JSON.stringify(env.ASSET_APP_USERNAME ?? ''),
      __ASSET_APP_PASSWORD__: JSON.stringify(env.ASSET_APP_PASSWORD ?? ''),
    },
  };
});
