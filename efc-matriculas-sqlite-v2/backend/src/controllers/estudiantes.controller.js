const prisma = require('../prisma/client');

async function list(req, res) {
  const { page = 1, limit = 20, search = '' } = req.query;
  const skip = (Number(page) - 1) * Number(limit);
  const where = search
    ? { OR: [
        { nombre: { contains: search, mode: 'insensitive' } },
        { apellido: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { cedula: { contains: search, mode: 'insensitive' } },
      ] }
    : {};
  const [total, estudiantes] = await Promise.all([
    prisma.estudiante.count({ where }),
    prisma.estudiante.findMany({ where, skip, take: Number(limit), orderBy: { id: 'desc' } })
  ]);
  res.json({ total, estudiantes });
}

async function getById(req, res) {
  const id = Number(req.params.id);
  const estudiante = await prisma.estudiante.findUnique({ where: { id } });
  if (!estudiante) return res.status(404).json({ message: 'Estudiante no encontrado' });
  res.json(estudiante);
}

async function create(req, res) {
  const { nombre, apellido, cedula, fechaNacimiento, ciudad, direccion, telefono, email } = req.body || {};
  if (!nombre || !apellido || !cedula || !fechaNacimiento || !ciudad || !direccion || !telefono || !email) {
    return res.status(400).json({ message: 'Todos los campos de estudiante son requeridos' });
  }
  try {
    const estudiante = await prisma.estudiante.create({
      data: {
        nombre, apellido, cedula,
        fechaNacimiento: new Date(fechaNacimiento),
        ciudad, direccion, telefono, email
      }
    });
    res.status(201).json(estudiante);
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: 'Error creando estudiante', details: e.message });
  }
}

async function update(req, res) {
  const id = Number(req.params.id);
  const { nombre, apellido, cedula, fechaNacimiento, ciudad, direccion, telefono, email } = req.body || {};
  try {
    const estudiante = await prisma.estudiante.update({
      where: { id },
      data: {
        nombre, apellido, cedula,
        fechaNacimiento: fechaNacimiento ? new Date(fechaNacimiento) : undefined,
        ciudad, direccion, telefono, email
      }
    });
    res.json(estudiante);
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: 'Error actualizando estudiante', details: e.message });
  }
}

async function remove(req, res) {
  const id = Number(req.params.id);
  try {
    await prisma.estudiante.delete({ where: { id } });
    res.json({ message: 'Estudiante eliminado' });
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: 'Error eliminando estudiante' });
  }
}

module.exports = { list, getById, create, update, remove };
