// src/index.ts
import express from 'express';
import path from 'path';
import { connect } from './services/mongo';
import users from './routes/users';
import auth, { authenticateUser } from './routes/auth';

const app = express();
const port = Number(process.env.PORT) || 3000;

// serve your front-end assets
app.use(
  express.static(process.env.STATIC || path.join(__dirname, '../public'))
);
app.use(
  '/node_modules',
  express.static(path.join(__dirname, '../node_modules'))
);

app.use(express.json());

// auth endpoints (login/register) now live under /api/auth
app.use('/api/auth', auth);

// protected user endpoints
app.use('/api/users', authenticateUser, users);

// serve your proto build (track_progress, etc.)
app.use(express.static(path.join(__dirname, '../../proto/dist')));

// simple test
app.get('/hello', (_req, res) => res.send('Hello, World'));

// lookup by ID
app.get('/user/:id', async (req, res) => {
  const { default: Users } = await import('./services/user-svc');
  const user = await Users.get(req.params.id);
  return user ? res.json(user) : res.status(404).end();
});

app.listen(port, () => {
  console.log(`🔊 Listening on port ${port}`);
});

// connect('Truewalk0')
//   .then(() => {
//     app.listen(port, () => {
//       console.log(`Server listening on http://localhost:${port}`);
//     });
//   })
//   .catch((err) => {
//     console.error('MongoDB connection failed:', err);
//     process.exit(1);
//   });

connect("Truewalk0")
  .then(() => {
    console.log("🟢 MongoDB connected");
    console.log("🟢 Starting server…");
    // bind on 0.0.0.0 so outside requests are accepted
    const host = process.env.HOST || "0.0.0.0";
    app.listen(port, host, () => {
      console.log(`🟢 Server listening on http://${host}:${port}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err);
    process.exit(1);
  });
