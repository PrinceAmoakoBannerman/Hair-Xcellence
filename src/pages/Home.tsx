import { useCallback, useEffect, useState } from 'react'
import { type Go, type Product, IMAGES, NEXT_DROP, products } from '../data'
import { Countdown, EarlyAccess, Icon, ProductRail } from '../ui'

const CATEGORIES = [
  { title: 'HD Lace Wigs', image: IMAGES.straight, category: 'HD Lace Wigs' },
  { title: 'Glueless Wigs', image: IMAGES.bodyWhite, category: 'Glueless Wigs' },
  { title: 'Hair Bundles', image: IMAGES.bundles, category: 'Hair Bundles' },
  { title: 'Closures & Frontals', image: IMAGES.curly, category: 'Closures and Frontals' },
]

const SERVICES = [
  { title: 'Free delivery in Accra', copy: 'On orders over GH₵ 2,500' },
  { title: 'Mobile Money or card', copy: 'Secure checkout with Paystack' },
  { title: '7-day returns', copy: 'On unworn ready-to-ship wigs' },
  { title: 'Help on WhatsApp', copy: 'Mon–Sat, 9am–7pm' },
]

const CUSTOM_OPTIONS = [
  ['Length', '10" to 32"'],
  ['Texture', 'Straight, body wave, deep wave, loose wave, curly'],
  ['Lace', 'HD, transparent or Swiss · 4×4 to 13×6'],
  ['Density', '150%, 180%, 200% or 250%'],
  ['Colour', 'Natural black, jet black, brown, 99J and more'],
  ['Finish', 'Bleached knots, plucked hairline, baby hair, styling'],
]

const GALLERY = [IMAGES.burgundy, IMAGES.longWater, IMAGES.layered, IMAGES.bodyBrown, IMAGES.waterWave, IMAGES.straightSide]

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
        <h1>Where Beauty Meets Excellence.</h1>
        <p className="hero-sub">Discover luxurious hair crafted to complement your confidence and individuality.</p>
        <div className="hero-cta">
          <button className="btn light" onClick={() => go('shop', { category: 'All' })}>Shop collection</button>
          <button className="btn ghost-light" onClick={() => go('product', { id: 'custom-made-to-order-wig' })}>Custom wigs</button>
        </div>
      </div>
    </section>

    {/* Next drop */}
    <section className="drop-band">
      <Countdown target={NEXT_DROP} label="Next wig release" onShop={() => go('shop', { category: 'All' })} />
    </section>

    {/* Services */}
    <section className="services" aria-label="Store services">
      {SERVICES.map(s => <div key={s.title}><strong>{s.title}</strong><span>{s.copy}</span></div>)}
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
        <p>Choose every detail and we make the wig for you. Custom orders are ready to ship in 10–15 working days.</p>
        <dl className="spec-list">{CUSTOM_OPTIONS.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
        <button className="btn light" onClick={() => go('product', { id: 'custom-made-to-order-wig' })}>Build your wig</button>
      </div>
    </section>

    <ProductRail title="All things lace" items={products.filter(p => p.kind === 'closure' || p.categories.includes('Frontal Wigs'))} go={go} onQuickView={onQuickView} onViewAll={() => go('shop', { category: 'Closures and Frontals' })} />

    <ProductRail title="Bundles" items={products.filter(p => p.kind === 'bundle')} go={go} onQuickView={onQuickView} onViewAll={() => go('shop', { category: 'Hair Bundles' })} />

    {/* Instagram */}
    <section className="sec sec-cream insta">
      <div className="sec-head">
        <h2>Follow us on Instagram</h2>
        <a className="text-link" href="#" onClick={e => e.preventDefault()}>@hairxcellence</a>
      </div>
      <div className="insta-grid">{GALLERY.map((src, i) => <a key={i} href="#" onClick={e => e.preventDefault()} aria-label="View on Instagram"><img src={src} alt="" loading="lazy" /><span><Icon name="instagram" size={22} /></span></a>)}</div>
    </section>

    {popup && <EarlyAccess image={IMAGES.bodyWhite} onClose={closePopup} />}
  </main>
}
