import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../lib/api'
import { normalizeError } from '../lib/error'

export function RegisterPage() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  return (
    <section className="card">
      <header className="card__header">
        <h1 className="card__title">新規登録</h1>
        <p className="card__subtitle">
          すでにアカウントがある場合は <Link to="/login">ログイン</Link>
        </p>
      </header>

      <form
        className="form"
        onSubmit={async (e) => {
          e.preventDefault()
          setErrorMessage(null)
          setSubmitting(true)
          try {
            await register(email.trim(), password)
            setDone(true)
            setTimeout(() => navigate('/login', { replace: true }), 400)
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
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />
          <div className="field__hint">8文字以上を推奨します。</div>
        </div>

        {errorMessage ? <div className="alert">{errorMessage}</div> : null}
        {done ? (
          <div className="success">
            作成しました。ログイン画面へ移動します。
          </div>
        ) : null}

        <button className="button" type="submit" disabled={submitting}>
          {submitting ? '送信中…' : '登録する'}
        </button>
      </form>
    </section>
  )
}
