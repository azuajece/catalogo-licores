import { Link } from 'react-router-dom'
import { useData } from '../context/DataContext.jsx'
import styles from './AdminDashboard.module.css'

export default function AdminDashboard() {
  const { categories, products } = useData()
  const withPrice = products.filter(p => p.price !== null).length

  const stats = [
    { label: 'Categorías', value: categories.length, icon: '📂', to: '/admin/categorias' },
    { label: 'Productos', value: products.length, icon: '🍾', to: '/admin/productos' },
    { label: 'Con precio', value: withPrice, icon: '💰', to: '/admin/productos' },
    { label: 'Sin precio', value: products.length - withPrice, icon: '📋', to: '/admin/productos' },
  ]

  return (
    <div>
      <h1 className="page-title">Dashboard</h1>
      <p className="page-subtitle">Resumen del catálogo</p>

      <div className={styles.statsGrid}>
        {stats.map(s => (
          <Link to={s.to} key={s.label} className={styles.statCard}>
            <span className={styles.statIcon}>{s.icon}</span>
            <span className={styles.statValue}>{s.value}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </Link>
        ))}
      </div>

      <div className={styles.actions}>
        <h2 className={styles.actTitle}>Acciones rápidas</h2>
        <div className={styles.actionBtns}>
          <Link to="/admin/categorias" className="btn btn-secondary">
            Gestionar categorías
          </Link>
          <Link to="/admin/productos" className="btn btn-secondary">
            Gestionar productos
          </Link>
          <Link to="/admin/productos/nuevo" className="btn btn-primary">
            + Nuevo producto
          </Link>
        </div>
      </div>

      <div className={styles.note}>
        <strong>Nota:</strong> Los cambios realizados en el admin son en memoria y no persisten
        al recargar la página. Usá el botón <strong>"Exportar db.json"</strong> del panel lateral
        para descargar el archivo actualizado y reemplazarlo en <code>back/db.json</code> y <code>front/public/db.json</code>.
      </div>
    </div>
  )
}
