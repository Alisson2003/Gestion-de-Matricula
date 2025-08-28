# Backend (SQLite v2) — Campos actualizados
Incluye los campos solicitados por la rúbrica:
- Estudiantes: id, nombre, apellido, cedula, fechaNacimiento, ciudad, direccion, telefono, email
- Usuarios: id, nombre, apellido, email, password
- Materias: id, nombre, codigo, descripcion, creditos
- Matriculas: id, codigo, descripcion, creditos, materiaId (FK), estudianteId (FK)

## Pasos
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name update_campos
node seed.js
npm run dev
```
Login: `admin@efc.local / admin123`
