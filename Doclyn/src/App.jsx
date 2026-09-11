import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import AmbientBackground from "./components/ui/AmbientBackground";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthLayout from "./pages/AuthLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Heavier / less-visited pages load on demand, not in the initial bundle.
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ToolPage = lazy(() => import("./pages/ToolPage"));

function PageFallback() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24">
      <div className="glass animate-pulse-soft h-40 rounded-2xl border border-line" />
    </div>
  );
}

export default function App() {
  return (
    <div className="relative min-h-screen">
      <AmbientBackground />
      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />

              <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Route>

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tools/:tool"
                element={
                  <ProtectedRoute>
                    <ToolPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </div>
  );
}
