import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <p className={styles.title}>LISTA DE PRECIOS 28/07/26</p>
        <p className={styles.warning}>
          BEBER CON MODERACIÓN. PROHIBIDA LA VENTA A MENORES DE 18 AÑOS
        </p>
        <p className={styles.disclaimer}>
          LAS IMÁGENES SON DE CARÁCTER ILUSTRATIVO. LA PRESENTACIÓN DEL PRODUCTO PUEDE VARIAR SEGÚN DISPONIBILIDAD
        </p>
      </div>
    </footer>
  )
}
