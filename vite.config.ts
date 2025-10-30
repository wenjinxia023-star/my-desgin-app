import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: '/', // Vercel使用根路径
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      server: {
        proxy: {
          '/api/coze': {
            target: 'https://api.coze.cn',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api\/coze/, ''),
            configure: (proxy, options) => {
              proxy.on('error', (err, req, res) => {
                console.log('Proxy error:', err);
              });
              proxy.on('proxyReq', (proxyReq, req, res) => {
                console.log('Proxying request to:', proxyReq.path);
              });
            }
          }
        }
      }
    };
});
