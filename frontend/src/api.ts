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
/** Called when the server says the saved sign-in is no longer valid (expired after 30 days). */
let onSignedOut: () => void = () => {}
export const setSignedOutHandler = (fn: () => void) => { onSignedOut = fn }

// ── Connection status (shown to shoppers by <ServiceNotice />) ─────────
/** ok: fine · slow: still waiting (the free server can take up to a minute to wake) · down: can't reach it */
export type ApiStatus = 'ok' | 'slow' | 'down'
let apiStatus: ApiStatus = 'ok'
const statusListeners = new Set<(s: ApiStatus) => void>()
export const onApiStatus = (fn: (s: ApiStatus) => void) => { statusListeners.add(fn); fn(apiStatus); return () => { statusListeners.delete(fn) } }
const setApiStatus = (s: ApiStatus) => { if (s !== apiStatus) { apiStatus = s; statusListeners.forEach(fn => fn(s)) } }
let waiting = 0

const SLOW_AFTER_MS = 4_000      // show "Connecting…" after this long
const TIMEOUT_MS = 75_000        // give up after this long (a sleeping server needs up to ~60 s)
const RETRY_STATUSES = [502, 503, 504]  // server restarting or deploying
const wait = (ms: number) => new Promise(resolve => window.setTimeout(resolve, ms))

type RequestOptions = {
  /** Background refreshes (e.g. the product list) never show the status message; the site already has data. */
  background?: boolean
}

async function request<T>(path: string, init?: RequestInit, opts: RequestOptions = {}): Promise<T> {
  if (!apiAvailable) throw new ApiError(0, null)
  const method = (init?.method ?? 'GET').toUpperCase()
  const send = async (token: string | null) => {
    const controller = new AbortController()
    const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS)
    try {
      return await fetch(`${API_URL}${path}`, {
        ...init,
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
          ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
          ...(token ? { Authorization: `Token ${token}` } : {}),
          ...init?.headers,
        },
      })
    } finally { window.clearTimeout(timer) }
  }

  waiting++
  const slowTimer = opts.background ? 0 : window.setTimeout(() => setApiStatus('slow'), SLOW_AFTER_MS)
  try {
    let res: Response
    try {
      res = await send(authToken)
      // Reading data is safe to repeat; placing an order or paying is never sent twice.
      if (method === 'GET' && RETRY_STATUSES.includes(res.status)) { await wait(3_000); res = await send(authToken) }
    } catch {
      if (method === 'GET') {
        try { await wait(2_000); res = await send(authToken) } catch { throw new ApiError(0, null) }
      } else {
        throw new ApiError(0, null)
      }
    }
    // Expired sign-in: sign out quietly and try once more as a guest, so e.g. placing an order still works.
    if (res.status === 401 && authToken) {
      authToken = null
      onSignedOut()
      res = await send(null)
    }
    if (RETRY_STATUSES.includes(res.status)) throw new ApiError(res.status, null)
    setApiStatus('ok')
    if (res.status === 204) return undefined as T
    const data = await res.json().catch(() => null)
    if (!res.ok) throw new ApiError(res.status, data)
    return data as T
  } catch (e) {
    const unreachable = e instanceof ApiError && (e.status === 0 || RETRY_STATUSES.includes(e.status))
    if (unreachable && !opts.background) setApiStatus('down')
    throw e
  } finally {
    window.clearTimeout(slowTimer)
    waiting--
    if (waiting === 0 && apiStatus === 'slow') setApiStatus('ok')
  }
}

/** Quick check used by the "Try again" button. */
export async function checkConnection(): Promise<boolean> {
  try { await request('/api/health/'); return true } catch { return false }
}

export class ApiError extends Error {
  constructor(public status: number, public data: unknown) {
    super(ApiError.describe(status, data))
  }
  /** Turn a DRF error body into one readable sentence. */
  static describe(status: number, data: unknown): string {
    if (status === 0) return 'We couldn’t reach the shop. Please check your connection and try again in a moment.'
    if (RETRY_STATUSES.includes(status)) return 'The shop is restarting. Please try again in a minute.'
    if (status === 429) return 'Too many attempts. Please wait a moment and try again.'
    if (data && typeof data === 'object') {
      const msgs = Object.values(data as Record<string, unknown>).flat(2).filter(m => typeof m === 'string') as string[]
      if (msgs.length) return msgs.join(' ')
    }
    return status >= 500 ? 'Our server had a problem. Please try again.' : 'Something went wrong. Please try again.'
  }
}

export const fetchProducts = async () => (await request<ApiProduct[]>('/api/products/', undefined, { background: true })).map(toProduct)

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

// ── Online payment (Paystack) ───────────────────────────────────────
export const fetchPaymentConfig = () => request<{ online: boolean }>('/api/payments/config/')
export const startPayment = (order: string, email: string) =>
  request<{ authorization_url: string; reference: string }>('/api/payments/start/', { method: 'POST', body: JSON.stringify({ order, email }) })
export const verifyPayment = (reference: string) =>
  request<{ paystack_status: string; order: OrderResponse }>(`/api/payments/verify/?reference=${encodeURIComponent(reference)}`)
