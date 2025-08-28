import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { setAuth } from '../lib/auth'
export default function Login(){
  const nav = useNavigate()
  const [email, setEmail] = useState('admin@efc.local')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')
  async function submit(e){
    e.preventDefault(); setError('')
    try{ const {data} = await api.post('/api/auth/login', {email,password}); setAuth(data); nav('/estudiantes') }
    catch(e){ setError(e?.response?.data?.message || 'Usuario o contraseña incorrectos.') }
  }
  return <div className="container"><div className="card" style={{maxWidth:480, margin:'60px auto'}}>
    <h1>Iniciar sesión</h1>
    {error && <div style={{color:'#b91c1c'}}>{error}</div>}
    <form onSubmit={submit} className="grid">
      <div><label>Email</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} required/></div>
      <div><label>Clave</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} required/></div>
      <div style={{display:'flex',alignItems:'flex-end'}}><button className="primary">Ingresar</button></div>
    </form>
  </div></div>
}
