import { useState } from 'react'
import { type Go, money, whatsappLink } from '../data'
import { Icon } from '../ui'
import { type CartItem, shortDetail } from './Store'

const DELIVERY = [
  { name: 'Accra express', time: '1–2 working days', fee: 60 },
  { name: 'Standard delivery', time: '2–5 working days', fee: 80 },
]
const PAYMENTS = ['MTN Mobile Money', 'Telecel Cash', 'AT Money', 'Debit / Credit Card']
const REGIONS = ['Greater Accra', 'Ashanti', 'Central', 'Eastern', 'Western', 'Volta', 'Northern', 'Upper East', 'Upper West', 'Bono', 'Bono East', 'Ahafo', 'Western North', 'Oti', 'Savannah', 'North East']

type Contact = { name: string; email: string; phone: string; address: string; city: string; region: string }
type Order = { number: string; date: string; items: CartItem[]; subtotal: number; deliveryFee: number; delivery: typeof DELIVERY[number]; payment: string; contact: Contact }

const required: (keyof Contact)[] = ['name', 'email', 'phone', 'address', 'city']
const LABELS: Record<keyof Contact, string> = { name: 'Full name', email: 'Email address', phone: 'Phone number', address: 'Delivery address', city: 'City', region: 'Region' }

/** Rushed production picked on any item (shown on the receipt). */
const rushOf = (items: CartItem[]) => {
  const all = items.flatMap(x => x.detail.split(' · '))
  return all.find(x => x === 'Priority production') ?? all.find(x => x === 'Express production')
}

