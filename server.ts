import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import authRoutes from './server/routes/auth.js';
import studentsRoutes from './server/routes/students.js';
import adminsRoutes from './server/routes/admins.js';
import contentRoutes from './server/routes/content.js';
import submissionsRoutes from './server/routes/submissions.js';
import analyticsRoutes from './server/routes/analytics.js';
import settingsRoutes from './server/routes/settings.js';
import logsRoutes from './server/routes/logs.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/students', studentsRoutes);
  app.use('/api/admins', adminsRoutes);
  app.use('/api/content', contentRoutes);
  app.use('/api/submissions', submissionsRoutes);
  app.use('/api/analytics', analyticsRoutes);
  app.use('/api/settings', settingsRoutes);
  app.use('/api/logs', logsRoutes);

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      platform: 'IELTS MASTER',
      timezone: 'Asia/Almaty',
      timestamp: new Date().toISOString()
    });
  });

  // In production / built mode or Vite dev integration
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 IELTS MASTER server operational on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
