import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Estudiantes from './pages/Estudiantes.jsx'
import Materias from './pages/Materias.jsx'
import Matriculas from './pages/Matriculas.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
export default function App(){
  return <Routes>
    <Route path="/" element={<Navigate to="/login" replace/>}/>
    <Route path="/login" element={<Login/>}/>
    <Route path="/estudiantes" element={<ProtectedRoute><Estudiantes/></ProtectedRoute>}/>
    <Route path="/materias" element={<ProtectedRoute><Materias/></ProtectedRoute>}/>
    <Route path="/matriculas" element={<ProtectedRoute><Matriculas/></ProtectedRoute>}/>
    <Route path="*" element={<div className="container"><h1>404</h1></div>} />
  </Routes>
}
