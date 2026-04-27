import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  checkoutPayment,
  createOrder,
  deleteCart,
  fetchCart,
  type Cart,
} from '../lib/api'
import { normalizeError } from '../lib/error'

export function CartPage() {
  const navigate = useNavigate()
  const [cart, setCart] = useState<Cart | null | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setErrorMessage(null)
      try {
        const c = await fetchCart()
        if (!cancelled) setCart(c)
      } catch (err) {
        if (!cancelled) {
          setErrorMessage(normalizeError(err))
          setCart(undefined)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  if (loading || cart === undefined) {
    return (
      <section className="card">
        <p>読み込み中…</p>
      </section>
    )
  }

  return (
    <section className="card">
      <header className="card__header">
        <h1 className="card__title">カート</h1>
        <p className="card__subtitle">
          <Link to="/">商品一覧へ</Link>
        </p>
      </header>

      {errorMessage ? <div className="alert">{errorMessage}</div> : null}

      {cart === null ? (
        <p>カートは空です。商品一覧から追加してください。</p>
      ) : (
        <div className="cart__body">
          <p>
            カートが作成されています（カートID: {cart.id}
            ）。商品詳細から追加した内容はサーバー側に保存されます。
          </p>
          <div className="cart__actions">
            <button
              type="button"
              className="button"
              disabled={checkoutLoading}
              onClick={async () => {
                setErrorMessage(null)
                setCheckoutLoading(true)
                try {
                  const order = await createOrder()
                  await checkoutPayment(order.id)
                  navigate('/orders/complete', {
                    replace: true,
                    state: { orderId: order.id },
                  })
                } catch (err) {
                  setErrorMessage(normalizeError(err))
                } finally {
                  setCheckoutLoading(false)
                }
              }}
            >
              {checkoutLoading ? '処理中…' : '注文して決済を作成'}
            </button>
            <button
              type="button"
              className="button button--secondary"
              disabled={checkoutLoading}
              onClick={async () => {
                setErrorMessage(null)
                try {
                  await deleteCart(cart.id)
                  setCart(null)
                } catch (err) {
                  setErrorMessage(normalizeError(err))
                }
              }}
            >
              カートを削除
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
