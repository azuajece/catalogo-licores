import { createContext, useContext, useState, useEffect } from 'react'

const DataContext = createContext(null)

export function DataProvider({ children }) {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}db.json`)
      .then(r => {
        if (!r.ok) throw new Error('No se pudo cargar el catálogo')
        return r.json()
      })
      .then(data => {
        setCategories(data.categories)
        setProducts(data.products)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  function getNextId(list, prefix) {
    if (list.length === 0) return `${prefix}-001`
    const nums = list.map(item => parseInt(item.id.split('-')[1], 10))
    const max = Math.max(...nums)
    return `${prefix}-${String(max + 1).padStart(3, '0')}`
  }

  // --- Categories CRUD ---
  function createCategory(data) {
    const newCat = { id: getNextId(categories, 'cat'), ...data }
    setCategories(prev => [...prev, newCat])
    return newCat
  }

  function updateCategory(id, data) {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...data } : c))
  }

  function deleteCategory(id) {
    setCategories(prev => prev.filter(c => c.id !== id))
    setProducts(prev => prev.map(p => ({
      ...p,
      categoryIds: p.categoryIds.filter(cid => cid !== id)
    })))
  }

  function peekNextProductId() {
    return getNextId(products, 'prod')
  }

  // --- Products CRUD ---
  function createProduct(data) {
    const id = data.id ?? getNextId(products, 'prod')
    const newProd = { ...data, id }
    setProducts(prev => [...prev, newProd])
    return newProd
  }

  function updateProduct(id, data) {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...data } : p))
  }

  function deleteProduct(id) {
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify({ categories, products }, null, 2)], {
      type: 'application/json'
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'db.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <DataContext.Provider value={{
      categories, products, loading, error,
      createCategory, updateCategory, deleteCategory,
      createProduct, updateProduct, deleteProduct,
      peekNextProductId,
      exportJson,
    }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used inside DataProvider')
  return ctx
}
