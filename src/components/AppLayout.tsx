import { Link, Outlet, useNavigate } from 'react-router-dom'
import { clearAccessToken, isLoggedIn } from '../lib/auth'

export function AppLayout() {
  const navigate = useNavigate()
  const loggedIn = isLoggedIn()

  return (
    <div className="app">
      <header className="app__nav">
        <nav className="nav">
          <Link to="/" className="nav__brand">
            ショップ
          </Link>
          <div className="nav__links">
            <Link to="/">商品一覧</Link>
            <Link to="/cart">カート</Link>
            {loggedIn ? (
              <button
                type="button"
                className="nav__button"
                onClick={() => {
                  clearAccessToken()
                  navigate('/', { replace: true })
                }}
              >
                ログアウト
              </button>
            ) : (
              <>
                <Link to="/login">ログイン</Link>
                <Link to="/register">新規登録</Link>
              </>
            )}
          </div>
        </nav>
      </header>
      <main className="app__main">
        <Outlet />
      </main>
    </div>
  )
}
