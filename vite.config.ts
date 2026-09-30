import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import dotenv from 'dotenv';
import {
  handleMakeEz,
  handleCheckAnswer,
  handleQuestionDecoder,
  handleDoubt,
} from './src/server/aiService';

dotenv.config();

function apiServerPlugin(): Plugin {
  return {
    name: 'api-server-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) {
          return next();
        }

        // Helper to parse JSON body
        const getBody = (): Promise<any> => {
          return new Promise((resolve) => {
            let data = '';
            req.on('data', (chunk) => {
              data += chunk;
            });
            req.on('end', () => {
              try {
                resolve(data ? JSON.parse(data) : {});
              } catch (e) {
                resolve({});
              }
            });
          });
        };

        res.setHeader('Content-Type', 'application/json');

        if (req.url === '/api/health' && req.method === 'GET') {
          res.end(
            JSON.stringify({
              status: 'ok',
              appName: 'Telugu EZ',
              hasGeminiKey: Boolean(
                process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'
              ),
            })
          );
          return;
        }

        if (req.method === 'POST') {
          const body = await getBody();

          if (req.url === '/api/ai/make-ez' || req.url === '/api/ai/explain') {
            const result = await handleMakeEz(body);
            res.end(JSON.stringify(result));
            return;
          }

          if (req.url === '/api/ai/check-answer') {
            const result = await handleCheckAnswer(body);
            res.end(JSON.stringify(result));
            return;
          }

          if (req.url === '/api/ai/question-decoder') {
            const result = await handleQuestionDecoder(body);
            res.end(JSON.stringify(result));
            return;
          }

          if (req.url === '/api/ai/doubt') {
            const result = await handleDoubt(body);
            res.end(JSON.stringify(result));
            return;
          }
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiServerPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

