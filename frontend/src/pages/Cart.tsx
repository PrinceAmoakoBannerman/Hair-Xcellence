import { type Go, money, productionFee, productionFeeEach } from '../data'
import { useProducts } from '../store'
import { Icon, ProductRail } from '../ui'
import { type CartItem, shortDetail } from './Store'

/** Small payment badges shared by the bag and checkout. */
export function PayBadges() {
  return <ul className="pay-badges" aria-label="Accepted payment methods">
    <li className="pay momo">MTN MoMo</li>
    <li className="pay telecel">Telecel Cash</li>
    <li className="pay at">AT Money</li>
    <li className="pay visa">VISA</li>
    <li className="pay mc"><i /><i /><span className="sr-only">Mastercard</span></li>
  </ul>
}

export function Cart({ items, setItems, go }: { items: CartItem[]; setItems: (x: CartItem[]) => void; go: Go }) {
  const { products } = useProducts()
  const count = items.reduce((s, x) => s + x.qty, 0)
  const subtotal = items.reduce((s, x) => s + x.price * x.qty, 0)
  const rushFee = productionFee(items)
  const setQty = (i: number, d: number) => setItems(items.map((x, j) => (j === i ? { ...x, qty: Math.max(1, x.qty + d) } : x)))
  const remove = (i: number) => setItems(items.filter((_, j) => j !== i))
  const suggestions = products.filter(p => p.isBest && !items.some(x => x.name === p.name))

  return <main className="bag">
    <div className="bag-wrap">
      <header className="bag-head">
        <h1>Your bag {count > 0 && <span>({count})</span>}</h1>
        <button className="text-link small" onClick={() => go('shop', { category: 'All' })}>Continue shopping</button>
      </header>

      {items.length === 0 ? <div className="bag-empty">
        <Icon name="cart" size={36} />
        <h2>Your bag is empty</h2>
        <p>Browse wigs, bundles and closures, or build a custom wig.</p>
        <button className="btn primary" onClick={() => go('shop', { category: 'All' })}>Shop now</button>
      </div> :

      <div className="bag-grid">
        <ul className="bag-items">{items.map((x, i) => <li key={`${x.name}-${i}`} className="bag-item">
          <img src={x.image} alt={x.name} />
          <div className="bag-info">
            <div className="bag-top">
              <strong>{x.name}</strong>
              <span className="bag-price">{money((x.price - productionFeeEach(x.choices)) * x.qty)}</span>
            </div>
            <p>{shortDetail(x.detail, 4)}</p>
            {x.qty > 1 && <small>{money(x.price - productionFeeEach(x.choices))} each</small>}
            <div className="bag-actions">
              <div className="stepper" aria-label={`Quantity for ${x.name}`}>
                <button onClick={() => setQty(i, -1)} disabled={x.qty <= 1} aria-label="Decrease quantity"><Icon name="minus" size={14} /></button>
                <span>{x.qty}</span>
                <button onClick={() => setQty(i, 1)} aria-label="Increase quantity"><Icon name="plus" size={14} /></button>
              </div>
              <button className="bag-remove" onClick={() => remove(i)}>Remove</button>
            </div>
          </div>
        </li>)}</ul>

        <aside className="bag-summary">
          <h2>Order summary</h2>
          <dl>
            <div><dt>Subtotal</dt><dd>{money(subtotal - rushFee.fee)}</dd></div>
            {rushFee.fee > 0 && <div className="od-rush"><dt>{rushFee.label}</dt><dd>{money(rushFee.fee)}</dd></div>}
            <div><dt>Delivery</dt><dd className="muted">Calculated at checkout</dd></div>
            <div className="grand"><dt>Total</dt><dd>{money(subtotal)}</dd></div>
          </dl>
          <button className="btn primary wide" onClick={() => go('checkout')}>Checkout</button>
          <p className="secure-note"><Icon name="shield" size={15} /> Secure checkout with Paystack</p>
          <PayBadges />
        </aside>
      </div>}
    </div>

    {suggestions.length > 0 && <ProductRail title="You may also like" items={suggestions} go={go} />}
  </main>
}
