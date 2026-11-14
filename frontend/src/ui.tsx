import { useEffect, useRef, useState, type ReactNode } from 'react'
import { type Go, type Product, compareAtPrice, money, startingPrice, LENGTHS } from './data'

export type IconName = 'menu' | 'search' | 'user' | 'bag' | 'arrow' | 'chevron' | 'x' | 'plus' | 'minus' | 'check' | 'heart' | 'whatsapp' | 'box' | 'truck' | 'card' | 'chart' | 'grid' | 'users' | 'settings' | 'edit' | 'trash' | 'star' | 'sliders' | 'eye' | 'instagram' | 'shield' | 'return' | 'sparkle' | 'scissors' | 'cart'

export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    menu: <path d="M4 7h16M4 12h16M4 17h10" />,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4.5 21a7.5 7.5 0 0 1 15 0" /></>,
    bag: <><path d="M5 8h14l-1 13H6L5 8Z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /></>,
    arrow: <path d="M5 12h14M14 7l5 5-5 5" />,
    chevron: <path d="m9 18 6-6-6-6" />,
    x: <path d="m6 6 12 12M18 6 6 18" />,
    plus: <path d="M12 5v14M5 12h14" />,
    minus: <path d="M5 12h14" />,
    check: <path d="m5 12 4 4L19 6" />,
    heart: <path d="M20.8 5.8a5.5 5.5 0 0 0-7.8 0L12 6.9l-1.1-1.1a5.5 5.5 0 1 0-7.8 7.8L12 22l8.8-8.4a5.5 5.5 0 0 0 0-7.8Z" />,
    whatsapp: <><path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 21l2-5.2A8.5 8.5 0 1 1 21 11.5Z" /><path d="M8.5 8.5c.5 3 2 4.5 5 5" /></>,
    box: <><path d="m21 8-9 5-9-5 9-5 9 5Z" /><path d="M3 8v10l9 5 9-5V8M12 13v10" /></>,
    truck: <><path d="M3 6h11v11H3zM14 10h4l3 4v3h-7z" /><circle cx="7" cy="19" r="2" /><circle cx="18" cy="19" r="2" /></>,
    card: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18" /></>,
    chart: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
    grid: <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></>,
    users: <><circle cx="9" cy="8" r="4" /><path d="M2 21a7 7 0 0 1 14 0M16 4a4 4 0 0 1 0 8M18 15a6 6 0 0 1 4 6" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1" /></>,
    edit: <path d="m4 20 4-1 11-11-3-3L5 16l-1 4ZM14 7l3 3" />,
    trash: <path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6" />,
    star: <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9L12 3Z" />,
    sliders: <path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0M14 4v4M8 10v4M16 16v4" />,
    eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></>,
    instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".6" /></>,
    shield: <><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z" /><path d="m8.5 12 2.5 2.5 4.5-5" /></>,
    return: <path d="M9 14 4 9l5-5M4 9h11a5 5 0 0 1 0 10h-3" />,
    sparkle: <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" />,
    cart: <><path d="M2 4h2.6l2.5 11.2h11.3L21 7.5H5.4" /><circle cx="9.2" cy="19.6" r="1.1" /><circle cx="16.8" cy="19.6" r="1.1" /></>,
    scissors: <><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M8.1 8.1 20 20M8.1 15.9 20 4" /></>,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>{paths[name]}</svg>
}

export function Availability({ value }: { value: Product['availability'] }) {
  const cls = value === 'In stock' ? 'ok' : value === 'Low stock' ? 'low' : value === 'Sold out' ? 'out' : 'mto'
  return <span className={`avail ${cls}`}><i />{value}</span>
}

export function ProductCard({ product, go, onQuickView }: { product: Product; go: Go; onQuickView?: (p: Product) => void }) {
  const was = compareAtPrice(product)
  const open = () => go('product', { id: product.id })
  return <article className="p-card">
    <div className="p-card-media">
      <button className="p-card-img" onClick={open} aria-label={`View ${product.name}`}>
        <img src={product.gallery[0]} alt={product.name} loading="lazy" />
        <img className="alt" src={product.gallery[1] ?? product.gallery[0]} alt="" loading="lazy" />
      </button>
      {product.tag && <span className={`p-card-tag ${product.sale ? 'sale' : ''}`}>{product.tag}</span>}
      {onQuickView && <button className="p-card-quick" onClick={() => onQuickView(product)}>Quick view</button>}
    </div>
    <button className="p-card-body" onClick={open}>
      <h3>{product.name}</h3>
      <span className="p-card-price">
        {was && <s aria-label={`Was ${money(was)}`}>{money(was)}</s>}
        <span>from {money(startingPrice(product))}</span>
      </span>
      {product.availability !== 'In stock' && <span className="p-card-stock">{product.availability}</span>}
    </button>
  </article>
}