export function Checkout({ items, go, onPlaced }: { items: CartItem[]; go: Go; onPlaced: () => void }) {
  const [contact, setContact] = useState<Contact>({ name: '', email: '', phone: '', address: '', city: '', region: 'Greater Accra' })
  const [errors, setErrors] = useState<Partial<Record<keyof Contact, string>>>({})
  const [delivery, setDelivery] = useState(DELIVERY[0])
  const [payment, setPayment] = useState(PAYMENTS[0])
  const [order, setOrder] = useState<Order | null>(null)
  const subtotal = items.reduce((s, x) => s + x.price * x.qty, 0)

  if (order) return <Confirmation order={order} go={go} />

  if (items.length === 0) return <main className="checkout-empty">
    <h1>Your bag is empty</h1>
    <p>Add a wig, bundle or closure to check out.</p>
    <button className="btn primary" onClick={() => go('shop', { category: 'All' })}>Shop now</button>
  </main>

  // Functional updates so several fields changing at once (browser autofill) don't overwrite each other.
  const set = (k: keyof Contact) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.value
    setContact(c => ({ ...c, [k]: value }))
    setErrors(er => (er[k] ? { ...er, [k]: undefined } : er))
  }

  const placeOrder = () => {
    const next: typeof errors = {}
    for (const k of required) if (!contact[k].trim()) next[k] = `Enter your ${LABELS[k].toLowerCase()}`
    if (contact.email && !/^\S+@\S+\.\S+$/.test(contact.email)) next.email = 'Enter a valid email address'
    setErrors(next)
    if (Object.keys(next).length) { document.querySelector('.co-main .has-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); return }
    setOrder({
      number: `HX-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      items, subtotal, deliveryFee: delivery.fee, delivery, payment, contact,
    })
    onPlaced()
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  const field = (k: keyof Contact, extra: React.InputHTMLAttributes<HTMLInputElement> = {}, full = false) =>
    <label className={`${full ? 'full' : ''} ${errors[k] ? 'has-error' : ''}`}>
      <span>{LABELS[k]}</span>
      <input value={contact[k]} onChange={set(k)} aria-invalid={!!errors[k]} {...extra} />
      {errors[k] && <em className="field-error">{errors[k]}</em>}
    </label>

  const summary = <>
    <ul className="co-items">{items.map((x, i) => <li key={i}>
      <div className="od-thumb"><img src={x.image} alt="" /><b>{x.qty}</b></div>
      <div><strong>{x.name}</strong><small>{shortDetail(x.detail, 3)}</small></div>
      <span>{money(x.price * x.qty)}</span>
    </li>)}</ul>
    <dl className="od-totals">
      <div><dt>Subtotal</dt><dd>{money(subtotal)}</dd></div>
      <div><dt>Delivery · {delivery.name}</dt><dd>{money(delivery.fee)}</dd></div>
      <div className="grand"><dt>Total</dt><dd>{money(subtotal + delivery.fee)}</dd></div>
    </dl>
    {rushOf(items) && <p className="co-note"><Icon name="truck" size={15} /> {rushOf(items)} selected. Your wig moves to the front of the queue.</p>}
  </>

  return <main className="co">
    <header className="co-bar">
      <button className="co-back" onClick={() => go('cart')}><Icon name="chevron" size={16} /> Bag</button>
      <button className="brand" onClick={() => go('home')} aria-label="Hair Xcellence home"><strong>HAIR</strong><i>X</i><strong>CELLENCE</strong></button>
      <span className="co-secure"><Icon name="shield" size={15} /> Secure checkout</span>
    </header>

    <details className="co-mobile-summary">
      <summary><span><Icon name="cart" size={18} /> Show order summary <Icon name="chevron" size={14} /></span><b>{money(subtotal + delivery.fee)}</b></summary>
      <div className="co-mobile-body">{summary}</div>
    </details>

    <div className="co-grid">
      <div className="co-main">
        <section className="co-card">
          <h2><i>1</i> Contact</h2>
          <div className="form-grid">
            {field('email', { type: 'email', placeholder: 'ama@example.com', autoComplete: 'email' })}
            {field('phone', { type: 'tel', placeholder: '024 000 0000', autoComplete: 'tel' })}
          </div>
          <p className="co-hint">We’ll send your order confirmation and delivery updates here.</p>
        </section>

        <section className="co-card">
          <h2><i>2</i> Delivery address</h2>
          <div className="form-grid">
            {field('name', { placeholder: 'Ama Mensah', autoComplete: 'name' }, true)}
            {field('address', { placeholder: 'House number, street name, landmark', autoComplete: 'street-address' }, true)}
            {field('city', { placeholder: 'Accra', autoComplete: 'address-level2' })}
            <label><span>Region</span><select value={contact.region} onChange={set('region')}>{REGIONS.map(r => <option key={r}>{r}</option>)}</select></label>
          </div>
        </section>

        <section className="co-card">
          <h2><i>3</i> Delivery method</h2>
          <div className="co-options">{DELIVERY.map(d => <label key={d.name} className={`co-option ${delivery.name === d.name ? 'on' : ''}`}>
            <input type="radio" name="delivery" checked={delivery.name === d.name} onChange={() => setDelivery(d)} />
            <span className="co-radio" />
            <span className="co-opt-text"><strong>{d.name}</strong><small>{d.time}</small></span>
            <b>{money(d.fee)}</b>
          </label>)}</div>
        </section>

        <section className="co-card">
          <h2><i>4</i> Payment</h2>
          <div className="co-options">{PAYMENTS.map((x, i) => <label key={x} className={`co-option ${payment === x ? 'on' : ''}`}>
            <input type="radio" name="payment" checked={payment === x} onChange={() => setPayment(x)} />
            <span className="co-radio" />
            <span className="co-opt-text"><strong>{x}</strong>{i < 3 && <small>You’ll approve the payment on your phone</small>}</span>
            <span className={`pay ${['momo', 'telecel', 'at', 'visa'][i]}`}>{['MoMo', 'Telecel', 'AT', 'VISA'][i]}</span>
          </label>)}</div>
          <button className="btn primary wide co-pay" onClick={placeOrder}>Pay {money(subtotal + delivery.fee)}</button>
          <p className="secure-note"><Icon name="shield" size={15} /> Payments are processed securely by Paystack.</p>
        </section>
      </div>

      <aside className="co-side">
        <section className="co-card">
          <h2>Order summary</h2>
          {summary}
        </section>
      </aside>
    </div>
  </main>
}

function Confirmation({ order, go }: { order: Order; go: Go }) {
  const { contact } = order
  const first = contact.name.trim().split(/\s+/)[0]
  const rush = rushOf(order.items)
  const steps = ['Confirmed', 'Processing', 'Shipped', 'Delivered']
  return <main className="order-done">
    <div className="od-wrap">
      <header className="od-head">
        <span className="od-check"><Icon name="check" size={22} /></span>
        <div>
          <p className="od-num">Order #{order.number}</p>
          <h1>Thank you{first ? `, ${first}` : ''}!</h1>
        </div>
      </header>
      <p className="od-lead">Your order is confirmed. We’ve sent a confirmation to <b>{contact.email}</b> and we’ll message you on <b>{contact.phone}</b> when it ships.</p>

      <ol className="od-steps" aria-label="Order progress">
        {steps.map((s, i) => <li key={s} className={i === 0 ? 'done' : ''}><i>{i === 0 ? <Icon name="check" size={12} /> : i + 1}</i><span>{s}</span></li>)}
      </ol>

      <div className="od-grid">
        <section className="od-card">
          <h2>Order summary</h2>
          <ul className="od-items">{order.items.map((x, i) => <li key={i}>
            <div className="od-thumb"><img src={x.image} alt="" /><b>{x.qty}</b></div>
            <div><strong>{x.name}</strong><small>{shortDetail(x.detail, 3)}</small></div>
            <span>{money(x.price * x.qty)}</span>
          </li>)}</ul>
          <dl className="od-totals">
            <div><dt>Subtotal</dt><dd>{money(order.subtotal)}</dd></div>
            <div><dt>Delivery</dt><dd>{money(order.deliveryFee)}</dd></div>
            <div className="grand"><dt>Total paid</dt><dd>{money(order.subtotal + order.deliveryFee)}</dd></div>
          </dl>
        </section>

        <section className="od-card">
          <h2>Order details</h2>
          <dl className="od-details">
            <div><dt>Order number</dt><dd>{order.number}</dd></div>
            <div><dt>Order date</dt><dd>{order.date}</dd></div>
            <div><dt>Payment</dt><dd>{order.payment}</dd></div>
            <div><dt>Delivery</dt><dd>{order.delivery.name} · {order.delivery.time}</dd></div>
            {rush && <div><dt>Production</dt><dd>{rush}</dd></div>}
          </dl>
          <h3>Contact</h3>
          <p>{contact.name}<br />{contact.email}<br />{contact.phone}</p>
          <h3>Delivery address</h3>
          <p>{contact.address}<br />{contact.city}, {contact.region}<br />Ghana</p>
        </section>
      </div>

      <div className="od-actions">
        <button className="btn primary" onClick={() => go('shop', { category: 'All' })}>Continue shopping</button>
        <button className="btn outline" onClick={() => go('account')}>Track order</button>
      </div>
      <p className="od-help">Questions about your order? <a href={whatsappLink(`Hi Hair Xcellence, I have a question about order ${order.number}.`)} target="_blank" rel="noopener noreferrer">Message us on WhatsApp</a></p>
    </div>
  </main>
}
