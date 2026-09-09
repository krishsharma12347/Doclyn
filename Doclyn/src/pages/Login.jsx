import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import Button from '../components/Button'
import { useAuth } from '../context/AuthContext'
import { getErrorMessage } from '../services/api'

const inputClass =
  'w-full rounded-lg border border-line bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition-all duration-200 placeholder:text-muted/70 hover:border-accent/60 focus:border-accent focus:ring-2 focus:ring-accent/25'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const successNotice = location.state?.notice
  const redirectTo = location.state?.from || '/'

  const [form, setForm] = useState({ email: '', password: '' })
  const [fieldErrors, setFieldErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const update = (key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }))
    setFieldErrors((prev) => ({ ...prev, [key]: '' }))
  }

  const validate = () => {
    const errors = {}
    if (!form.email.trim()) errors.email = 'Email is required.'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Enter a valid email address.'
    if (!form.password) errors.password = 'Password is required.'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormError('')
    if (!validate()) return

    setSubmitting(true)
    try {
      await login(form.email.trim(), form.password)
      navigate(redirectTo, { replace: true })
    } catch (error) {
      setFormError(getErrorMessage(error, 'Could not log you in. Check your credentials.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-5 py-16">
      <div className="rounded-lg border border-line bg-surface p-7">
        <h1 className="text-xl font-semibold tracking-tight text-ink">Log in to Doclyn</h1>
        <p className="mt-1 text-sm text-muted">Access your PDF tools.</p>

        {successNotice ? (
          <div className="mt-5 flex items-start gap-2 rounded-lg border border-success/40 px-3.5 py-3">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" strokeWidth={2} />
            <p className="text-sm text-ink">{successNotice}</p>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={update('email')}
              placeholder="you@company.com"
              className={inputClass}
            />
            {fieldErrors.email ? (
              <p className="mt-1.5 text-sm text-error">{fieldErrors.email}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ink">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={update('password')}
              placeholder="••••••••"
              className={inputClass}
            />
            {fieldErrors.password ? (
              <p className="mt-1.5 text-sm text-error">{fieldErrors.password}</p>
            ) : null}
          </div>

          {formError ? <p className="text-sm text-error">{formError}</p> : null}

          <Button type="submit" fullWidth disabled={submitting}>
            {submitting ? <span className="animate-pulse">Logging in…</span> : 'Log in'}
          </Button>
        </form>

        <p className="mt-6 text-sm text-muted">
          No account yet?{' '}
          <Link
            to="/register"
            className="rounded font-medium text-accent underline-offset-4 transition-colors duration-200 hover:text-accent-hover hover:underline focus:outline-none focus:ring-2 focus:ring-accent/40"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}
