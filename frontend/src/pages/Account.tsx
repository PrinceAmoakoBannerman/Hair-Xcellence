import { useEffect, useState } from 'react'
import { type Account as AccountT, type OrderResponse, apiAvailable, fetchMyOrders, updateAccount } from '../api'
import { firstName, useAuth } from '../auth'
import { type Go, money } from '../data'
import { Icon } from '../ui'

const STEPS = ['confirmed', 'processing', 'shipped', 'delivered'] as const
const STEP_LABEL: Record<string, string> = { confirmed: 'Confirmed', processing: 'Processing', shipped: 'Shipped', delivered: 'Delivered', cancelled: 'Cancelled' }
const PAY_LABEL: Record<string, string> = { pending: 'Awaiting payment', paid: 'Paid', failed: 'Payment failed', refunded: 'Refunded' }
const REGIONS = ['Greater Accra', 'Ashanti', 'Central', 'Eastern', 'Western', 'Volta', 'Northern', 'Upper East', 'Upper West', 'Bono', 'Bono East', 'Ahafo', 'Western North', 'Oti', 'Savannah', 'North East']

const greeting = () => { const h = new Date().getHours(); return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening' }
const date = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

export default function Account({ go }: { go: Go }) {
  const { account, ready } = useAuth()
  const [welcome, setWelcome] = useState(false)

  if (!ready) return <main className="acct-center"><p className="muted">Loading…</p></main>
  if (!account) return <AuthForms onSignedUp={() => setWelcome(true)} go={go} />
  if (welcome) return <Welcome account={account} go={go} onContinue={() => setWelcome(false)} />
  return <Dashboard account={account} go={go} />
}

// ── Sign in / create account ─────────────────────────────────────────

function AuthForms({ onSignedUp, go }: { onSignedUp: () => void; go: Go }) {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState<'in' | 'up'>('in')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setBusy(true)
    try {
      if (mode === 'up') { await signUp(name, email, password); onSignedUp() }
      else await signIn(email, password)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally { setBusy(false) }
  }

  return <main className="acct-center">
    <form className="acct-card acct-auth" onSubmit={submit} noValidate>
      <div className="acct-tabs" role="tablist">
        <button type="button" role="tab" aria-selected={mode === 'in'} className={mode === 'in' ? 'on' : ''} onClick={() => { setMode('in'); setError('') }}>Sign in</button>
        <button type="button" role="tab" aria-selected={mode === 'up'} className={mode === 'up' ? 'on' : ''} onClick={() => { setMode('up'); setError('') }}>Create account</button>
      </div>
      <h1>{mode === 'in' ? 'Welcome back' : 'Create your account'}</h1>
      <p className="muted">{mode === 'in' ? 'Sign in to see your orders and check out faster.' : 'Save your details for faster checkout and track every order.'}</p>
      {!apiAvailable && <p className="co-error">Accounts aren’t available right now. Please try again later.</p>}
      {mode === 'up' && <label><span>Full name</span><input value={name} onChange={e => setName(e.target.value)} autoComplete="name" required /></label>}
      <label><span>Email address</span><input type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" required /></label>
      <label><span>Password</span><input type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete={mode === 'in' ? 'current-password' : 'new-password'} minLength={8} required /></label>
      {mode === 'up' && <small className="muted">At least 8 characters. Avoid common words.</small>}
      {error && <p className="co-error" role="alert">{error}</p>}
      <button className="btn primary wide" disabled={busy || !apiAvailable}>{busy ? 'Please wait…' : mode === 'in' ? 'Sign in' : 'Create account'}</button>
      <button type="button" className="acct-link" onClick={() => go('shop', { category: 'All' })}>Continue shopping as a guest</button>
    </form>
  </main>
}

// ── Welcome after sign-up ────────────────────────────────────────────

function Welcome({ account, go, onContinue }: { account: AccountT; go: Go; onContinue: () => void }) {
  return <main className="acct-center">
    <section className="acct-card acct-welcome">
      <span className="acct-check"><Icon name="check" size={26} /></span>
      <h1>Welcome, {firstName(account)}!</h1>
      <p>Your Hair Xcellence account is ready. Your details will be filled in at checkout, and every order you place will appear in your account.</p>
      <div className="acct-actions">
        <button className="btn primary" onClick={() => go('shop', { category: 'All' })}>Start shopping</button>
        <button className="btn outline" onClick={onContinue}>Go to my account</button>
      </div>
    </section>
  </main>
}

// ── Signed-in dashboard ──────────────────────────────────────────────

function Dashboard({ account, go }: { account: AccountT; go: Go }) {
  const { signOut } = useAuth()
  const [tab, setTab] = useState<'overview' | 'orders' | 'details'>('overview')
  const [orders, setOrders] = useState<OrderResponse[] | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchMyOrders().then(setOrders).catch(e => { setOrders([]); setError(e instanceof Error ? e.message : '') })
  }, [])

  const latest = orders?.[0]
  const active = orders?.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length ?? 0

  return <main className="acct">
    <header className="acct-head">
      <div>
        <p className="acct-kicker">My account</p>
        <h1>{greeting()}, {firstName(account)}</h1>
        <p className="muted">{account.email}</p>
      </div>
      <button className="acct-link" onClick={async () => { await signOut(); go('home') }}>Sign out</button>
    </header>

    <nav className="acct-nav" role="tablist">
      {(['overview', 'orders', 'details'] as const).map(t => <button key={t} role="tab" aria-selected={tab === t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>
        {t === 'overview' ? 'Overview' : t === 'orders' ? `Orders${orders?.length ? ` (${orders.length})` : ''}` : 'My details'}
      </button>)}
    </nav>

    {error && <p className="co-error">{error}</p>}

    {tab === 'overview' && <div className="acct-grid">
      <section className="acct-card acct-span">
        <div className="acct-card-head"><h2>Latest order</h2>{latest && <button className="acct-link" onClick={() => setTab('orders')}>All orders</button>}</div>
        {orders === null ? <p className="muted">Loading your orders…</p>
          : latest ? <OrderCard order={latest} compact />
          : <div className="acct-empty"><p>You haven’t placed an order yet.</p><button className="btn primary" onClick={() => go('shop', { category: 'All' })}>Shop now</button></div>}
      </section>
      <section className="acct-card acct-stats">
        <div><b>{orders?.length ?? '–'}</b><span>orders</span></div>
        <div><b>{orders ? active : '–'}</b><span>in progress</span></div>
        <div><b>{new Date(account.date_joined).getFullYear()}</b><span>member since</span></div>
      </section>
      <section className="acct-card">
        <div className="acct-card-head"><h2>Delivery details</h2><button className="acct-link" onClick={() => setTab('details')}>Edit</button></div>
        {account.phone || account.address
          ? <p className="acct-address">{account.name}<br />{account.phone}<br />{account.address}{account.city && <><br />{account.city}, {account.region}</>}</p>
          : <p className="muted">Add your phone and address for faster checkout.</p>}
      </section>
    </div>}

    {tab === 'orders' && <div className="acct-orders">
      {orders === null ? <p className="muted">Loading your orders…</p>
        : orders.length ? orders.map(o => <section className="acct-card" key={o.number}><OrderCard order={o} /></section>)
        : <section className="acct-card acct-empty"><p>No orders yet. Orders you place while signed in will appear here.</p><button className="btn primary" onClick={() => go('shop', { category: 'All' })}>Shop now</button></section>}
    </div>}

    {tab === 'details' && <Details account={account} />}
  </main>
}