/** Horizontally swipeable product row (scroll-snap); arrow buttons on desktop. */
export function ProductRail({ title, items, go, onQuickView, onViewAll }: { title: string; items: Product[]; go: Go; onQuickView?: (p: Product) => void; onViewAll?: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const scroll = (dir: 1 | -1) => { const el = ref.current; if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' }) }
  if (items.length === 0) return null
  return <section className="rail-sec">
    <div className="rail-head">
      <h2>{title}</h2>
      <div className="rail-actions">
        {onViewAll && <button className="text-link" onClick={onViewAll}>View all</button>}
        <button className="rail-arrow" onClick={() => scroll(-1)} aria-label={`Scroll ${title} left`}><Icon name="chevron" size={18} /></button>
        <button className="rail-arrow" onClick={() => scroll(1)} aria-label={`Scroll ${title} right`}><Icon name="chevron" size={18} /></button>
      </div>
    </div>
    <div className="rail" ref={ref}>{items.map(p => <ProductCard key={p.id} product={p} go={go} onQuickView={onQuickView} />)}</div>
  </section>
}

export function QuickView({ product, go, onClose, onAdd }: { product: Product; go: Go; onClose: () => void; onAdd: (p: Product, length: string) => void }) {
  const [length, setLength] = useState(product.kind === 'wig' ? '18"' : '10"')
  const [added, setAdded] = useState(false)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])
  return <div className="overlay" onClick={onClose}>
    <div className="qv" role="dialog" aria-modal="true" aria-label={`${product.name} quick view`} onClick={e => e.stopPropagation()}>
      <button className="qv-close" onClick={onClose} aria-label="Close"><Icon name="x" /></button>
      <img src={product.image} alt={product.name} />
      <div className="qv-body">
        <p className="eyebrow">{product.categories[0]}</p>
        <h2>{product.name}</h2>
        <p className="qv-price">From {money(startingPrice(product))}</p>
        <p className="qv-desc">{product.short}</p>
        <p className="field-label">Length <b>{length}</b></p>
        <div className="pill-row">{LENGTHS.slice(0, 8).map(l => <button key={l} className={`pill ${l === length ? 'on' : ''}`} onClick={() => setLength(l)}>{l}</button>)}</div>
        <Availability value={product.availability} />
        <div className="qv-actions">
          {product.availability === 'Sold out'
            ? <button className="btn primary wide" onClick={() => { onClose(); go('contact', { id: `request:${product.name}` }) }}>Sold out · Request this wig</button>
            : <button className="btn primary wide" onClick={() => { onAdd(product, length); setAdded(true) }}>{added ? <>Added to bag <Icon name="check" size={16} /></> : 'Add to bag'}</button>}
          <button className="text-link" onClick={() => { onClose(); go('product', { id: product.id }) }}>Customise every detail <Icon name="arrow" size={16} /></button>
        </div>
      </div>
    </div>
  </div>
}

/** Live countdown to a date; re-renders every second until it passes. */
export function useCountdown(target: Date) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (Date.now() >= target.getTime()) return
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [target])
  const ms = Math.max(0, target.getTime() - now)
  return { done: ms === 0, d: Math.floor(ms / 864e5), h: Math.floor(ms / 36e5) % 24, m: Math.floor(ms / 6e4) % 60, s: Math.floor(ms / 1e3) % 60 }
}

export function Countdown({ target, label = 'Next wig drop', onShop }: { target: Date; label?: string; onShop: () => void }) {
  const { done, d, h, m, s } = useCountdown(target)
  if (done) return <button className="countdown live" onClick={onShop}><span>The drop is live</span><b>Shop now →</b></button>
  const pad = (n: number) => String(n).padStart(2, '0')
  return <div className="countdown" role="timer" aria-label={`${label}: ${d} days ${h} hours ${m} minutes`}>
    <span className="cd-label">{label}</span>
    <span className="cd-units">
      {[[d, 'd'], [h, 'h'], [m, 'm'], [s, 's']].map(([v, u], i) => <span key={u as string} className="cd-unit">{i > 0 && <i>:</i>}<b>{u === 'd' ? v : pad(v as number)}</b><small>{u}</small></span>)}
    </span>
  </div>
}

/** Early-access signup shown once per browser session. */
export function EarlyAccess({ image, onClose }: { image: string; onClose: () => void }) {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])
  return <div className="overlay" onClick={onClose}>
    <div className="ea" role="dialog" aria-modal="true" aria-labelledby="ea-title" onClick={e => e.stopPropagation()}>
      <div className="ea-img"><img src={image} alt="Wig on a mannequin head" /></div>
      <div className="ea-body">
        <button className="ea-close" onClick={onClose} aria-label="Close"><Icon name="x" size={16} /></button>
        {done ? <>
          <h2 id="ea-title">You’re on the list</h2>
          <p>We’ll email you before the drop opens.</p>
          <button className="btn primary wide" onClick={onClose}>Continue</button>
        </> : <>
          <h2 id="ea-title">Get early access</h2>
          <p>Shop the next wig drop before it goes public.</p>
          <form onSubmit={e => { e.preventDefault(); if (email.includes('@')) setDone(true) }}>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email" aria-label="Email address" />
            <button className="btn primary wide" type="submit">Get early access</button>
          </form>
        </>}
      </div>
    </div>
  </div>
}
