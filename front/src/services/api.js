// Simulated API layer — wraps DataContext operations with Promise interface
// All mutations are in-memory; use exportJson() from context to persist changes

export function formatPrice(price) {
  if (price === null || price === undefined) return '$----'
  return `$${price.toLocaleString('es-AR')}`
}

export function getProductImage(productId, base) {
  return `${base}images/${productId}.jpg`
}
