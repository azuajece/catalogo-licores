import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useData } from '../context/DataContext.jsx'
import ProductCard from '../components/ProductCard/ProductCard.jsx'
import styles from './CategoryPage.module.css'

export default function CategoryPage() {
  const { slug } = useParams()
  const { categories, products, loading } = useData()
  const [search, setSearch] = useState('')

  if (loading) return <div className={styles.loading}>Cargando...</div>

  const category = categories.find(c => c.slug === slug)
  if (!category) return (
    <div className={styles.notFound}>
      <p>Categoría no encontrada.</p>
      <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>Volver al inicio</Link>
    </div>
  )

  const categoryProducts = products.filter(p => p.categoryIds.includes(category.id))
  const filtered = search.trim()
    ? categoryProducts.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    : categoryProducts

  return (
    <main className={styles.main}>
      <div className="container">
        <div className={styles.breadcrumb}>
          <Link to="/" className={styles.breadLink}>Inicio</Link>
          <span className={styles.breadSep}>›</span>
          <span className={styles.breadCurrent}>{category.name}</span>
        </div>

        <div className={styles.header}>
          <span className={styles.headerIcon}>{category.icon}</span>
          <div>
            <h1 className={styles.title}>{category.name}</h1>
            <p className={styles.subtitle}>{category.description}</p>
          </div>
        </div>

        <div className={styles.toolbar}>
          <div className={styles.searchWrap}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              className={styles.searchInput}
              type="text"
              placeholder={`Buscar en ${category.name}...`}
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoFocus
            />
            {search && (
              <button className={styles.clearBtn} onClick={() => setSearch('')} aria-label="Limpiar">✕</button>
            )}
          </div>
          <p className={styles.count}>
            {search
              ? `${filtered.length} resultado${filtered.length !== 1 ? 's' : ''} de ${categoryProducts.length}`
              : `${categoryProducts.length} producto${categoryProducts.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <span>😕</span>
            <p>No se encontraron productos para <strong>"{search}"</strong></p>
            <button className="btn btn-secondary" onClick={() => setSearch('')}>Ver todos</button>
          </div>
        ) : (
          <div className={styles.grid}>
            {filtered.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
