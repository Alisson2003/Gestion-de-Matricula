import { useEffect, useState } from 'react'
import api from '../lib/api'
import Navbar from '../components/Navbar'

const empty = { codigo:'', descripcion:'', creditos:'', estudianteId:'', materiaId:'' }

export default function Matriculas(){
  const [lista,setLista] = useState([])
  const [estudiantes,setEstudiantes] = useState([])
  const [materias,setMaterias] = useState([])
  const [form,setForm] = useState({...empty})
  const [editId,setEditId] = useState(null)
  const [error,setError] = useState('')

  async function load(){
    const [mats, ests, rel] = await Promise.all([
      api.get('/api/materias'),
      api.get('/api/estudiantes'),
      api.get('/api/matriculas')
    ])
    setMaterias(mats.data||[])
    setEstudiantes(ests.data?.estudiantes||[])
    setLista(rel.data||[])
  }
  useEffect(()=>{ load() }, [])

  async function submit(e){
    e.preventDefault(); setError('')
    try{
      const payload = { ...form, creditos: Number(form.creditos||0) }
      if(editId){ await api.put('/api/matriculas/'+editId, payload) }
      else { await api.post('/api/matriculas', payload) }
      setForm({...empty}); setEditId(null); load()
    }catch(e){ setError(e?.response?.data?.message || 'Error guardando matrícula') }
  }

  function startEdit(it){
    setEditId(it.id)
    setForm({
      codigo: it.codigo, descripcion: it.descripcion, creditos: String(it.creditos),
      estudianteId: it.estudianteId ?? it.estudiante?.id, materiaId: it.materiaId ?? it.materia?.id
    })
  }

  async function remove(id){ if(!confirm('¿Eliminar matrícula?')) return; await api.delete('/api/matriculas/'+id); if(editId===id){ setEditId(null); setForm({...empty}) } load() }
  function cancel(){ setEditId(null); setForm({...empty}) }

  return (<>
    <Navbar/>
    <div className="container">
      <div className="card">
        <h1>Matrículas</h1>
        <form onSubmit={submit} className="grid">
          <div><label>Código</label><input value={form.codigo} onChange={e=>setForm({...form, codigo:e.target.value})} required/></div>
          <div style={{gridColumn:'1 / span 2'}}><label>Descripción</label><textarea rows="3" value={form.descripcion} onChange={e=>setForm({...form, descripcion:e.target.value})} required/></div>
          <div><label>Créditos</label><input type="number" min="0" value={form.creditos} onChange={e=>setForm({...form, creditos:e.target.value})} required/></div>
          <div><label>Estudiante</label><select value={form.estudianteId} onChange={e=>setForm({...form, estudianteId:e.target.value})} required>
            <option value="">Seleccione</option>
            {estudiantes.map(e=><option key={e.id} value={e.id}>{e.nombre} {e.apellido}</option>)}
          </select></div>
          <div><label>Materia</label><select value={form.materiaId} onChange={e=>setForm({...form, materiaId:e.target.value})} required>
            <option value="">Seleccione</option>
            {materias.map(m=><option key={m.id} value={m.id}>{m.nombre}</option>)}
          </select></div>
          <div style={{display:'flex',alignItems:'flex-end',gap:8}}>
            <button className="primary">{editId?'Guardar cambios':'Agregar'}</button>
            {editId && <button type="button" onClick={cancel}>Cancelar</button>}
          </div>
        </form>

        <table className="table">
          <thead><tr><th>ID</th><th>Código</th><th>Descripción</th><th>Créditos</th><th>Estudiante</th><th>Materia</th><th>Acciones</th></tr></thead>
          <tbody>
            {lista.map(it=>(
              <tr key={it.id}>
                <td>{it.id}</td><td>{it.codigo}</td><td>{it.descripcion}</td><td>{it.creditos}</td>
                <td>{it.estudiante?.nombre} {it.estudiante?.apellido}</td>
                <td>{it.materia?.nombre}</td>
                <td className="actions"><button onClick={()=>startEdit(it)}>Editar</button><button className="danger" onClick={()=>remove(it.id)}>Eliminar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {error && <div style={{color:'#b91c1c'}}>{error}</div>}
      </div>
    </div>
  </>)
}
