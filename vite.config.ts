import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import replace from '@rollup/plugin-replace';

export default defineConfig(({ command }) => {
  let baseUrl = '/project';

  if (command === 'build') {
    baseUrl = '/';
  }

  return {
    base: baseUrl,
    plugins: [
      react(),
      nodePolyfills({
        protocolImports: true,
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
        preventAssignment: true,
      }),
      {
        name: 'custom-mock-stream-mime-type',
        transform(code, id) {
          if (id.includes('node_modules/stream-mime-type/dist/index.js')) {
            // Replace or mock the specific code causing the issue
            return {
              code: code.replace(/import { read } from 'fs';/, '// mock import'),
              map: null,
            };
          }
        },
      },
    ],
    resolve: {
      alias: [
        {
          find: '@',
          replacement: path.resolve(__dirname, 'src'),
        },
        {
          find: 'fs',
          replacement: 'browserify-fs',
        },
        {
          find: 'node-fetch',
          replacement: 'just-use-native-fetch',
        },
        {
          find: 'stream',
          replacement: 'stream-browserify',
        },
        {
          find: 'buffer',
          replacement: 'buffer/',
        },
      ],
    },
    optimizeDeps: {
      include: ['buffer', 'process'],
      exclude: ['stream-mime-type'],
    },
    define: {
      'global.Buffer': 'Buffer',
      process: { env: {} },
    },
  };
});