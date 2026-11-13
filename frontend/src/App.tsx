import { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { type GoOpts, type Page, type Product as P, choiceLabel, defaultChoices, groupsFor, priceFor, products } from './data'
import { Footer, Header } from './layout'
import { QuickView } from './ui'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Product, { type Configured } from './pages/Product'
import { About, Account, type CartItem, Contact } from './pages/Store'
import { Cart } from './pages/Cart'
import { Checkout } from './pages/Checkout'

type Route = { page: Page; id: string; category: string }

const toItem = ({ product, choices, addons, qty, unitPrice }: Configured): CartItem => ({
  name: product.name,
  detail: [...groupsFor(product).map(g => choiceLabel(g.key, choices[g.key])), ...addons].join(' · '),
  price: unitPrice,
  image: product.image,
  tag: product.categories[0],
  qty,
})

const PAGES: Page[] = ['home', 'shop', 'product', 'cart', 'checkout', 'account', 'about', 'contact']

/** Hash routes: #/shop/Glueless%20Wigs, #/product/adom, #/cart … */
function parseHash(): Route {
  const [, raw = 'home', arg] = window.location.hash.split('/')
  const page = (PAGES as string[]).includes(raw) ? (raw as Page) : 'home'
  const decoded = arg ? decodeURIComponent(arg) : undefined
  return {
    page,
    id: page === 'product' && decoded && products.some(p => p.id === decoded) ? decoded : products[0].id,
    category: page === 'shop' && decoded ? decoded : 'All',
  }
}

// Always open at the top: stop the browser restoring an old scroll position on reload.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

export default function App() {
  const [route, setRoute] = useState<Route>(parseHash)
  const [cart, setCart] = useState<CartItem[]>([])
  const [quick, setQuick] = useState<P | null>(null)

  useEffect(() => {
    const onHash = () => setRoute(parseHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  // New page → jump to the top instantly (no animated scroll from the old position).
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [route.page, route.id, route.category])

  const go = useCallback((page: Page, opts?: GoOpts) => {
    const arg = page === 'product' ? opts?.id : page === 'shop' ? opts?.category ?? 'All' : undefined
    const hash = `#/${page}${arg ? `/${encodeURIComponent(arg)}` : ''}`
    if (window.location.hash === hash) window.scrollTo({ top: 0, behavior: 'smooth' })
    else window.location.hash = hash
  }, [])

  const add = (c: Configured) => {
    const item = toItem(c)
    setCart(list => {
      const i = list.findIndex(x => x.name === item.name && x.detail === item.detail)
      return i >= 0 ? list.map((x, j) => (j === i ? { ...x, qty: x.qty + item.qty } : x)) : [...list, item]
    })
  }
  const quickAdd = (product: P, length: string) => {
    const choices = { ...defaultChoices(product), length }
    add({ product, choices, addons: [], qty: 1, unitPrice: priceFor(product, choices, []) })
  }

  const count = cart.reduce((s, x) => s + x.qty, 0)
  const { page } = route
  const chrome = !['checkout', 'account'].includes(page)

  return <div className="app">
    {chrome && <Header page={page} category={route.category} go={go} cartCount={count} />}
    {page === 'home' && <Home go={go} onQuickView={setQuick} />}
    {page === 'shop' && <Shop go={go} category={route.category} onQuickView={setQuick} />}
    {page === 'product' && <Product id={route.id} go={go} onAdd={add} onBuy={c => { add(c); go('checkout') }} />}
    {page === 'cart' && <Cart items={cart} setItems={setCart} go={go} />}
    {page === 'checkout' && <Checkout items={cart} go={go} onPlaced={() => setCart([])} />}
    {page === 'about' && <About />}
    {page === 'contact' && <Contact />}
    {page === 'account' && <Account go={go} />}
    {chrome && <Footer go={go} />}
    {quick && <QuickView product={quick} go={go} onClose={() => setQuick(null)} onAdd={quickAdd} />}
  </div>
}
