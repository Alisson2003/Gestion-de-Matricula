const prisma = require('./src/prisma/client');
const bcrypt = require('bcrypt');

async function main() {
  // Usuario admin
  const email = 'admin@efc.local';
  const exists = await prisma.usuario.findUnique({ where: { email } });
  if (!exists) {
    const password = await bcrypt.hash('admin123', 10);
    await prisma.usuario.create({
      data: { nombre: 'Admin', apellido: 'Root', email, password }
    });
    console.log('✅ Usuario admin creado: admin@efc.local / admin123');
  } else {
    console.log('ℹ️ Usuario admin ya existe');
  }

  // Datos de ejemplo
  const est = await prisma.estudiante.upsert({
    where: { cedula: '0102030405' },
    update: {},
    create: {
      nombre: 'Juan', apellido: 'Pérez', cedula: '0102030405',
      fechaNacimiento: new Date('2000-01-15'), ciudad: 'Quito',
      direccion: 'Av. Siempre Viva 123', telefono: '0999999999', email: 'juan.perez@example.com'
    }
  });

  const mat = await prisma.materia.upsert({
    where: { codigo: 'MAT101' },
    update: {},
    create: { nombre: 'Matemática I', codigo: 'MAT101', descripcion: 'Cálculo básico', creditos: 4 }
  });

  await prisma.matricula.create({
    data: { codigo: 'M-0001', descripcion: 'Matrícula primer semestre', creditos: 4, estudianteId: est.id, materiaId: mat.id }
  });
  console.log('✅ Datos demo creados');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
