import { Link, useNavigate } from 'react-router-dom'
import { getUser, clearAuth } from '../lib/auth'
export default function Navbar(){
  const u = getUser(); const nav = useNavigate()
  return <div className="navbar">
    <div><strong>EFC Matrículas</strong> <Link to="/estudiantes">Estudiantes</Link> <Link to="/materias">Materias</Link> <Link to="/matriculas">Matrículas</Link></div>
    <div><span>Bienvenido - {u?.nombre || 'Usuario'}</span> <button onClick={()=>{clearAuth();nav('/login')}}>Salir</button></div>
  </div>
}
