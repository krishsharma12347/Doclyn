import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import { useAuth } from '../context/AuthContext'
import { getErrorMessage } from '../services/api'

const inputClass =
  'w-full rounded-lg border border-line bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition-all duration-200 placeholder:text-muted/70 hover:border-accent/60 focus:border-accent focus:ring-2 focus:ring-accent/25'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [fieldErrors, setFieldErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const update = (key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }))
    setFieldErrors((prev) => ({ ...prev, [key]: '' }))
  }

  const validate = () => {
    const errors = {}
    if (!form.name.trim()) errors.name = 'Name is required.'
    if (!form.email.trim()) errors.email = 'Email is required.'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Enter a valid email address.'
    if (!form.password) errors.password = 'Password is required.'
    else if (form.password.length < 8) errors.password = 'Use at least 8 characters.'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormError('')
    if (!validate()) return

    setSubmitting(true)
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      })
      // Registration does not sign the user in — send them to /login with a notice.
      navigate('/login', {
        replace: true,
        state: { notice: 'Account created. Log in to continue.' },
      })
    } catch (error) {
      setFormError(getErrorMessage(error, 'Could not create your account. Please try again.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-5 py-16">
      <div className="rounded-lg border border-line bg-surface p-7">
        <h1 className="text-xl font-semibold tracking-tight text-ink">Create your account</h1>
        <p className="mt-1 text-sm text-muted">Takes less than a minute.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-ink">
              Name
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              value={form.name}
              onChange={update('name')}
              placeholder="Your name"
              className={inputClass}
            />
            {fieldErrors.name ? (
              <p className="mt-1.5 text-sm text-error">{fieldErrors.name}</p>
            ) : null}
          </div>

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
              autoComplete="new-password"
              value={form.password}
              onChange={update('password')}
              placeholder="At least 8 characters"
              className={inputClass}
            />
            {fieldErrors.password ? (
              <p className="mt-1.5 text-sm text-error">{fieldErrors.password}</p>
            ) : null}
          </div>

          {formError ? <p className="text-sm text-error">{formError}</p> : null}

          <Button type="submit" fullWidth disabled={submitting}>
            {submitting ? <span className="animate-pulse">Creating account…</span> : 'Create account'}
          </Button>
        </form>

        <p className="mt-6 text-sm text-muted">
          Already registered?{' '}
          <Link
            to="/login"
            className="rounded font-medium text-accent underline-offset-4 transition-colors duration-200 hover:text-accent-hover hover:underline focus:outline-none focus:ring-2 focus:ring-accent/40"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
