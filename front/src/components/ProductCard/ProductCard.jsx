import { useState, useEffect } from 'react'
import { formatPrice, getProductImage } from '../../services/api.js'
import styles from './ProductCard.module.css'

export default function ProductCard({ product }) {
  const [imgError, setImgError] = useState(false)
  // product.image es base64 (guardado desde admin); fallback a archivo estático por ID
  const imgSrc = product.image || getProductImage(product.id, import.meta.env.BASE_URL)

  // Resetear el error si cambia la fuente de imagen (ej: admin actualiza el producto en sesión)
  useEffect(() => { setImgError(false) }, [imgSrc])

  return (
    <div className={styles.card}>
      <div className={styles.imgWrap}>
        {!imgError ? (
          <img
            src={imgSrc}
            alt={product.name}
            className={styles.img}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className={styles.imgPlaceholder}>
            <span>🍾</span>
          </div>
        )}
      </div>
      <div className={styles.body}>
        <h4 className={styles.name}>{product.name}</h4>
        {product.description && (
          <p className={styles.desc}>{product.description}</p>
        )}
        <div className={product.price ? 'badge-price' : 'badge-no-price'}>
          {formatPrice(product.price)}
        </div>
      </div>
    </div>
  )
}
