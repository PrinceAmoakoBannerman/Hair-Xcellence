import { useEffect, useMemo, useState } from 'react'
import { type Go, type Page, IMAGES, INSTAGRAM_URL, SUPPORT_HOURS, money, startingPrice, whatsappLink } from './data'
import { useProducts } from './store'
import { Icon } from './ui'

const MESSAGES = [
  'Delivery across Ghana and worldwide',
  'Need your wig sooner? Choose express or priority production',
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
  const { products } = useProducts()
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
  }, [q, products])
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
        <button className="icon-btn hdr-icon" onClick={() => setSearch(!search)} aria-label="Search" aria-expanded={search}><Icon name={search ? 'x' : 'search'} size={24} /></button>
        <button className="icon-btn hide-sm" onClick={() => go('account')} aria-label="Account"><Icon name="user" /></button>
        <button className="icon-btn hdr-icon cart-btn" onClick={() => go('cart')} aria-label={`Cart, ${cartCount} items`}><Icon name="cart" size={25} />{cartCount > 0 && <b>{cartCount}</b>}</button>
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
        <div className="drawer-help">
          <div className="dh-top">
            <img src={IMAGES.waterWave} alt="" />
            <div>
              <strong>Not sure which wig suits you?</strong>
              <p>Send us a photo of the look you want and we’ll match the wig, length and density.</p>
            </div>
          </div>
          <a className="dh-wa" href={whatsappLink('Hi Hair Xcellence, I need help choosing a wig.')} target="_blank" rel="noopener noreferrer" onClick={() => setMenu(false)}>
            <span className="dh-wa-icon"><Icon name="whatsapp" size={18} /></span>
            <span>Chat on WhatsApp</span>
            <Icon name="arrow" size={16} />
          </a>
          <p className="dh-status"><i aria-hidden /> Usually replies within the hour · {SUPPORT_HOURS}</p>
        </div>
      </aside>
    </div>
  </>
}

const PAYMENTS = [
  { label: 'MTN MoMo', cls: 'momo' },
  { label: 'Telecel Cash', cls: 'telecel' },
  { label: 'AT Money', cls: 'at' },
  { label: 'VISA', cls: 'visa' },
  { label: 'Mastercard', cls: 'mc' },
]

function FooterSection({ id, title, open, onToggle, children }: { id: string; title: string; open: boolean; onToggle: (id: string) => void; children: React.ReactNode }) {
  return <div className={`ft-acc ${open ? 'open' : ''}`}>
    <button className="ft-acc-head" onClick={() => onToggle(id)} aria-expanded={open} aria-controls={`ft-${id}`}>
      <span>{title}</span><Icon name="chevron" size={18} />
    </button>
    <div className="ft-acc-body" id={`ft-${id}`}>{children}</div>
  </div>
}

export function Footer({ go }: { go: Go }) {
  const [open, setOpen] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [joined, setJoined] = useState(false)
  const toggle = (id: string) => setOpen(o => (o === id ? null : id))
  return <footer className="site-footer">
    <div className="ft-accs">
      <FooterSection id="about" title="More about us" open={open === 'about'} onToggle={toggle}>
        <button onClick={() => go('about')}>About us</button>
        <button onClick={() => go('contact')}>Contact us</button>
        <button onClick={() => go('shop', { category: 'All' })}>Shop all</button>
        <button>Privacy policy</button>
        <button>Terms and conditions</button>
      </FooterSection>
      <FooterSection id="help" title="Extra help" open={open === 'help'} onToggle={toggle}>
        <button onClick={() => go('account')}>Track my order</button>
        <button>Returns and exchanges</button>
        <button>Wig care guide</button>
        <button>Find your cap size</button>
        <button onClick={() => go('contact')}>WhatsApp us</button>
      </FooterSection>
      <FooterSection id="delivery" title="Delivery options" open={open === 'delivery'} onToggle={toggle}>
        <h5>Ready-to-ship orders</h5>
        <p>Accra express (1–2 working days): <b>GH₵ 60</b></p>
        <p>Standard delivery, Ghana (2–5 working days): <b>GH₵ 80</b></p>
        <p>International (5–10 working days): <b>quoted at checkout</b></p>
        <h5>Custom orders</h5>
        <p>Standard production: 10–15 working days.</p>
        <p>Express: 5–7 working days · Priority: 48–72 hours (extra charge, chosen on the product page).</p>
      </FooterSection>
      <FooterSection id="signup" title="Sign up and save" open={open === 'signup'} onToggle={toggle}>
        <p>New drops, restocks and offers by email.</p>
        {joined ? <p className="ft-joined"><Icon name="check" size={16} /> Thanks, you’re signed up.</p> :
          <form className="ft-form" onSubmit={e => { e.preventDefault(); if (email.includes('@')) setJoined(true) }}>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address" aria-label="Email address" />
            <button className="btn primary">Sign up</button>
          </form>}
      </FooterSection>
    </div>

    <div className="ft-locale">
      <label><span className="sr-only">Language</span><select defaultValue="en" aria-label="Language"><option value="en">English</option></select></label>
      <label className="ft-country"><i className="flag-gh" aria-hidden /><select defaultValue="gh" aria-label="Country and currency"><option value="gh">Ghana (GH₵)</option></select></label>
    </div>

    <ul className="ft-pay" aria-label="Payment methods">{PAYMENTS.map(p => <li key={p.cls} className={`pay ${p.cls}`}>{p.cls === 'mc' ? <><i /><i /></> : p.label}<span className="sr-only">{p.cls === 'mc' ? p.label : ''}</span></li>)}</ul>

    <div className="ft-social">
      <a className="icon-btn" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Icon name="instagram" size={20} /></a>
      <a className="icon-btn" href={whatsappLink('Hi Hair Xcellence')} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><Icon name="whatsapp" size={20} /></a>
    </div>
    <p className="ft-copy">© {new Date().getFullYear()} HAIR XCELLENCE</p>
  </footer>
}