function Tracker({ status }: { status: string }) {
  if (status === 'cancelled') return <p className="acct-cancelled">This order was cancelled.</p>
  const at = STEPS.indexOf(status as typeof STEPS[number])
  return <ol className="acct-track">
    {STEPS.map((s, i) => <li key={s} className={i <= at ? 'done' : ''}><i>{i <= at ? <Icon name="check" size={11} /> : i + 1}</i><span>{STEP_LABEL[s]}</span></li>)}
  </ol>
}

function OrderCard({ order, compact = false }: { order: OrderResponse; compact?: boolean }) {
  return <div className="acct-order">
    <div className="acct-order-top">
      <div><strong>Order #{order.number}</strong><small>Placed {date(order.created_at)}</small></div>
      <div className="acct-order-meta">
        <span className={`acct-pill ${order.payment_status}`}>{PAY_LABEL[order.payment_status] ?? order.payment_status}</span>
        <b>{money(order.total)}</b>
      </div>
    </div>
    <Tracker status={order.status} />
    {!compact && <ul className="acct-items">{order.items.map((it, i) => <li key={i}>
      {it.image ? <img src={it.image} alt="" /> : <span className="acct-noimg" />}
      <div><strong>{it.product_name}</strong><small>{[...Object.values(it.options), ...it.addons].join(' · ')}</small></div>
      <span>{it.quantity} × {money(it.unit_price)}</span>
    </li>)}</ul>}
    {!compact && <p className="acct-order-foot muted">{order.delivery_method} · {order.payment_method} · Delivering to {order.city}, {order.region}</p>}
  </div>
}

function Details({ account }: { account: AccountT }) {
  const { setAccount } = useAuth()
  const [form, setForm] = useState({ name: account.name, phone: account.phone, address: account.address, city: account.city, region: account.region || 'Greater Accra' })
  const [state, setState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [error, setError] = useState('')
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => { const v = e.target.value; setForm(f => ({ ...f, [k]: v })); setState('idle') }

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setState('saving'); setError('')
    try { setAccount(await updateAccount(form)); setState('saved') }
    catch (err) { setError(err instanceof Error ? err.message : 'Could not save.'); setState('error') }
  }

  return <form className="acct-card acct-details" onSubmit={save}>
    <h2>My details</h2>
    <p className="muted">Used to fill in checkout for you.</p>
    <div className="form-grid">
      <label className="full"><span>Full name</span><input value={form.name} onChange={set('name')} autoComplete="name" required /></label>
      <label><span>Email</span><input value={account.email} disabled /></label>
      <label><span>Phone</span><input type="tel" value={form.phone} onChange={set('phone')} autoComplete="tel" /></label>
      <label className="full"><span>Delivery address</span><input value={form.address} onChange={set('address')} autoComplete="street-address" /></label>
      <label><span>City</span><input value={form.city} onChange={set('city')} autoComplete="address-level2" /></label>
      <label><span>Region</span><select value={form.region} onChange={set('region')}>{REGIONS.map(r => <option key={r}>{r}</option>)}</select></label>
    </div>
    {error && <p className="co-error">{error}</p>}
    <div className="acct-actions">
      <button className="btn primary" disabled={state === 'saving'}>{state === 'saving' ? 'Saving…' : 'Save details'}</button>
      {state === 'saved' && <span className="acct-saved"><Icon name="check" size={15} /> Saved</span>}
    </div>
  </form>
}
