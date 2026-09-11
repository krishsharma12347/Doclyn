import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'

// Entry points load eagerly.
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'

// Tool pages are split into their own chunks.
const MergeTool = lazy(() => import('./pages/MergeTool'))
const SplitTool = lazy(() => import('./pages/SplitTool'))
const CompressTool = lazy(() => import('./pages/CompressTool'))

function RouteFallback() {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-14">
      <div className="space-y-4">
        <div className="h-8 w-52 animate-pulse rounded-lg bg-line" />
        <div className="h-40 w-full animate-pulse rounded-lg bg-line/70" />
        <div className="h-10 w-32 animate-pulse rounded-lg bg-line" />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Navbar />

      <main className="flex flex-1 flex-col">
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/tools/merge"
              element={
                <ProtectedRoute>
                  <MergeTool />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tools/split"
              element={
                <ProtectedRoute>
                  <SplitTool />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tools/compress"
              element={
                <ProtectedRoute>
                  <CompressTool />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
    </div>
  )
}
