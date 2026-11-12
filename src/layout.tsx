import { useEffect, useMemo, useState } from 'react'
import { type Go, type Page, products, money, startingPrice } from './data'
import { Icon } from './ui'

const MESSAGES = [
  'Complimentary delivery in Accra on orders over GH₵ 2,500',
  'Custom wigs hand-finished in 10–15 working days',
  'Pay securely with Mobile Money or card',
]

function Announcement() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI(x => (x + 1) % MESSAGES.length), 4500)
    return () => clearInterval(t)
  }, [])
  return <div className="announce" aria-live="polite"><span key={i}>{MESSAGES[i]}</span></div>
}

type NavItem = { label: string; page: Page; category?: string }
export const NAV: NavItem[] = [
  { label: 'Home', page: 'home' },
  { label: 'Shop', page: 'shop', category: 'All' },
  { label: 'Wigs', page: 'shop', category: 'All Wigs' },
  { label: 'Bundles', page: 'shop', category: 'Hair Bundles' },
  { label: 'Closures', page: 'shop', category: 'Closures and Frontals' },
  { label: 'About Us', page: 'about' },
  { label: 'Contact', page: 'contact' },
]

function Logo({ onClick }: { onClick: () => void }) {
  return <button className="logo" onClick={onClick} aria-label="Hair Xcellence home"><span>HAIR</span><em>X</em><span>CELLENCE</span></button>
}

export function Header({ page, category, go, cartCount }: { page: Page; category?: string; go: Go; cartCount: number }) {
  const [menu, setMenu] = useState(false)
  const [search, setSearch] = useState(false)
  const [q, setQ] = useState('')
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => {
    document.body.style.overflow = menu ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menu])
  const results = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return []
    return products.filter(p => [p.name, p.detail, ...p.categories].join(' ').toLowerCase().includes(s)).slice(0, 5)
  }, [q])
  const isActive = (n: NavItem) => n.page === page && (n.page !== 'shop' || n.category === (category ?? 'All'))
  const nav = (n: NavItem) => { setMenu(false); go(n.page, n.category ? { category: n.category } : undefined) }

  return <>
    <Announcement />
    <header className={`site-header ${scrolled ? 'scrolled' : ''} ${page === 'home' && !scrolled && !search ? 'over-hero' : ''}`}>
      <div className="hdr-left">
        <button className="icon-btn hdr-burger" onClick={() => setMenu(true)} aria-label="Open menu"><Icon name="menu" /></button>
        <Logo onClick={() => go('home')} />
      </div>
      <nav className="hdr-nav" aria-label="Main">
        {NAV.map(n => <button key={n.label} className={isActive(n) ? 'active' : ''} onClick={() => nav(n)}>{n.label}</button>)}
      </nav>
      <div className="hdr-actions">
        <button className="icon-btn" onClick={() => setSearch(!search)} aria-label="Search" aria-expanded={search}><Icon name={search ? 'x' : 'search'} /></button>
        <button className="icon-btn hide-sm" onClick={() => go('account')} aria-label="Account"><Icon name="user" /></button>
        <button className="icon-btn cart-btn" onClick={() => go('cart')} aria-label={`Cart, ${cartCount} items`}><Icon name="bag" />{cartCount > 0 && <b>{cartCount}</b>}</button>
      </div>
      {search && <div className="search-panel">
        <div className="search-field"><Icon name="search" /><input autoFocus value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => { if (e.key === 'Escape') setSearch(false); if (e.key === 'Enter' && results[0]) { setSearch(false); go('product', { id: results[0].id }) } }} placeholder="Search wigs, textures, bundles…" aria-label="Search products" /></div>
        {q && <div className="search-results">
          {results.length === 0 ? <p className="muted">No pieces match “{q}”. Try “body wave” or “closure”.</p> :
            results.map(p => <button key={p.id} onClick={() => { setSearch(false); setQ(''); go('product', { id: p.id }) }}><img src={p.image} alt="" /><span><strong>{p.name}</strong><small>{p.detail}</small></span><b>From {money(startingPrice(p))}</b></button>)}
        </div>}
        {!q && <div className="search-suggest"><span>Popular:</span>{['Body wave', 'Glueless', 'HD lace', 'Burgundy', 'Bundles'].map(s => <button key={s} onClick={() => setQ(s)}>{s}</button>)}</div>}
      </div>}
    </header>

    <div className={`drawer-bg ${menu ? 'open' : ''}`} onClick={() => setMenu(false)} aria-hidden={!menu}>
      <aside className="drawer" onClick={e => e.stopPropagation()} aria-label="Menu">
        <div className="drawer-top"><Logo onClick={() => { setMenu(false); go('home') }} /><button className="icon-btn" onClick={() => setMenu(false)} aria-label="Close menu"><Icon name="x" /></button></div>
        <nav>{NAV.map((n, i) => <button key={n.label} onClick={() => nav(n)} style={{ transitionDelay: menu ? `${80 + i * 35}ms` : '0ms' }}><span>{n.label}</span><Icon name="chevron" size={18} /></button>)}</nav>
        <div className="drawer-links">
          <button onClick={() => { setMenu(false); go('account') }}><Icon name="user" size={18} /> My account</button>
          <button onClick={() => { setMenu(false); go('cart') }}><Icon name="bag" size={18} /> Shopping bag ({cartCount})</button>
        </div>
        <div className="drawer-help"><p>Not sure what to choose?</p><strong>Chat with a hair specialist</strong><button className="btn primary" onClick={() => { setMenu(false); go('contact') }}><Icon name="whatsapp" size={16} /> Start a chat</button></div>
      </aside>
    </div>
  </>
}

