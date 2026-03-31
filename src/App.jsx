import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Login from './components/Login'
import Navbar from './components/Navbar'
import ProductForm from './components/ProductForm'
import ProductList from './components/ProductList'
import ProtectedRoute from './components/ProtectedRoute'
import Register from './components/Register'
import { getCurrentUser } from './utils/storage'

function App() {
  const location = useLocation()
  const currentUser = getCurrentUser()
  const showNavbar = currentUser && location.pathname.startsWith('/products')

  return (
    <div className="min-h-screen bg-slate-100">
      {showNavbar && <Navbar user={currentUser} />}

      <Routes>
        <Route path="/" element={<Navigate to={currentUser ? '/products' : '/login'} replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <ProductList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/new"
          element={
            <ProtectedRoute>
              <ProductForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/:id/edit"
          element={
            <ProtectedRoute>
              <ProductForm />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to={currentUser ? '/products' : '/login'} replace />} />
      </Routes>
    </div>
  )
}

export default App
