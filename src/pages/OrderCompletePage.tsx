import { useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'

export function OrderCompletePage() {
  const location = useLocation()
  const orderId = useMemo(() => {
    const v = (location.state as { orderId?: unknown } | null)?.orderId
    return typeof v === 'number' && Number.isFinite(v) ? v : null
  }, [location.state])

  return (
    <section className="card">
      <header className="card__header">
        <h1 className="card__title">注文完了</h1>
        <p className="card__subtitle">ご購入ありがとうございました。</p>
      </header>
      <div className="success success--spaced">
        {orderId !== null
          ? `注文番号: ${orderId}`
          : '注文が完了しました。'}
      </div>
      <Link to="/" className="button">
        商品一覧へ戻る
      </Link>
    </section>
  )
}
