const prisma = require('../prisma/client');

async function list(_req, res) {
  const materias = await prisma.materia.findMany({ orderBy: { id: 'desc' } });
  res.json(materias);
}

async function getById(req, res) {
  const id = Number(req.params.id);
  const materia = await prisma.materia.findUnique({ where: { id } });
  if (!materia) return res.status(404).json({ message: 'Materia no encontrada' });
  res.json(materia);
}


async function create(req, res) {
  const { nombre, codigo, descripcion, creditos } = req.body || {};
  if (!nombre || !codigo || !descripcion || creditos == null) {
    return res.status(400).json({ message: 'nombre, codigo, descripcion y creditos son requeridos' });
  }
  try {
    const materia = await prisma.materia.create({ data: { nombre, codigo, descripcion, creditos: Number(creditos) } });
    res.status(201).json(materia);
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: 'Error creando materia', details: e.message });
  }
}

async function update(req, res) {
  const id = Number(req.params.id);
  const { nombre, codigo, descripcion, creditos } = req.body || {};
  try {
    const materia = await prisma.materia.update({
      where: { id },
      data: { nombre, codigo, descripcion, creditos: creditos != null ? Number(creditos) : undefined }
    });
    res.json(materia);
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: 'Error actualizando materia', details: e.message });
  }
}

async function remove(req, res) {
  const id = Number(req.params.id);
  try {
    await prisma.materia.delete({ where: { id } });
    res.json({ message: 'Materia eliminada' });
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: 'Error eliminando materia' });
  }
}

module.exports = { list, getById, create, update, remove };
