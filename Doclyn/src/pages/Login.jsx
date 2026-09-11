import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import NeonButton from "../components/ui/NeonButton";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../services/api";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(email, password);
      navigate(location.state?.from || "/dashboard", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, "Invalid email or password."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <h1 className="text-center text-xl font-semibold text-ink">Welcome back</h1>
      <p className="mt-1 text-center text-sm text-muted">Log in to continue to Doclyn</p>

      {location.state?.justRegistered ? (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 px-3 py-2 text-xs text-success">
          <CheckCircle2 className="size-3.5 shrink-0" strokeWidth={1.75} />
          Account created — log in to continue.
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="glass w-full rounded-xl border border-line px-3.5 py-2.5 text-sm text-ink outline-none focus:border-accent"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="glass w-full rounded-xl border border-line px-3.5 py-2.5 text-sm text-ink outline-none focus:border-accent"
            placeholder="••••••••"
          />
        </div>

        {error ? (
          <div className="flex items-center gap-2 rounded-lg border border-error/30 bg-error/10 px-3 py-2 text-xs text-error">
            <AlertCircle className="size-3.5 shrink-0" strokeWidth={1.75} />
            {error}
          </div>
        ) : null}

        <NeonButton type="submit" disabled={busy} className="w-full justify-center">
          {busy ? "Logging in…" : "Log in"}
        </NeonButton>
      </form>

      <p className="mt-5 text-center text-sm text-muted">
        Don't have an account?{" "}
        <Link to="/register" className="font-medium text-accent-2 hover:underline">
          Register
        </Link>
      </p>
    </>
  );
}
