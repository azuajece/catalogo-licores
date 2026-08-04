import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import styles from './LoginPage.module.css'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const ok = await login(form.username, form.password)
    setLoading(false)
    if (ok) {
      navigate('/admin', { replace: true })
    } else {
      setError('Usuario o contraseña incorrectos')
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>🍾</span>
          <h1 className={styles.title}>Panel Admin</h1>
          <p className={styles.subtitle}>Catálogo de Licores</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className="alert alert-error">{error}</div>}

          <div className="form-group">
            <label>Usuario</label>
            <input
              type="text"
              autoComplete="username"
              value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              placeholder="Usuario"
              required
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder="Contraseña"
              required
            />
          </div>

          <button
            type="submit"
            className={`btn btn-primary ${styles.submitBtn}`}
            disabled={loading}
          >
            {loading ? 'Verificando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  )
}
