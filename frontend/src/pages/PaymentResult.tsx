import { useEffect, useState } from 'react'
import { type OrderResponse, startPayment, verifyPayment } from '../api'
import { type Go, choiceLabel, whatsappLink } from '../data'
import { Icon } from '../ui'
import { Confirmation, DELIVERY, type Order } from './Checkout'

type State =
  | { kind: 'checking' }
  | { kind: 'done'; order: OrderResponse }
  | { kind: 'error'; message: string }

/** Turn the backend's order into the receipt shown after checkout. */
function toReceipt(o: OrderResponse): Order {
  return {
    number: o.number,
    date: new Date(o.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
    items: o.items.map(it => ({
      productId: it.product ?? '', choices: it.options, addons: it.addons, name: it.product_name,
      detail: [...Object.entries(it.options).map(([k, v]) => choiceLabel(k, v)), ...it.addons].join(' · '),
      price: it.unit_price, image: it.image, tag: '', qty: it.quantity,
    })),
    subtotal: o.subtotal,
    deliveryFee: o.delivery_fee,
    delivery: DELIVERY.find(d => d.name === o.delivery_method) ?? { name: o.delivery_method, time: '', fee: o.delivery_fee },
    payment: o.payment_method,
    contact: { name: o.name, email: o.email, phone: o.phone, address: o.address, city: o.city, region: o.region },
  }
}

/** Customers land here after paying on Paystack. The backend confirms the payment with Paystack. */
export default function PaymentResult({ reference, go }: { reference: string; go: Go }) {
  const [state, setState] = useState<State>({ kind: 'checking' })

  useEffect(() => {
    let cancelled = false
    verifyPayment(reference)
      .then(r => { if (!cancelled) setState({ kind: 'done', order: r.order }) })
      .catch(e => { if (!cancelled) setState({ kind: 'error', message: e instanceof Error ? e.message : 'Something went wrong.' }) })
    return () => { cancelled = true }
  }, [reference])

  const payAgain = async (o: OrderResponse) => {
    try { window.location.href = (await startPayment(o.number, o.email)).authorization_url }
    catch (e) { setState({ kind: 'error', message: e instanceof Error ? e.message : 'Could not start payment.' }) }
  }

  if (state.kind === 'done') {
    const paid = state.order.payment_status === 'paid'
    return <Confirmation order={toReceipt(state.order)} go={go} paid={paid} onPay={paid ? undefined : () => payAgain(state.order)} />
  }

  if (state.kind === 'checking') return <main className="pay-wait">
    <div className="pay-slim" role="status"><span className="pay-spinner" aria-hidden /><p><strong>Confirming your payment…</strong><small>This only takes a moment.</small></p></div>
  </main>

  return <main className="acct-center">
    <section className="acct-card acct-welcome pay-result">
      <span className="acct-check pay-warn">!</span>
      <h1>We couldn’t confirm the payment yet</h1>
      <p>{state.message} If money left your account, don’t pay again; message us with your order number and we’ll check.</p>
      <div className="acct-actions">
        <button className="btn primary" onClick={() => window.location.reload()}><Icon name="return" size={16} /> Check again</button>
        <a className="btn outline" href={whatsappLink(`Hi Hair Xcellence, please check my payment (reference ${reference}).`)} target="_blank" rel="noopener noreferrer">Message us on WhatsApp</a>
      </div>
    </section>
  </main>
}
