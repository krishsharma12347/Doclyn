import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import NeonButton from "../components/ui/NeonButton";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../services/api";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const update = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await register(form);
      // Register does not log the user in — send them to login with a hint.
      navigate("/login", { state: { justRegistered: true } });
    } catch (err) {
      setError(getErrorMessage(err, "Could not create your account."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <h1 className="text-center text-xl font-semibold text-ink">Create your account</h1>
      <p className="mt-1 text-center text-sm text-muted">Start processing PDFs in seconds</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">Name</label>
          <input
            required
            value={form.name}
            onChange={update("name")}
            className="glass w-full rounded-xl border border-line px-3.5 py-2.5 text-sm text-ink outline-none focus:border-accent"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={update("email")}
            className="glass w-full rounded-xl border border-line px-3.5 py-2.5 text-sm text-ink outline-none focus:border-accent"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">Password</label>
          <input
            type="password"
            required
            minLength={8}
            value={form.password}
            onChange={update("password")}
            className="glass w-full rounded-xl border border-line px-3.5 py-2.5 text-sm text-ink outline-none focus:border-accent"
            placeholder="At least 8 characters"
          />
        </div>

        {error ? (
          <div className="flex items-center gap-2 rounded-lg border border-error/30 bg-error/10 px-3 py-2 text-xs text-error">
            <AlertCircle className="size-3.5 shrink-0" strokeWidth={1.75} />
            {error}
          </div>
        ) : null}

        <NeonButton type="submit" disabled={busy} className="w-full justify-center">
          {busy ? "Creating account…" : "Create account"}
        </NeonButton>
      </form>

      <p className="mt-5 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-accent-2 hover:underline">
          Log in
        </Link>
      </p>
    </>
  );
}