export function Footer({ go }: { go: Go }) {
  const [email, setEmail] = useState('')
  const [joined, setJoined] = useState(false)
  return <footer className="site-footer">
    <div className="ft-top">
      <div className="ft-brand">
        <Logo onClick={() => go('home')} />
        <p>Luxury human hair, hand-finished in Accra for women who expect more from every detail.</p>
        <div className="ft-social">{(['instagram', 'whatsapp', 'heart'] as const).map(i => <button key={i} className="icon-btn" aria-label={i}><Icon name={i} size={18} /></button>)}</div>
      </div>
      <div><h4>Shop</h4>
        <button onClick={() => go('shop', { category: 'All Wigs' })}>All wigs</button>
        <button onClick={() => go('shop', { category: 'Glueless Wigs' })}>Glueless wigs</button>
        <button onClick={() => go('shop', { category: 'Hair Bundles' })}>Bundles</button>
        <button onClick={() => go('shop', { category: 'Closures and Frontals' })}>Closures & frontals</button>
        <button onClick={() => go('product', { id: 'custom-made-to-order-wig' })}>Custom wigs</button>
      </div>
      <div><h4>Customer care</h4>
        <button onClick={() => go('contact')}>Contact us</button>
        <button>Delivery & returns</button>
        <button>Wig care guide</button>
        <button>Find your cap size</button>
        <button onClick={() => go('account')}>Track my order</button>
      </div>
      <div className="ft-news"><h4>Join the inner circle</h4>
        <p>First access to new drops, care rituals and private offers.</p>
        {joined ? <p className="ft-joined"><Icon name="check" size={16} /> Thank you — you’re on the list.</p> :
          <form onSubmit={e => { e.preventDefault(); if (email.includes('@')) setJoined(true) }}><input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email address" aria-label="Email address" /><button aria-label="Subscribe"><Icon name="arrow" /></button></form>}
      </div>
    </div>
    <div className="ft-bottom">
      <span>© {new Date().getFullYear()} Hair Xcellence · East Legon, Accra</span>
      <span className="ft-pay">MTN MoMo · Telecel Cash · Visa · Mastercard</span>
      <span><button>Privacy</button> · <button>Terms</button></span>
    </div>
  </footer>
}
