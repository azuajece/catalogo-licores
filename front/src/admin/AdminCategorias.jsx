import { useState } from 'react'
import { useData } from '../context/DataContext.jsx'
import styles from './AdminTable.module.css'

const EMPTY = { name: '', slug: '', icon: '', description: '' }

export default function AdminCategorias() {
  const { categories, products, createCategory, updateCategory, deleteCategory } = useData()
  const [modal, setModal] = useState(null) // null | 'create' | { ...category }
  const [form, setForm] = useState(EMPTY)
  const [msg, setMsg] = useState(null)

  function openCreate() {
    setForm(EMPTY)
    setModal('create')
  }

  function openEdit(cat) {
    setForm({ name: cat.name, slug: cat.slug, icon: cat.icon, description: cat.description })
    setModal(cat)
  }

  function handleSave() {
    if (!form.name.trim() || !form.slug.trim()) {
      setMsg({ type: 'error', text: 'Nombre y slug son obligatorios' })
      return
    }
    if (modal === 'create') {
      createCategory(form)
      setMsg({ type: 'success', text: 'Categoría creada correctamente' })
    } else {
      updateCategory(modal.id, form)
      setMsg({ type: 'success', text: 'Categoría actualizada correctamente' })
    }
    setModal(null)
  }

  function handleDelete(cat) {
    const count = products.filter(p => p.categoryIds.includes(cat.id)).length
    if (!confirm(`¿Eliminar "${cat.name}"? Tiene ${count} productos asociados. Los productos no serán eliminados.`)) return
    deleteCategory(cat.id)
    setMsg({ type: 'success', text: 'Categoría eliminada' })
  }

  function slugify(name) {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  }

  function handleNameChange(e) {
    const name = e.target.value
    setForm(f => ({ ...f, name, slug: f.slug || slugify(name) }))
  }

  return (
    <div>
      <div className={styles.topBar}>
        <div>
          <h1 className="page-title">Categorías</h1>
          <p className="page-subtitle">{categories.length} categorías registradas</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ Nueva categoría</button>
      </div>

      {msg && (
        <div className={`alert alert-${msg.type}`} onClick={() => setMsg(null)}>
          {msg.text}
        </div>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Ícono</th>
              <th>Nombre</th>
              <th>Slug</th>
              <th>Descripción</th>
              <th>Productos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => {
              const count = products.filter(p => p.categoryIds.includes(cat.id)).length
              return (
                <tr key={cat.id}>
                  <td style={{ fontSize: '1.4rem' }}>{cat.icon}</td>
                  <td style={{ color: 'white', fontWeight: 600 }}>{cat.name}</td>
                  <td><code className={styles.code}>{cat.slug}</code></td>
                  <td className={styles.descCell}>{cat.description}</td>
                  <td style={{ color: 'var(--color-gold)' }}>{count}</td>
                  <td>
                    <div className={styles.actions}>
                      <button className="btn btn-secondary btn-sm" onClick={() => openEdit(cat)}>Editar</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(cat)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="modal">
            <h2>{modal === 'create' ? 'Nueva categoría' : 'Editar categoría'}</h2>
            <div className="form-group">
              <label>Nombre *</label>
              <input value={form.name} onChange={handleNameChange} placeholder="Ej: Vinos" />
            </div>
            <div className="form-group">
              <label>Slug * (URL)</label>
              <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="Ej: vinos" />
            </div>
            <div className="form-group">
              <label>Ícono (emoji)</label>
              <input value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} placeholder="Ej: 🍷" />
            </div>
            <div className="form-group">
              <label>Descripción</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Descripción breve de la categoría" />
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setModal(null)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleSave}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
