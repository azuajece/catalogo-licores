import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { DataProvider } from './context/DataContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import AuthGuard from './components/AuthGuard/AuthGuard.jsx'
import Navbar from './components/Navbar/Navbar.jsx'
import Footer from './components/Footer/Footer.jsx'
import Home from './pages/Home.jsx'
import CategoryPage from './pages/CategoryPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import AdminLayout from './admin/AdminLayout.jsx'
import AdminDashboard from './admin/AdminDashboard.jsx'
import AdminCategorias from './admin/AdminCategorias.jsx'
import AdminProductos from './admin/AdminProductos.jsx'

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter basename="/catalogo-licores">
      <AuthProvider>
        <DataProvider>
          <Routes>
            <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
            <Route path="/categoria/:slug" element={<PublicLayout><CategoryPage /></PublicLayout>} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/admin"
              element={
                <AuthGuard>
                  <Navbar />
                  <AdminLayout />
                </AuthGuard>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="categorias" element={<AdminCategorias />} />
              <Route path="productos" element={<AdminProductos />} />
            </Route>
          </Routes>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
