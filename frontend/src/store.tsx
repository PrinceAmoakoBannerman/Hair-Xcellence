import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { fetchProducts } from './api'
import { type Product, products as builtInProducts } from './data'

/**
 * Products come from the backend (managed in the Django admin).
 * - First paint uses the last list fetched from the backend (cached in the browser),
 *   or the built-in list if there is none yet.
 * - The live list then replaces it.
 * - If the backend can't be reached, the site keeps working with what it has.
 */
type Status = 'loading' | 'live' | 'offline'
type ProductsState = { products: Product[]; status: Status }

const CACHE_KEY = 'hx-products-v1'
const ProductsContext = createContext<ProductsState>({ products: builtInProducts, status: 'loading' })

function readCache(): Product[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    const list = raw ? (JSON.parse(raw) as Product[]) : null
    return Array.isArray(list) ? list : null
  } catch { return null }
}

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProductsState>(() => ({ products: readCache() ?? builtInProducts, status: 'loading' }))

  useEffect(() => {
    let cancelled = false
    const load = () => fetchProducts()
      .then(list => {
        if (cancelled) return
        setState({ products: list, status: 'live' })
        try { localStorage.setItem(CACHE_KEY, JSON.stringify(list)) } catch { /* storage unavailable */ }
      })
      .catch(() => { if (!cancelled) setState(s => ({ ...s, status: s.status === 'live' ? 'live' : 'offline' })) })
    load()
    // Pick up admin changes when the shopper returns to the tab, and every 2 minutes while it's open.
    const onVisible = () => { if (document.visibilityState === 'visible') load() }
    document.addEventListener('visibilitychange', onVisible)
    const timer = window.setInterval(onVisible, 120_000)
    return () => { cancelled = true; document.removeEventListener('visibilitychange', onVisible); window.clearInterval(timer) }
  }, [])

  return <ProductsContext.Provider value={state}>{children}</ProductsContext.Provider>
}

export const useProducts = () => useContext(ProductsContext)

/**
 * Bag items that can't be bought right now, with the reason (sold out, or removed from the shop).
 * Only judged against the live list from the backend, never the built-in fallback.
 */
export function useUnavailable(items: { productId: string }[]): Record<string, string> {
  const { products, status } = useProducts()
  if (status !== 'live') return {}
  const out: Record<string, string> = {}
  for (const x of items) {
    const p = products.find(q => q.id === x.productId)
    if (!p) out[x.productId] = 'No longer available'
    else if (p.availability === 'Sold out') out[x.productId] = 'Sold out'
  }
  return out
}
