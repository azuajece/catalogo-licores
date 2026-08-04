import { useState, useRef } from 'react'
import { useData } from '../context/DataContext.jsx'
import { formatPrice } from '../services/api.js'
import { compressImage } from '../services/imageCompress.js'
import styles from './AdminTable.module.css'
import imgStyles from './ProductImage.module.css'

const EMPTY = { name: '', price: '', categoryIds: [], available: true, description: '' }

function ImageSection({ currentImage, imagePreview, onFileChange }) {
  const inputRef = useRef(null)

  function handleChange(e) {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      alert('Seleccioná un archivo de imagen (jpg, png, webp, etc.)')
      return
    }
    onFileChange(file)
  }

  const displaySrc = imagePreview ?? currentImage ?? null

  return (
    <div className={imgStyles.section}>
      <label className={imgStyles.label}>Imagen del producto</label>

      <div className={imgStyles.previewWrap}>
        {displaySrc ? (
          <img src={displaySrc} alt="preview" className={imgStyles.preview} />
        ) : (
          <div className={imgStyles.placeholder}>
            <span>🍾</span>
            <small>Sin imagen</small>
          </div>
        )}
        {imagePreview && <span className={imgStyles.badge}>Nueva imagen</span>}
        {!imagePreview && currentImage && (
          <span className={`${imgStyles.badge} ${imgStyles.badgeCurrent}`}>Imagen actual</span>
        )}
      </div>

      <button type="button" className="btn btn-secondary btn-sm" onClick={() => inputRef.current?.click()}>
        {displaySrc ? 'Cambiar imagen' : 'Seleccionar imagen'}
      </button>
      <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleChange} />

      <p className={imgStyles.hint}>
        La imagen se guarda dentro del catálogo. Al exportar el JSON quedará incluida.
      </p>
    </div>
  )
}

