import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/common/ProtectedRoute'
import { Navbar } from './components/layout/Navbar'

import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ProfilePage from './pages/auth/ProfilePage'
import ProductsPage from './pages/products/ProductsPage'
import CartPage from './pages/cart/CartPage'
import OrdersPage from './pages/orders/OrdersPage'
import AdminPage from './pages/admin/AdminPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected - any user */}
            <Route path="/" element={
              <ProtectedRoute><ProductsPage /></ProtectedRoute>
            } />
            <Route path="/cart" element={
              <ProtectedRoute><CartPage /></ProtectedRoute>
            } />
            <Route path="/orders" element={
              <ProtectedRoute><OrdersPage /></ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute><ProfilePage /></ProtectedRoute>
            } />

            {/* Admin only */}
            <Route path="/admin" element={
              <ProtectedRoute adminOnly><AdminPage /></ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      </BrowserRouter>
    </AuthProvider>
  )
}
