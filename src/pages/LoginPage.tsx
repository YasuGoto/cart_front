import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { login } from '../lib/api'
import { setAccessToken } from '../lib/auth'
import { normalizeError } from '../lib/error'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = useMemo(() => {
    const v = (location.state as { from?: unknown } | null)?.from
    return typeof v === 'string' ? v : '/'
  }, [location.state])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  return (
    <section className="card">
      <header className="card__header">
        <h1 className="card__title">ログイン</h1>
        <p className="card__subtitle">
          アカウントが無い場合は <Link to="/register">新規登録</Link>
        </p>
      </header>

      <form
        className="form"
        onSubmit={async (e) => {
          e.preventDefault()
          setErrorMessage(null)
          setSubmitting(true)
          try {
            const res = await login(email.trim(), password)
            setAccessToken(res.access_token)
            navigate(from, { replace: true })
          } catch (err) {
            setErrorMessage(normalizeError(err))
          } finally {
            setSubmitting(false)
          }
        }}
      >
        <div className="field">
          <label className="field__label" htmlFor="email">
            メールアドレス
          </label>
          <input
            className="field__input"
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label className="field__label" htmlFor="password">
            パスワード
          </label>
          <input
            className="field__input"
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {errorMessage ? <div className="alert">{errorMessage}</div> : null}

        <button className="button" type="submit" disabled={submitting}>
          {submitting ? '送信中…' : 'ログイン'}
        </button>
      </form>
    </section>
  )
}
