import { useEffect, useState } from 'react'
import api from '../lib/api'
import Navbar from '../components/Navbar'

const empty = { nombre:'', codigo:'', descripcion:'', creditos:'' }

export default function Materias(){
  const [items,setItems] = useState([])
  const [form,setForm] = useState({...empty})
  const [editId,setEditId] = useState(null)
  const [error,setError] = useState('')

  async function load(){
    try{ const {data} = await api.get('/api/materias'); setItems(data||[]) }catch{ setError('Error cargando materias') }
  }
  useEffect(()=>{ load() }, [])

  async function submit(e){
    e.preventDefault(); setError('')
    try{
      const payload = {...form, creditos: Number(form.creditos||0) }
      if(editId){ await api.put('/api/materias/'+editId, payload) }
      else { await api.post('/api/materias', payload) }
      setForm({...empty}); setEditId(null); load()
    }catch(e){ setError(e?.response?.data?.message || 'Error guardando') }
  }

  function startEdit(it){ setEditId(it.id); setForm({ nombre:it.nombre, codigo:it.codigo, descripcion:it.descripcion, creditos:String(it.creditos) }) }
  async function remove(id){ if(!confirm('¿Eliminar materia?')) return; await api.delete('/api/materias/'+id); if(editId===id){setEditId(null); setForm({...empty})} load() }
  function cancel(){ setEditId(null); setForm({...empty}) }

  return (<>
    <Navbar/>
    <div className="container">
      <div className="card">
        <h1>Materias</h1>
        <form onSubmit={submit} className="grid">
          <div><label>Nombre</label><input value={form.nombre} onChange={e=>setForm({...form, nombre:e.target.value})} required/></div>
          <div><label>Código</label><input value={form.codigo} onChange={e=>setForm({...form, codigo:e.target.value})} required/></div>
          <div style={{gridColumn:'1 / span 2'}}><label>Descripción</label><textarea rows="3" value={form.descripcion} onChange={e=>setForm({...form, descripcion:e.target.value})} required/></div>
          <div><label>Créditos</label><input type="number" min="0" value={form.creditos} onChange={e=>setForm({...form, creditos:e.target.value})} required/></div>
          <div style={{display:'flex',alignItems:'flex-end',gap:8}}>
            <button className="primary">{editId?'Guardar cambios':'Agregar'}</button>
            {editId && <button type="button" onClick={cancel}>Cancelar</button>}
          </div>
        </form>

        <table className="table">
          <thead><tr><th>ID</th><th>Nombre</th><th>Código</th><th>Créditos</th><th>Acciones</th></tr></thead>
          <tbody>
            {items.map(it=> (
              <tr key={it.id}>
                <td>{it.id}</td><td>{it.nombre}</td><td>{it.codigo}</td><td>{it.creditos}</td>
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
