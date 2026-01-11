// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import preact from '@astrojs/preact';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), preact({ compat: true })],
  server: {
    port: 3000,
  },
  vite: {
    ssr: {
      noExternal: ['chart.js', 'framer-motion']
    },
    resolve: {
      alias: {
        'react': 'preact/compat',
        'react-dom': 'preact/compat',
        'react/jsx-runtime': 'preact/jsx-runtime'
      }
    },
    optimizeDeps: {
      include: ['framer-motion']
    }
  }
});
