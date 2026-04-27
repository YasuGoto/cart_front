import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchProducts, resolveMediaUrl, type Product } from '../lib/api'
import { normalizeError } from '../lib/error'

export function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setErrorMessage(null)
      try {
        const list = await fetchProducts()
        if (!cancelled) setProducts(list)
      } catch (err) {
        if (!cancelled) setErrorMessage(normalizeError(err))
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return (
      <section className="card">
        <p>読み込み中…</p>
      </section>
    )
  }

  if (errorMessage) {
    return (
      <section className="card">
        <div className="alert">{errorMessage}</div>
      </section>
    )
  }

  return (
    <section className="card card--wide">
      <header className="card__header">
        <h1 className="card__title">商品一覧</h1>
        <p className="card__subtitle">気になる商品の詳細ページへ進めます。</p>
      </header>

      {products.length === 0 ? (
        <p>商品がありません。</p>
      ) : (
        <ul className="product-grid">
          {products.map((p) => (
            <li key={p.id} className="product-card">
              <Link to={`/products/${p.id}`} className="product-card__link">
                <div className="product-card__image-wrap">
                  {p.img ? (
                    <img
                      src={resolveMediaUrl(p.img)}
                      alt=""
                      className="product-card__image"
                    />
                  ) : null}
                </div>
                <div className="product-card__body">
                  <h2 className="product-card__title">{p.title}</h2>
                  <p className="product-card__price">
                    ¥{p.price.toLocaleString('ja-JP')}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
