import { useEffect, useState } from 'react'
import api from '../lib/api'
import Navbar from '../components/Navbar'

const empty = { nombre:'', apellido:'', cedula:'', fechaNacimiento:'', ciudad:'', direccion:'', telefono:'', email:'' }

export default function Estudiantes(){
  const [items,setItems] = useState([])
  const [search,setSearch] = useState('')
  const [form,setForm] = useState({...empty})
  const [editId,setEditId] = useState(null)
  const [error,setError] = useState('')

  async function load(){
    try{
      const { data } = await api.get('/api/estudiantes',{ params:{ search } })
      setItems(data.estudiantes||[])
    }catch{ setError('Error cargando estudiantes') }
  }
  useEffect(()=>{ load() },[])

  async function submit(e){
    e.preventDefault(); setError('')
    try{
      if(editId){ await api.put('/api/estudiantes/'+editId, form) }
      else { await api.post('/api/estudiantes', form) }
      setForm({...empty}); setEditId(null); load()
    }catch(e){ setError(e?.response?.data?.message || 'Error guardando') }
  }

  function startEdit(it){
    setEditId(it.id)
    setForm({
      nombre: it.nombre, apellido: it.apellido, cedula: it.cedula,
      fechaNacimiento: it.fechaNacimiento?.slice(0,10) || '',
      ciudad: it.ciudad, direccion: it.direccion, telefono: it.telefono, email: it.email
    })
  }

  async function remove(id){
    if(!confirm('¿Eliminar estudiante?')) return
    await api.delete('/api/estudiantes/'+id)
    if(editId===id){ setEditId(null); setForm({...empty}) }
    load()
  }

  function cancel(){ setEditId(null); setForm({...empty}) }

  return (<>
    <Navbar/>
    <div className="container">
      <div className="card">
        <h1>Estudiantes</h1>
        <form onSubmit={submit} className="grid" style={{gridTemplateColumns:'1fr 1fr'}}>
          <div><label>Nombre</label><input value={form.nombre} onChange={e=>setForm({...form, nombre:e.target.value})} required/></div>
          <div><label>Apellido</label><input value={form.apellido} onChange={e=>setForm({...form, apellido:e.target.value})} required/></div>
          <div><label>Cédula</label><input value={form.cedula} onChange={e=>setForm({...form, cedula:e.target.value})} required/></div>
          <div><label>Fecha Nacimiento</label><input type="date" value={form.fechaNacimiento} onChange={e=>setForm({...form, fechaNacimiento:e.target.value})} required/></div>
          <div><label>Ciudad</label><input value={form.ciudad} onChange={e=>setForm({...form, ciudad:e.target.value})} required/></div>
          <div><label>Dirección</label><input value={form.direccion} onChange={e=>setForm({...form, direccion:e.target.value})} required/></div>
          <div><label>Teléfono</label><input value={form.telefono} onChange={e=>setForm({...form, telefono:e.target.value})} required/></div>
          <div><label>Email</label><input type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required/></div>
          <div style={{display:'flex',alignItems:'flex-end',gap:8}}>
            <button className="primary">{editId?'Guardar cambios':'Agregar'}</button>
            {editId && <button type="button" onClick={cancel}>Cancelar</button>}
          </div>
        </form>

        <div style={{marginTop:12}}>
          <input placeholder="Buscar por nombre, apellido, email o cédula..." value={search} onChange={e=>setSearch(e.target.value)}/>
          <button style={{marginLeft:8}} onClick={load}>Buscar</button>
        </div>

        <table className="table">
          <thead><tr><th>ID</th><th>Nombre</th><th>Apellido</th><th>Cédula</th><th>Email</th><th>Teléfono</th><th>Acciones</th></tr></thead>
          <tbody>
            {items.map(it=>(
              <tr key={it.id}>
                <td>{it.id}</td>
                <td>{it.nombre}</td>
                <td>{it.apellido}</td>
                <td>{it.cedula}</td>
                <td>{it.email}</td>
                <td>{it.telefono}</td>
                <td className="actions">
                  <button onClick={()=>startEdit(it)}>Editar</button>
                  <button className="danger" onClick={()=>remove(it.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {error && <div style={{color:'#b91c1c'}}>{error}</div>}
      </div>
    </div>
  </>)
}
