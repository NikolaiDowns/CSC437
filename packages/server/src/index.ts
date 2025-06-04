//server/src/index.ts

import express from 'express';
import path from 'path';
import { connect } from './services/mongo';
import users from './routes/users';
import auth, { authenticateUser } from './routes/auth';

const app = express();
const port = Number(process.env.PORT) || 3000;

// 1) Static asset serving
app.use(
  express.static(process.env.STATIC || path.join(__dirname, '../public'))
);
app.use(
  '/node_modules',
  express.static(path.join(__dirname, '../node_modules'))
);

// 2) JSON parser
app.use(express.json());

// 3) Auth endpoints: /api/auth/register & /api/auth/login
app.use('/api/auth', auth);

// 4) Protected user endpoints: /api/users/*
app.use('/api/users', authenticateUser, users);

// 5) Client SPA / proto build (track_progress, etc.)
app.use(express.static(path.join(__dirname, '../../proto/dist')));

// 6) Simple health‐check
app.get('/hello', (_req, res) => res.send('Hello, World'));

// 7) Lookup user by ID (unprotected)
app.get('/user/:id', async (req, res) => {
  const { default: Users } = await import('./services/user-svc');
  const user = await Users.get(req.params.id);
  return user ? res.json(user) : res.status(404).end();
});

// 8) Connect to MongoDB, then start the server exactly once
connect('Truewalk0')
  .then(() => {
    console.log('🟢 MongoDB connected');
    console.log('🟢 Starting server…');
    const host = process.env.HOST || '0.0.0.0';
    app.listen(port, host, () => {
      console.log(`🟢 Server listening on http://${host}:${port}`);
    });
  })
  .catch((err) => {
    console.error('⚠️ MongoDB connection failed:', err);
    process.exit(1);
  });
