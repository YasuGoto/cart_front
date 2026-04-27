import { getAccessToken } from './auth'

export type ApiError = {
  message: string
  status?: number
}

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.toString().replace(/\/+$/, '') ??
  'http://localhost:3000'

export function resolveMediaUrl(path: string): string {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  const p = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE_URL}${p}`
}

async function parseError(res: Response): Promise<ApiError> {
  const status = res.status
  const contentType = res.headers.get('content-type') ?? ''
  try {
    if (contentType.includes('application/json')) {
      const data = (await res.json()) as unknown
      if (data && typeof data === 'object' && 'message' in data) {
        const messageValue = (data as { message?: unknown }).message
        if (typeof messageValue === 'string')
          return { message: messageValue, status }
        if (Array.isArray(messageValue))
          return { message: messageValue.join('\n'), status }
      }
      return { message: JSON.stringify(data), status }
    }
    const text = await res.text()
    return { message: text || res.statusText, status }
  } catch {
    return { message: res.statusText || 'Request failed', status }
  }
}

export async function apiFetch<TResponse>(
  path: string,
  options: RequestInit = {},
): Promise<TResponse> {
  const url = path.startsWith('http') ? path : `${API_BASE_URL}${path}`

  const headers = new Headers(options.headers)
  headers.set('accept', 'application/json')

  const token = getAccessToken()
  if (token) headers.set('authorization', `Bearer ${token}`)

  const res = await fetch(url, { ...options, headers })
  if (!res.ok) throw await parseError(res)

  const contentType = res.headers.get('content-type') ?? ''
  if (contentType.includes('application/json'))
    return (await res.json()) as TResponse

  const text = await res.text()
  return text as TResponse
}

export type LoginResponse = { access_token: string }
export type RegisterResponse = { id: number; email: string }

export async function login(email: string, password: string) {
  return apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
}

export async function register(email: string, password: string) {
  return apiFetch<RegisterResponse>('/auth/register', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
}

export type Product = {
  id: number
  title: string
  detail: string
  price: number
  img: string
  createdAt: string
}

export async function fetchProducts(): Promise<Product[]> {
  return apiFetch<Product[]>('/products')
}

export async function fetchProduct(id: number): Promise<Product | null> {
  return apiFetch<Product | null>(`/products/${id}`)
}

export type Cart = {
  id: number
  userId: number
  createdAt: string
}

export async function fetchCart(): Promise<Cart | null> {
  return apiFetch<Cart | null>('/cart')
}

export async function addToCart(productId: number, quantity: number) {
  return apiFetch<Cart>('/cart', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ productId, quantity }),
  })
}

export async function deleteCart(cartId: number): Promise<void> {
  await apiFetch<unknown>(`/cart/${cartId}`, { method: 'DELETE' })
}

export type Order = {
  id: number
  userId: number
  totalAmount: number
  createdAt: string
}

export async function createOrder(): Promise<Order> {
  return apiFetch<Order>('/order', { method: 'POST' })
}

export type Payment = {
  id: number
  orderId: number
  stripePaymentIntentId: string
  status: string
  createdAt: string
}

export async function checkoutPayment(orderId: number): Promise<Payment> {
  return apiFetch<Payment>('/payments/checkout', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ orderId }),
  })
}
