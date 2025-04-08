
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import { createServer as createViteServer } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function createServer() {
  const app = express();
  const isProd = process.env.NODE_ENV === 'production';
  
  // In production, serve built files
  if (isProd) {
    app.use(express.static(path.resolve(__dirname, 'dist')));
  } else {
    // Create Vite server in middleware mode for development
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });

    // Use vite's connect instance as middleware
    app.use(vite.middlewares);
    
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;

      try {
        // 1. Read index.html
        let template = fs.readFileSync(
          path.resolve(__dirname, 'index.html'),
          'utf-8'
        );

        // 2. Apply Vite HTML transforms
        template = await vite.transformIndexHtml(url, template);

        // 3. Load the server entry
        const { render } = await vite.ssrLoadModule('/src/entry-server.tsx');

        // 4. Render the app HTML
        const appHtml = await render(url);

        // 5. Inject the app HTML into the template
        const html = template.replace(`<div id="root"></div>`, `<div id="root">${appHtml}</div>`);

        // 6. Send the rendered HTML back
        res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      } catch (e) {
        // If an error is caught, let Vite fix the stack trace for better debugging
        vite.ssrFixStacktrace(e);
        console.log(e.stack);
        next(e);
      }
    });
  }

  // IMPORTANT: This route is crucial for SPA routing - it must be AFTER all other routes
  // This makes sure ALL routes are handled by serving index.html
  app.use('*', (req, res) => {
    console.log(`Serving SPA for path: ${req.originalUrl}`);
    if (isProd) {
      // In production, serve the index.html file for any route
      const indexHtml = path.resolve(__dirname, 'dist', 'index.html');
      res.sendFile(indexHtml);
    } else {
      // In development, index.html should also be served for client-side routing
      res.sendFile(path.resolve(__dirname, 'index.html'));
    }
  });

  app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
  });
}

createServer();
