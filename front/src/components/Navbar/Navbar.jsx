import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useData } from '../../context/DataContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { categories } = useData()
  const { isAuthenticated, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  const isAdmin = location.pathname.startsWith('/admin')

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>🍾</span>
          <span className={styles.logoText}>Catálogo de Licores</span>
        </Link>
        <nav className={styles.nav}>
          <Link to="/" className={`${styles.navLink} ${location.pathname === '/' ? styles.active : ''}`}>
            Inicio
          </Link>
          {categories.slice(0, 4).map(cat => (
            <Link
              key={cat.id}
              to={`/categoria/${cat.slug}`}
              className={`${styles.navLink} ${location.pathname === `/categoria/${cat.slug}` ? styles.active : ''}`}
            >
              {cat.name}
            </Link>
          ))}
          {isAuthenticated && isAdmin ? (
            <button onClick={handleLogout} className={styles.navLogout}>
              Cerrar sesión
            </button>
          ) : (
            <Link to="/login" className={styles.navAdmin}>
              Admin
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
