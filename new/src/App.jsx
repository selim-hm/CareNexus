import { useState, useEffect, lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './scss/global.scss'
import Loader from './components/loader/Loader'
import AuthInitializer from './components/common/AuthInitializer/AuthInitializer'

const ScrollToTop = lazy(() => import('./hooks/ScrollToTop'))
const GlobalAssistant = lazy(() => import('./components/common/GlobalAssistant/GlobalAssistant'))

// Centralized Routes (Lazy Loaded)
const PublicRoutes = lazy(() => import('./pages/public/PublicRoutes'))
const AuthRoutes = lazy(() => import('./pages/Auth/AuthRoutes'))

// Role-Based Routes (Lazy Loaded)
const DoctorRoute = lazy(() => import('./pages/Doctor/Route'))
const PatientRoute = lazy(() => import('./pages/Patient/Route'))
const PharmacyRoute = lazy(() => import('./pages/Pharmacy/Route'))
const AdminRoute = lazy(() => import('./pages/Admin/Route'))
const ShippingCompanyRoute = lazy(() => import('./pages/ShippingCompany/Route'))
const NotFound = lazy(() => import('./pages/public/NotFound/NotFound'))

import ProtectedRoute from './components/common/ProtectedRoute/ProtectedRoute'

function App() {
  const [loading, setLoading] = useState(true)
  const { t, i18n } = useTranslation()
  const location = useLocation()

  // App initialization loader
  useEffect(() => {
    setLoading(false)
  }, [])

  // Dynamic Title Management
  useEffect(() => {
    const getTitleKey = (pathname) => {
      const parts = pathname.split('/').filter(p => p)
      if (parts.length === 0) return 'home'
      if (parts[0] === 'auth' && parts[1]) return parts[1].replace('-', '_')
      return parts[0].replace('-', '_')
    }

    const titleKey = getTitleKey(location.pathname)
    const title = t(`titles.${titleKey}`, { defaultValue: t('titles.home') })
    document.title = title
  }, [location.pathname, i18n.language, t])

  // Global direction sync (RTL/LTR)
  useEffect(() => {
    const currentLang = i18n.language;
    document.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;
  }, [i18n.language]);

  return (
    <>
      {/* Restores Redux auth state from localStorage on every page load */}
      <AuthInitializer />
      <Toaster position="top-center" reverseOrder={false} />

      <ScrollToTop />
      <main>
        <div className="main-wrapper">
          <Suspense fallback={<Loader loading={true} />}>
            <Routes>
              {/* Auth routes (Login, Register, etc.) */}
              <Route path="/auth/*" element={<AuthRoutes />} />

              {/* Public Routes */}
              <Route path="/*" element={<PublicRoutes />} />

              {/* Protected Role-Based Routes */}
              <Route
                path="/doctor/*"
                element={<ProtectedRoute allowedRoles={['doctor', 'nursing']}><DoctorRoute /></ProtectedRoute>}
              />
              <Route
                path="/patient/*"
                element={<ProtectedRoute allowedRoles={['patient']}><PatientRoute /></ProtectedRoute>}
              />
              <Route
                path="/pharmacy/*"
                element={<ProtectedRoute allowedRoles={['pharmacy']}><PharmacyRoute /></ProtectedRoute>}
              />
              <Route
                path="/admin/*"
                element={<ProtectedRoute allowedRoles={['admin']}><AdminRoute /></ProtectedRoute>}
              />
              <Route
                path="/shipping-company/*"
                element={<ProtectedRoute allowedRoles={['shipping_company']}><ShippingCompanyRoute /></ProtectedRoute>}
              />

              {/* Catch-all 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>

          <Suspense fallback={null}>
            <GlobalAssistant />
          </Suspense>
        </div>
      </main>
    </>
  )
}

export default App
