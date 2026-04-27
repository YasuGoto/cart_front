import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { AppLayout } from './components/AppLayout'
import { CartPage } from './pages/CartPage'
import { LoginPage } from './pages/LoginPage'
import { OrderCompletePage } from './pages/OrderCompletePage'
import { ProductDetailRoute } from './pages/ProductDetailRoute'
import { ProductListPage } from './pages/ProductListPage'
import { RegisterPage } from './pages/RegisterPage'
import { RequireAuth } from './routes/RequireAuth'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route index element={<ProductListPage />} />
        <Route path="/products/:id" element={<ProductDetailRoute />} />
        <Route
          path="/cart"
          element={
            <RequireAuth>
              <CartPage />
            </RequireAuth>
          }
        />
        <Route
          path="/orders/complete"
          element={
            <RequireAuth>
              <OrderCompletePage />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