export default function AdminProductos() {
  const { products, categories, createProduct, updateProduct, deleteProduct, peekNextProductId } = useData()
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState(null)
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('')

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = filterCat ? p.categoryIds.includes(filterCat) : true
    return matchSearch && matchCat
  })

  function openCreate() {
    setForm(EMPTY)
    setImageFile(null)
    setImagePreview(null)
    setModal('create')
  }

  function openEdit(prod) {
    setForm({
      name: prod.name,
      price: prod.price === null ? '' : String(prod.price),
      categoryIds: [...prod.categoryIds],
      available: prod.available,
      description: prod.description || '',
    })
    setImageFile(null)
    setImagePreview(null)
    setModal(prod)
  }

  function closeModal() { setModal(null); setImageFile(null); setImagePreview(null) }

  function toggleCategory(catId) {
    setForm(f => ({
      ...f,
      categoryIds: f.categoryIds.includes(catId)
        ? f.categoryIds.filter(id => id !== catId)
        : [...f.categoryIds, catId],
    }))
  }

  async function handleFileChange(file) {
    setImageFile(file)
    try {
      const base64 = await compressImage(file)
      setImagePreview(base64)
    } catch {
      setImagePreview(URL.createObjectURL(file))
    }
  }

  async function handleSave() {
    if (!form.name.trim()) { setMsg({ type: 'error', text: 'El nombre es obligatorio' }); return }
    if (form.categoryIds.length === 0) { setMsg({ type: 'error', text: 'Seleccioná al menos una categoría' }); return }

    setSaving(true)

    let compressedImage = modal === 'create' ? undefined : modal?.image
    if (imageFile) {
      try {
        compressedImage = await compressImage(imageFile)
      } catch {
        compressedImage = undefined
      }
    }

    const data = {
      name: form.name.trim().toUpperCase(),
      price: form.price === '' ? null : Number(form.price),
      categoryIds: form.categoryIds,
      available: form.available,
      description: form.description.trim(),
      ...(compressedImage !== undefined && { image: compressedImage }),
    }

    if (modal === 'create') {
      const id = peekNextProductId()
      createProduct({ ...data, id })
    } else {
      updateProduct(modal.id, data)
    }

    setMsg({ type: 'success', text: modal === 'create' ? 'Producto creado.' : 'Producto actualizado.' })
    setSaving(false)
    closeModal()
  }

  function handleDelete(prod) {
    if (!confirm(`¿Eliminar "${prod.name}"?`)) return
    deleteProduct(prod.id)
    setMsg({ type: 'success', text: 'Producto eliminado' })
  }

  function getCatNames(ids) {
    return ids.map(id => categories.find(c => c.id === id)?.name).filter(Boolean).join(', ')
  }

  const currentImage = modal && modal !== 'create' ? modal.image : undefined

  return (
    <div>
      <div className={styles.topBar}>
        <div>
          <h1 className="page-title">Productos</h1>
          <p className="page-subtitle">{filtered.length} de {products.length} productos</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ Nuevo producto</button>
      </div>

      {msg && (
        <div className={`alert alert-${msg.type}`} onClick={() => setMsg(null)} style={{ cursor: 'pointer' }}>
          {msg.text}
        </div>
      )}

      <div className={styles.filters}>
        <input placeholder="Buscar por nombre..." value={search} onChange={e => setSearch(e.target.value)} />
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)}>
          <option value="">Todas las categorías</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Imagen</th><th>Nombre</th><th>Precio</th><th>Categorías</th><th>Disp.</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(prod => (
              <tr key={prod.id}>
                <td><ThumbImage product={prod} /></td>
                <td style={{ color: 'white', fontWeight: 500, fontSize: '0.82rem' }}>{prod.name}</td>
                <td style={{ color: prod.price ? 'var(--color-gold)' : '#555' }}>{formatPrice(prod.price)}</td>
                <td style={{ fontSize: '0.78rem' }}>{getCatNames(prod.categoryIds)}</td>
                <td>{prod.available ? '✅' : '❌'}</td>
                <td>
                  <div className={styles.actions}>
                    <button className="btn btn-secondary btn-sm" onClick={() => openEdit(prod)}>Editar</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(prod)}>Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="modal">
            <h2>{modal === 'create' ? 'Nuevo producto' : 'Editar producto'}</h2>

            <ImageSection
              currentImage={currentImage}
              imagePreview={imagePreview}
              onFileChange={handleFileChange}
            />

            <div className="form-group">
              <label>Nombre *</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ej: BRAVIO MALBEC" />
            </div>
            <div className="form-group">
              <label>Precio (dejar vacío si no tiene precio)</label>
              <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="Ej: 3340" />
            </div>
            <div className="form-group">
              <label>Descripción</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Descripción opcional" />
            </div>
            <div className="form-group">
              <label>Categorías * (puede seleccionar varias)</label>
              <div className={styles.multiCheck}>
                {categories.map(cat => (
                  <label key={cat.id} className={styles.checkLabel}>
                    <input type="checkbox" checked={form.categoryIds.includes(cat.id)} onChange={() => toggleCategory(cat.id)} />
                    {cat.icon} {cat.name}
                  </label>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className={styles.checkLabel} style={{ flexDirection: 'row', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.available} onChange={e => setForm(f => ({ ...f, available: e.target.checked }))} />
                Disponible
              </label>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={closeModal} disabled={saving}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ThumbImage({ product }) {
  const [ok, setOk] = useState(true)
  if (product.image) {
    return <img src={product.image} alt="" style={{ width: 36, height: 36, objectFit: 'contain', borderRadius: 4 }} />
  }
  if (!ok) return <span style={{ fontSize: '1.3rem' }}>🍾</span>
  return (
    <img
      src={`${import.meta.env.BASE_URL}images/${product.id}.jpg`}
      alt=""
      style={{ width: 36, height: 36, objectFit: 'contain', borderRadius: 4, background: '#f5f5f5' }}
      onError={() => setOk(false)}
    />
  )
}
