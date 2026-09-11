import { Link, useNavigate } from "react-router-dom";
import { LayoutDashboard, LogOut } from "lucide-react";
import Logo from "../ui/Logo";
import NeonButton from "../ui/NeonButton";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 px-4 pt-4">
      <nav className="glass mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-5 py-3">
        <Link to="/">
          <Logo />
        </Link>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:text-ink sm:flex"
              >
                <LayoutDashboard className="size-4" strokeWidth={1.75} />
                Dashboard
              </Link>
              <span className="hidden text-sm text-muted md:inline">{user?.name}</span>
              <NeonButton variant="ghost" onClick={handleLogout}>
                <LogOut className="size-4" strokeWidth={1.75} />
                Logout
              </NeonButton>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:text-ink">
                Log in
              </Link>
              <NeonButton onClick={() => navigate("/register")}>
                Get started
              </NeonButton>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
