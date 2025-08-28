const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const estudiantesRoutes = require('./routes/estudiantes.routes');
const materiasRoutes = require('./routes/materias.routes');
const matriculasRoutes = require('./routes/matriculas.routes');
const { authMiddleware } = require('./middlewares/auth.middleware');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ ok: true, message: 'EFC Matriculas API (SQLite v2)' });
});

app.use('/api/auth', authRoutes);
app.use('/api/estudiantes', authMiddleware, estudiantesRoutes);
app.use('/api/materias', authMiddleware, materiasRoutes);
app.use('/api/matriculas', authMiddleware, matriculasRoutes);

module.exports = app;
