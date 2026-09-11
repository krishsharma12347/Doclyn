import { Outlet, Link } from "react-router-dom";
import Logo from "../components/ui/Logo";

export default function AuthLayout() {
  return (
    <div className="flex min-h-[calc(100vh-88px)] items-center justify-center px-4 py-12">
      <div className="glass-strong fade-up w-full max-w-sm rounded-2xl p-7">
        <Link to="/" className="mb-6 flex justify-center">
          <Logo />
        </Link>
        <Outlet />
      </div>
    </div>
  );
}
