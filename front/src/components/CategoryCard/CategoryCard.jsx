import { Link } from 'react-router-dom'
import { useData } from '../../context/DataContext.jsx'
import styles from './CategoryCard.module.css'

export default function CategoryCard({ category, index = 0 }) {
  const { products } = useData()
  const count = products.filter(p => p.categoryIds.includes(category.id)).length

  return (
    <div data-aos="fade-up" data-aos-delay={index * 80}>
      <Link to={`/categoria/${category.slug}`} className={styles.card}>
        <div className={styles.iconWrap}>
          <span className={styles.icon}>{category.icon}</span>
        </div>
        <h3 className={styles.name}>{category.name}</h3>
        <p className={styles.count}>{count} producto{count !== 1 ? 's' : ''}</p>
        <p className={styles.desc}>{category.description}</p>
        <span className={styles.cta}>Ver catálogo →</span>
      </Link>
    </div>
  )
}
