import { useParams } from 'react-router-dom'
import { ProductDetailPage } from './ProductDetailPage'

/** `id` が変わったときに詳細ページの state をリセットする */
export function ProductDetailRoute() {
  const { id } = useParams()
  return <ProductDetailPage key={id ?? ''} />
}
