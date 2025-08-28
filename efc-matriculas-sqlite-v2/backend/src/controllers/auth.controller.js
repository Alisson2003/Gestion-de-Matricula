const prisma = require('../prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function login(req, res) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: 'Email y clave son requeridos' });
    }
    const user = await prisma.usuario.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Usuario o contraseña incorrectos.' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Usuario o contraseña incorrectos.' });
    const token = jwt.sign(
      { userId: user.id, nombre: user.nombre, apellido: user.apellido, email: user.email },
      process.env.JWT_SECRET || 'changeme',
      { expiresIn: '8h' }
    );
    res.json({ token, user: { id: user.id, nombre: user.nombre, apellido: user.apellido, email: user.email } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error interno' });
  }
}

module.exports = { login };
