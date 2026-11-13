import type { Availability, Kind, Product, Texture } from './data'

/**
 * Backend address. Set VITE_API_URL in production (Vercel → Settings → Environment Variables),
 * e.g. https://hairxcellence-api.onrender.com. In local development it defaults to the Django
 * server on port 8001 of the same machine.
 */
const RAW = (import.meta.env.VITE_API_URL as string | undefined)
  ?? (import.meta.env.DEV ? `${window.location.protocol}//${window.location.hostname}:8001` : '')
export const API_URL = RAW.replace(/\/+$/, '')
export const apiAvailable = API_URL !== ''

type ApiProduct = {
  id: string; name: string; kind: Kind; categories: string[]; texture: Texture; price: number; sale: number
  availability: Availability; isNew: boolean; isBest: boolean; tag: string; image: string; gallery: string[]
  short: string; description: string; detail: string; colour: string; popularity: number
}

const toProduct = (p: ApiProduct): Product => ({
  id: p.id,
  name: p.name,
  kind: p.kind,
  categories: p.categories,
  texture: p.texture,
  price: Number(p.price),
  availability: p.availability,
  rating: 0,
  reviews: p.popularity ?? 0,
  isNew: p.isNew,
  isBest: p.isBest,
  tag: p.tag,
  image: p.image || p.gallery[0] || '',
  gallery: p.gallery.length ? p.gallery : p.image ? [p.image] : [],
  short: p.short,
  description: p.description,
  detail: p.detail,
  colour: p.colour || undefined,
  sale: Number(p.sale) || undefined,
})

/** Signed-in customer's token (set by the auth store). Sent with every request when present. */
let authToken: string | null = null
export const setAuthToken = (t: string | null) => { authToken = t }

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!apiAvailable) throw new Error('The store backend is not configured.')
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...(authToken ? { Authorization: `Token ${authToken}` } : {}),
      ...init?.headers,
    },
  })
  if (res.status === 204) return undefined as T
  const data = await res.json().catch(() => null)
  if (!res.ok) throw new ApiError(res.status, data)
  return data as T
}

export class ApiError extends Error {
  constructor(public status: number, public data: unknown) {
    super(ApiError.describe(status, data))
  }
  /** Turn a DRF error body into one readable sentence. */
  static describe(status: number, data: unknown): string {
    if (status === 429) return 'Too many attempts. Please wait a moment and try again.'
    if (data && typeof data === 'object') {
      const msgs = Object.values(data as Record<string, unknown>).flat(2).filter(m => typeof m === 'string') as string[]
      if (msgs.length) return msgs.join(' ')
    }
    return status >= 500 ? 'Our server had a problem. Please try again.' : 'Something went wrong. Please try again.'
  }
}

export const fetchProducts = async () => (await request<ApiProduct[]>('/api/products/')).map(toProduct)

export type OrderLine = { product: string; options: Record<string, string>; addons: string[]; quantity: number }
export type OrderRequest = {
  name: string; email: string; phone: string; address: string; city: string; region: string
  delivery_method: string; payment_method: string; items: OrderLine[]
}
export type OrderResponse = {
  number: string; status: string; created_at: string; subtotal: number; delivery_fee: number; total: number
  payment_status: string
  name: string; email: string; phone: string; address: string; city: string; region: string
  delivery_method: string; payment_method: string
  items: { product: string | null; product_name: string; image: string; options: Record<string, string>; addons: string[]; unit_price: number; quantity: number }[]
}

export const placeOrder = (body: OrderRequest) =>
  request<OrderResponse>('/api/orders/', { method: 'POST', body: JSON.stringify(body) })

// ── Customer accounts ───────────────────────────────────────────────
export type Account = { name: string; email: string; phone: string; address: string; city: string; region: string; date_joined: string }
type Session = { token: string; account: Account }

export const register = (body: { name: string; email: string; password: string }) =>
  request<Session>('/api/auth/register/', { method: 'POST', body: JSON.stringify(body) })
export const login = (body: { email: string; password: string }) =>
  request<Session>('/api/auth/login/', { method: 'POST', body: JSON.stringify(body) })
export const logout = () => request<void>('/api/auth/logout/', { method: 'POST' })
export const fetchAccount = () => request<Account>('/api/auth/me/')
export const updateAccount = (body: Partial<Account>) => request<Account>('/api/auth/me/', { method: 'PATCH', body: JSON.stringify(body) })
export const fetchMyOrders = () => request<OrderResponse[]>('/api/auth/orders/')
