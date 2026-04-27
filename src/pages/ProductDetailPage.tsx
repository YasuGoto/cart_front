import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  addToCart,
  fetchProduct,
  resolveMediaUrl,
  type Product,
} from '../lib/api'
import { isLoggedIn } from '../lib/auth'
import { normalizeError } from '../lib/error'

export function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const productId = Number(id)
  const invalid = !Number.isFinite(productId) || productId <= 0

  const [product, setProduct] = useState<Product | null | undefined>(() =>
    invalid ? null : undefined,
  )
  const [quantity, setQuantity] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    if (invalid) return
    let cancelled = false
    ;(async () => {
      try {
        const p = await fetchProduct(productId)
        if (!cancelled) setProduct(p)
      } catch {
        if (!cancelled) setProduct(null)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [invalid, productId])

  if (invalid || product === null) {
    return (
      <section className="card">
        <p>商品が見つかりません。</p>
        <Link to="/">商品一覧へ</Link>
      </section>
    )
  }

  if (product === undefined) {
    return (
      <section className="card">
        <p>読み込み中…</p>
      </section>
    )
  }

  return (
    <section className="card card--wide">
      <div className="product-detail">
        <div className="product-detail__media">
          {product.img ? (
            <img
              src={resolveMediaUrl(product.img)}
              alt=""
              className="product-detail__image"
            />
          ) : null}
        </div>
        <div className="product-detail__info">
          <h1 className="card__title">{product.title}</h1>
          <p className="product-detail__price">
            ¥{product.price.toLocaleString('ja-JP')}
          </p>
          <p className="product-detail__detail">{product.detail}</p>

          <form
            className="form"
            onSubmit={async (e) => {
              e.preventDefault()
              setErrorMessage(null)
              setSuccessMessage(null)
              if (!isLoggedIn()) {
                navigate('/login', {
                  state: { from: `/products/${product.id}` },
                })
                return
              }
              setSubmitting(true)
              try {
                await addToCart(product.id, quantity)
                setSuccessMessage('カートに追加しました。')
              } catch (err) {
                setErrorMessage(normalizeError(err))
              } finally {
                setSubmitting(false)
              }
            }}
          >
            <div className="field">
              <label className="field__label" htmlFor="qty">
                数量
              </label>
              <input
                className="field__input field__input--narrow"
                id="qty"
                type="number"
                min={1}
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, Number(e.target.value) || 1))
                }
              />
            </div>
            {errorMessage ? <div className="alert">{errorMessage}</div> : null}
            {successMessage ? (
              <div className="success">{successMessage}</div>
            ) : null}
            <div className="product-detail__actions">
              <button className="button" type="submit" disabled={submitting}>
                {submitting ? '送信中…' : 'カートに入れる'}
              </button>
              <Link to="/cart" className="button button--secondary">
                カートへ
              </Link>
              <Link to="/" className="button button--ghost">
                一覧へ
              </Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
