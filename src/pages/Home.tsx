import { useCallback, useEffect, useState } from 'react'
import { type Go, type Product, IMAGES, INSTAGRAM_HANDLE, INSTAGRAM_URL, NEXT_DROP, SUPPORT_HOURS, products } from '../data'
import { Countdown, EarlyAccess, Icon, ProductRail } from '../ui'

const CATEGORIES = [
  { title: 'HD Lace Wigs', image: IMAGES.straight, category: 'HD Lace Wigs' },
  { title: 'Glueless Wigs', image: IMAGES.bodyWhite, category: 'Glueless Wigs' },
  { title: 'Hair Bundles', image: IMAGES.bundles, category: 'Hair Bundles' },
  { title: 'Closures & Frontals', image: IMAGES.curly, category: 'Closures and Frontals' },
]

const SERVICES = [
  { title: 'Order by 2pm', copy: 'Same-day dispatch on in-stock wigs.' },
  { title: 'Nationwide delivery', copy: 'Accra 1–2 days, rest of Ghana 2–5 days.' },
  { title: 'Need it sooner?', copy: 'Express and priority production on wigs.' },
  { title: 'MoMo or card', copy: 'Secure checkout with Paystack.' },
  { title: 'Help on WhatsApp', copy: `${SUPPORT_HOURS}.` },
]

const CUSTOM_OPTIONS = [
  ['Length', '10" to 32"'],
  ['Texture', 'Straight, body wave, deep wave, loose wave, curly'],
  ['Lace', 'HD, transparent or Swiss · 4×4 to 13×6'],
  ['Density', '150%, 180%, 200% or 250%'],
  ['Colour', 'Natural black, jet black, brown, 99J and more'],
  ['Finish', 'Bleached knots, plucked hairline, baby hair, styling'],
]

// Instagram tiles (placeholders until a live feed is connected). 18 on desktop, first 12 on phones.
const GALLERY = [IMAGES.burgundy, IMAGES.longWater, IMAGES.layered, IMAGES.bodyBrown, IMAGES.waterWave, IMAGES.straightSide,
  IMAGES.hero, IMAGES.bodyWhite, IMAGES.curly, IMAGES.straight, IMAGES.colourEdit, IMAGES.bundles,
  IMAGES.ginger, IMAGES.dark, IMAGES.red, IMAGES.story, IMAGES.soft, IMAGES.rack]

export default function Home({ go, onQuickView }: { go: Go; onQuickView: (p: Product) => void }) {
  const [popup, setPopup] = useState(false)
  useEffect(() => {
    let seen = false
    try { seen = sessionStorage.getItem('hx-early-access') === '1' } catch { /* storage unavailable */ }
    if (seen) return
    const t = setTimeout(() => setPopup(true), 4500) // ~2s after the splash fades
    return () => clearTimeout(t)
  }, [])
  const closePopup = useCallback(() => {
    setPopup(false)
    try { sessionStorage.setItem('hx-early-access', '1') } catch { /* storage unavailable */ }
  }, [])

  return <main className="home">
    {/* Hero */}
    <section className="hero">
      <img src={IMAGES.hero} alt="Jet black and burgundy deep wave wigs" fetchPriority="high" />
      <div className="hero-scrim" />
      <div className="hero-inner">
        <h1>Beauty.</h1>
        <p className="hero-sub">Meets excellence.</p>
        <button className="hero-btn" onClick={() => go('shop', { category: 'All' })}>Shop</button>
      </div>
    </section>

    {/* Next drop */}
    <section className="drop-band">
      <Countdown target={NEXT_DROP} label="Next wig release" onShop={() => go('shop', { category: 'All' })} />
    </section>

    {/* Services */}
    <section className="services" aria-label="Store services">
      {SERVICES.map(s => <div key={s.title}><strong>{s.title}</strong><p>{s.copy}</p></div>)}
    </section>

    {/* Product rows */}
    <ProductRail title="Bestsellers" items={products.filter(p => p.isBest)} go={go} onQuickView={onQuickView} onViewAll={() => go('shop', { category: 'All' })} />

    {/* Categories */}
    <section className="sec">
      <div className="sec-head">
        <h2>Shop by category</h2>
        <button className="text-link" onClick={() => go('shop', { category: 'All' })}>View all</button>
      </div>
      <div className="collections">
        {CATEGORIES.map((c, i) => <button key={c.title} className={`collection c${i}`} onClick={() => go('shop', { category: c.category })}>
          <img src={c.image} alt="" loading="lazy" />
          <span className="collection-copy"><strong>{c.title}</strong><span>Shop now</span></span>
        </button>)}
      </div>
    </section>

    <ProductRail title="Wig collection" items={products.filter(p => p.kind === 'wig')} go={go} onQuickView={onQuickView} onViewAll={() => go('shop', { category: 'All Wigs' })} />

    {/* Custom wigs */}
    <section className="custom">
      <div className="custom-media"><img src={IMAGES.bodyBrown} alt="Custom body wave wig on a mannequin" loading="lazy" /></div>
      <div className="custom-copy">
        <h2>Custom wigs</h2>
        <p>Choose every detail and we make the wig for you. Custom orders are ready in 10–15 working days, or sooner with express (5–7 days) or priority (48–72 hours) production.</p>
        <dl className="spec-list">{CUSTOM_OPTIONS.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
        <button className="btn light" onClick={() => go('product', { id: 'custom-made-to-order-wig' })}>Build your wig</button>
      </div>
    </section>

    <ProductRail title="All things lace" items={products.filter(p => p.kind === 'closure' || p.categories.includes('Frontal Wigs'))} go={go} onQuickView={onQuickView} onViewAll={() => go('shop', { category: 'Closures and Frontals' })} />

    <ProductRail title="Bundles" items={products.filter(p => p.kind === 'bundle')} go={go} onQuickView={onQuickView} onViewAll={() => go('shop', { category: 'Hair Bundles' })} />

    {/* Instagram */}
    <section className="insta">
      <h2><a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">Instagram @{INSTAGRAM_HANDLE}</a></h2>
      <div className="insta-grid">{GALLERY.map((src, i) => <a key={i} href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label={`Open @${INSTAGRAM_HANDLE} on Instagram`}>
        <img src={src} alt="" loading="lazy" />
        <span><Icon name="instagram" size={22} /></span>
      </a>)}</div>
    </section>
    {popup && <EarlyAccess image={IMAGES.bodyWhite} onClose={closePopup} />}
  </main>
}
