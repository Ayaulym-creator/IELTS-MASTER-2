import express, { Express } from 'express';
import authRoutes from './routes/auth.js';
import studentsRoutes from './routes/students.js';
import adminsRoutes from './routes/admins.js';
import contentRoutes from './routes/content.js';
import submissionsRoutes from './routes/submissions.js';
import analyticsRoutes from './routes/analytics.js';
import settingsRoutes from './routes/settings.js';
import logsRoutes from './routes/logs.js';

export function createExpressApp(): Express {
  const app = express();

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

  return app;
}
