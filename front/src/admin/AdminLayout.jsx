import { useLocation } from 'react-router-dom'
import { Link, Outlet } from 'react-router-dom'
import { useData } from '../context/DataContext.jsx'
import styles from './AdminLayout.module.css'

export default function AdminLayout() {
  const location = useLocation()
  const { exportJson } = useData()

  const links = [
    { to: '/admin', label: 'Dashboard', exact: true },
    { to: '/admin/categorias', label: 'Categorías' },
    { to: '/admin/productos', label: 'Productos' },
  ]

  function isActive(link) {
    return link.exact
      ? location.pathname === link.to
      : location.pathname.startsWith(link.to)
  }

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.sideHeader}>
          <span>⚙️</span>
          <span>Panel Admin</span>
        </div>

        <nav className={styles.sideNav}>
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`${styles.sideLink} ${isActive(link) ? styles.active : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className={styles.sideActions}>
          <Link to="/" className={styles.backLink}>← Volver al catálogo</Link>
          <button onClick={exportJson} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            Exportar db.json
          </button>
        </div>
      </aside>

      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  )
}
