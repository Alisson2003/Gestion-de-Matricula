const prisma = require('../prisma/client');

async function list(_req, res) {
  const matriculas = await prisma.matricula.findMany({
    include: { estudiante: true, materia: true },
    orderBy: { id: 'desc' }
  });
  res.json(matriculas);
}

async function create(req, res) {
  const { codigo, descripcion, creditos, estudianteId, materiaId } = req.body || {};
  if (!codigo || !descripcion || creditos == null || !estudianteId || !materiaId) {
    return res.status(400).json({ message: 'codigo, descripcion, creditos, estudianteId y materiaId son requeridos' });
  }
  try {
    const matricula = await prisma.matricula.create({
      data: {
        codigo, descripcion, creditos: Number(creditos),
        estudianteId: Number(estudianteId),
        materiaId: Number(materiaId)
      }
    });
    res.status(201).json(matricula);
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: 'Error creando matricula', details: e.message });
  }
}

async function update(req, res) {
  const id = Number(req.params.id);
  const { codigo, descripcion, creditos, estudianteId, materiaId } = req.body || {};
  try {
    const m = await prisma.matricula.update({
      where: { id },
      data: {
        codigo, descripcion,
        creditos: creditos != null ? Number(creditos) : undefined,
        estudianteId: estudianteId ? Number(estudianteId) : undefined,
        materiaId: materiaId ? Number(materiaId) : undefined
      }
    });
    res.json(m);
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: 'Error actualizando matricula', details: e.message });
  }
}

async function remove(req, res) {
  const id = Number(req.params.id);
  try {
    await prisma.matricula.delete({ where: { id } });
    res.json({ message: 'Matricula eliminada' });
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: 'Error eliminando matricula' });
  }
}

module.exports = { list, create, update, remove };
