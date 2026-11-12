import { useCallback, useEffect, useState } from 'react'
import { type Go, type Product, IMAGES, NEXT_DROP, products, testimonials } from '../data'
import { Countdown, EarlyAccess, Icon, ProductCard, Stars } from '../ui'

const COLLECTIONS = [
  { title: 'HD Lace Wigs', copy: 'Invisible lace, flawless melt', image: IMAGES.straight, category: 'HD Lace Wigs' },
  { title: 'Glueless Wigs', copy: 'Wear it in minutes', image: IMAGES.bodyWhite, category: 'Glueless Wigs' },
  { title: 'Hair Bundles', copy: 'Single-donor, full to the ends', image: IMAGES.bundles, category: 'Hair Bundles' },
  { title: 'Closures & Frontals', copy: 'The perfect finishing piece', image: IMAGES.curly, category: 'Closures and Frontals' },
]

const WHY = [
  { icon: 'sparkle' as const, title: '100% virgin human hair', copy: 'Ethically sourced single-donor hair, never processed, never blended.' },
  { icon: 'scissors' as const, title: 'Hand-finished in Accra', copy: 'Every hairline, knot and curl is perfected by a dedicated artisan.' },
  { icon: 'shield' as const, title: 'Quality guaranteed', copy: 'Each unit passes a 12-point inspection before it leaves our studio.' },
  { icon: 'truck' as const, title: 'Delivered with care', copy: 'Tracked delivery across Ghana and worldwide, beautifully packaged.' },
]

const GALLERY = [IMAGES.burgundy, IMAGES.longWater, IMAGES.layered, IMAGES.bodyBrown, IMAGES.waterWave, IMAGES.straightSide]

