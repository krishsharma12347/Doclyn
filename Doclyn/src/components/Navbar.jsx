import { Link, NavLink, useNavigate } from 'react-router-dom'
import { FileStack, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Button from './Button'

const navLinkClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/40 ${
    isActive
      ? 'bg-accent-tint text-accent font-medium'
      : 'text-muted hover:text-accent hover:bg-accent-tint'
  }`

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-canvas/95 backdrop-blur-[2px]">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link
          to="/"
          className="group flex items-center gap-2 rounded-lg px-1 py-1 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/40"
        >
          <span className="flex size-8 items-center justify-center rounded-lg border border-line bg-surface transition-all duration-200 group-hover:border-accent">
            <FileStack className="size-4 text-accent" strokeWidth={1.75} />
          </span>
          <span className="text-base font-semibold tracking-tight text-ink">Doclyn</span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <NavLink to="/tools/merge" className={navLinkClass}>
            Merge
          </NavLink>
          <NavLink to="/tools/split" className={navLinkClass}>
            Split
          </NavLink>
          <NavLink to="/tools/compress" className={navLinkClass}>
            Compress
          </NavLink>

          <span className="mx-2 hidden h-6 w-px bg-line sm:block" />

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="hidden font-mono text-xs text-muted sm:block">
                {user?.email || user?.name || 'signed in'}
              </span>
              <Button variant="secondary" onClick={handleLogout}>
                <LogOut className="size-4" strokeWidth={1.75} />
                Log out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <NavLink to="/login" className={navLinkClass}>
                Log in
              </NavLink>
              <Link
                to="/register"
                className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent/40 focus:ring-offset-2 focus:ring-offset-canvas"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}
