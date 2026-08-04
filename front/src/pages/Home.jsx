import { useData } from '../context/DataContext.jsx'
import CategoryCard from '../components/CategoryCard/CategoryCard.jsx'
import styles from './Home.module.css'

export default function Home() {
  const { categories, loading, error } = useData()

  if (loading) return <div className={styles.loading}>Cargando catálogo...</div>
  if (error) return <div className={styles.error}>{error}</div>

  return (
    <main className={styles.main}>
      <div className="container">
        <div className={styles.hero}>
          <h1 className={styles.heroTitle}>Catálogo de Licores</h1>
          <p className={styles.heroSub}>
            Explorá nuestra selección premium de vinos, whiskys, gins, vodkas y más
          </p>
          <div className={styles.heroDivider} />
        </div>

        <section>
          <h2 className={styles.sectionTitle}>Categorías</h2>
          <div className={styles.grid}>
            {categories.map(cat => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </section>

        <div className={styles.notice}>
          <p>VENTA POR UNIDAD / CAJA CERRADA · BEBER CON MODERACIÓN</p>
        </div>
      </div>
    </main>
  )
}