export default function Home({ go, onQuickView }: { go: Go; onQuickView: (p: Product) => void }) {
  const [tab, setTab] = useState<'best' | 'new'>('best')
  const [email, setEmail] = useState('')
  const [joined, setJoined] = useState(false)
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
  const list = products.filter(p => (tab === 'best' ? p.isBest : p.isNew)).slice(0, 4)

  return <main className="home">
    {/* Hero */}
    <section className="hero">
      <img src={IMAGES.hero} alt="Two Hair Xcellence looks: jet black and burgundy deep waves" fetchPriority="high" />
      <div className="hero-scrim" />
      <div className="hero-inner">
        <h1>Where Beauty <em>Meets Excellence.</em></h1>
        <p className="hero-sub">Discover luxurious hair crafted to complement your confidence and individuality.</p>
        <div className="hero-cta">
          <button className="btn light" onClick={() => go('shop', { category: 'All' })}>Shop Collection</button>
          <button className="btn ghost-light" onClick={() => go('product', { id: 'custom-made-to-order-wig' })}>Explore Custom Wigs</button>
        </div>
      </div>
    </section>

    {/* Next drop */}
    <section className="drop-band">
      <Countdown target={NEXT_DROP} label="Next wig release" onShop={() => go('shop', { category: 'All' })} />
      <p className="hero-proof"><Icon name="star" size={14} /> 4.9 from 1,200+ clients · Ethically sourced · Hand-finished</p>
    </section>

    {/* Featured collections */}
    <section className="sec">
      <div className="sec-head">
        <div><p className="eyebrow">Featured collections</p><h2>Find your <em>signature.</em></h2></div>
        <button className="text-link" onClick={() => go('shop', { category: 'All' })}>Shop all <Icon name="arrow" size={16} /></button>
      </div>
      <div className="collections">
        {COLLECTIONS.map((c, i) => <button key={c.title} className={`collection c${i}`} onClick={() => go('shop', { category: c.category })}>
          <img src={c.image} alt="" loading="lazy" />
          <span className="collection-copy"><small>0{i + 1}</small><strong>{c.title}</strong><span>{c.copy} <Icon name="arrow" size={15} /></span></span>
        </button>)}
      </div>
    </section>

    {/* Best sellers / New arrivals */}
    <section className="sec sec-cream">
      <div className="sec-head">
        <div><p className="eyebrow">The edit</p><h2>{tab === 'best' ? <>Most <em>loved.</em></> : <>Just <em>arrived.</em></>}</h2></div>
        <div className="tabs" role="tablist">
          <button role="tab" aria-selected={tab === 'best'} className={tab === 'best' ? 'on' : ''} onClick={() => setTab('best')}>Best sellers</button>
          <button role="tab" aria-selected={tab === 'new'} className={tab === 'new' ? 'on' : ''} onClick={() => setTab('new')}>New arrivals</button>
        </div>
      </div>
      <div className="grid-4">{list.map(p => <ProductCard key={p.id} product={p} go={go} onQuickView={onQuickView} />)}</div>
    </section>

    {/* Custom wig collection */}
    <section className="custom">
      <div className="custom-media"><img src={IMAGES.bodyBrown} alt="Custom body wave wig on a mannequin" loading="lazy" /><span className="custom-badge">Made to order<br /><b>10–15 days</b></span></div>
      <div className="custom-copy">
        <p className="eyebrow gold">The custom collection</p>
        <h2>Designed by you.<br /><em>Perfected by us.</em></h2>
        <p>Choose every detail — length, texture, lace, density, colour and finish — and our artisans will hand-craft a wig that is unmistakably yours.</p>
        <ol>
          <li><span>01</span>Choose your length & texture</li>
          <li><span>02</span>Select lace, density & colour</li>
          <li><span>03</span>Add your finishing touches</li>
        </ol>
        <button className="btn light" onClick={() => go('product', { id: 'custom-made-to-order-wig' })}>Start customising <Icon name="arrow" size={16} /></button>
      </div>
    </section>

    {/* Why choose */}
    <section className="sec why">
      <div className="sec-head center"><p className="eyebrow">Why Hair Xcellence</p><h2>Excellence is in <em>the details.</em></h2></div>
      <div className="why-grid">{WHY.map(w => <div key={w.title}><span className="why-icon"><Icon name={w.icon} size={22} /></span><h3>{w.title}</h3><p>{w.copy}</p></div>)}</div>
    </section>

    {/* Testimonials */}
    <section className="sec sec-cream testimonials">
      <div className="sec-head center"><p className="eyebrow">In their words</p><h2>Worn with <em>confidence.</em></h2></div>
      <div className="t-grid">{testimonials.map(t => <figure key={t.name}>
        <Stars value={5} />
        <blockquote>“{t.quote}”</blockquote>
        <figcaption><strong>{t.name}</strong><span>{t.place}</span><small>{t.product}</small></figcaption>
      </figure>)}</div>
    </section>

    {/* Instagram */}
    <section className="sec insta">
      <div className="sec-head center"><p className="eyebrow">@hairxcellence</p><h2>As seen <em>on you.</em></h2></div>
      <div className="insta-grid">{GALLERY.map((src, i) => <a key={i} href="#" onClick={e => e.preventDefault()} aria-label="View on Instagram"><img src={src} alt="" loading="lazy" /><span><Icon name="instagram" size={22} /></span></a>)}</div>
    </section>

    {/* Newsletter */}
    <section className="newsletter">
      <p className="eyebrow gold">The inner circle</p>
      <h2>Be first to every <em>new drop.</em></h2>
      <p>Early access to launches, private offers and expert care rituals — straight to your inbox.</p>
      {joined ? <p className="nl-done"><Icon name="check" size={18} /> Welcome to the inner circle. Check your inbox for a little something.</p> :
        <form onSubmit={e => { e.preventDefault(); if (email.includes('@')) setJoined(true) }}>
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email address" aria-label="Email address" />
          <button className="btn light">Subscribe</button>
        </form>}
    </section>
    {popup && <EarlyAccess image={IMAGES.bodyWhite} onClose={closePopup} />}
  </main>
}
