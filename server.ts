import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { handleQuoteRequest, readQuoteEnv } from './src/lib/quote-delivery';
import { generateRobotsTxt, generateSitemapXml } from './src/lib/seo';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

async function createServer() {
  const app = express();
  app.use(express.json({ limit: '64kb' }));

  // SEO endpoints
  app.get('/robots.txt', (_req, res) => {
    const isProdAuthorized = process.env.MRK_PRODUCTION_INDEXING === 'true';
    res.type('text/plain').send(generateRobotsTxt(isProdAuthorized));
  });

  app.get('/sitemap.xml', (_req, res) => {
    res.type('application/xml').send(generateSitemapXml());
  });

  // Single authoritative quote endpoint (shared with the Vercel function in api/quote.ts)
  app.post('/api/quote', async (req, res) => {
    const forwarded = req.headers['x-forwarded-for'];
    const ip =
      (typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : req.socket.remoteAddress) || 'local';
    const result = await handleQuoteRequest({ body: req.body, ip, env: readQuoteEnv() });
    res.status(result.statusCode).set('Cache-Control', 'no-store').json(result.body);
  });
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MRK Removals Adelaide server running on http://localhost:${PORT}`);
  });
}

createServer();
