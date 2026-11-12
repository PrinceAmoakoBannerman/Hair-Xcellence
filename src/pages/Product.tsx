import { useEffect, useMemo, useState } from 'react'
import { type Go, type Option, type OptionGroup, type Product as P, ADDONS, defaultChoices, groupsFor, money, priceFor, products } from '../data'
import { Availability, Icon, ProductCard } from '../ui'

export type Configured = { product: P; choices: Record<string, string>; addons: string[]; qty: number; unitPrice: number }

const delta = (n: number) => (n === 0 ? 'Included' : `+${money(n)}`)

function Group({ group, value, onPick }: { group: OptionGroup; value: string; onPick: (v: string) => void }) {
  const current = group.options.find(o => o.label === value)
  return <fieldset className="opt-group">
    <legend><span>{group.title}</span><b>{value}{current && current.price > 0 && <em> · {delta(current.price)}</em>}</b></legend>
    {group.note && <p className="opt-note">{group.note}</p>}
    <div className={`opt-${group.style}`}>
      {group.options.map((o: Option) => {
        const on = o.label === value
        if (group.style === 'swatch') return <button key={o.label} className={`swatch ${on ? 'on' : ''}`} onClick={() => onPick(o.label)} aria-pressed={on} title={`${o.label} · ${delta(o.price)}`}><i style={{ background: o.swatch }} /><span>{o.label}</span></button>
        if (group.style === 'card') return <button key={o.label} className={`tile ${on ? "on" : ""}`} onClick={() => onPick(o.label)} aria-pressed={on}><span className="tick">{on && <Icon name="check" size={12} />}</span><strong>{o.label}</strong><small>{o.hint}</small><em>{delta(o.price)}</em></button>
        return <button key={o.label} className={`pill ${on ? 'on' : ''}`} onClick={() => onPick(o.label)} aria-pressed={on}>{o.label}{o.hint && group.key !== 'length' && <small>{o.hint}</small>}</button>
      })}
    </div>
  </fieldset>
}

function Accordion({ title, children, open = false }: { title: string; children: React.ReactNode; open?: boolean }) {
  return <details className="acc" open={open}><summary>{title}<Icon name="plus" size={16} /></summary><div className="acc-body">{children}</div></details>
}

export default function Product({ id, go, onAdd, onBuy }: { id: string; go: Go; onAdd: (c: Configured) => void; onBuy: (c: Configured) => void }) {
  const product = products.find(p => p.id === id) ?? products[0]
  const groups = useMemo(() => groupsFor(product), [product])
  const [choices, setChoices] = useState(() => defaultChoices(product))
  const [addons, setAddons] = useState<string[]>([])
  const [qty, setQty] = useState(1)
  const [img, setImg] = useState(0)
  const [added, setAdded] = useState(false)
  useEffect(() => { setChoices(defaultChoices(product)); setAddons([]); setQty(1); setImg(0) }, [product])
  useEffect(() => { if (!added) return; const t = setTimeout(() => setAdded(false), 2200); return () => clearTimeout(t) }, [added])

  const unit = priceFor(product, choices, addons)
  const base = priceFor(product, defaultChoices(product), [])
  const config: Configured = { product, choices, addons, qty, unitPrice: unit }
  const toggleAddon = (a: string) => setAddons(addons.includes(a) ? addons.filter(x => x !== a) : [...addons, a])
  const related = products.filter(p => p.id !== product.id && p.kind === product.kind).slice(0, 4)
  const hasAddons = product.kind !== 'bundle'

  return <main className="pdp">
    <p className="crumbs pdp-crumbs"><button onClick={() => go('home')}>Home</button> / <button onClick={() => go('shop', { category: product.categories[0] })}>{product.categories[0]}</button> / <span>{product.name}</span></p>

    <div className="pdp-layout">
      {/* Gallery */}
      <section className="gallery" aria-label="Product images">
        <div className="thumbs">{product.gallery.map((src, i) => <button key={i} className={i === img ? 'on' : ''} onClick={() => setImg(i)} aria-label={`Image ${i + 1}`}><img src={src} alt="" /></button>)}</div>
        <div className="main-img">
          <img key={img} src={product.gallery[img]} alt={product.name} />
          {product.tag && <span className="p-card-tag">{product.tag}</span>}
          <div className="img-nav">
            <button onClick={() => setImg((img - 1 + product.gallery.length) % product.gallery.length)} aria-label="Previous image"><Icon name="chevron" size={18} /></button>
            <span>{img + 1} / {product.gallery.length}</span>
            <button onClick={() => setImg((img + 1) % product.gallery.length)} aria-label="Next image"><Icon name="chevron" size={18} /></button>
          </div>
        </div>
      </section>

      {/* Buy box */}
      <section className="buybox">
        <p className="eyebrow">{product.categories.join(' · ')}</p>
        <h1>{product.name}</h1>
        <div className="price-row">
          <strong className="price" aria-live="polite">{money(unit)}</strong>
          {unit !== base && <span className="price-from">Base {money(base)} · <b>+{money(unit - base)}</b> customisation</span>}
        </div>
        <Availability value={product.availability} />
        <p className="pdp-desc">{product.description}</p>

        <div className="customise">
          <div className="customise-head"><h2>Customise your {product.kind === 'bundle' ? 'bundle' : product.kind === 'closure' ? 'piece' : 'wig'}</h2><button className="text-link small" onClick={() => { setChoices(defaultChoices(product)); setAddons([]) }}>Reset</button></div>
          {groups.map(gr => <Group key={gr.key} group={gr} value={choices[gr.key]} onPick={v => setChoices({ ...choices, [gr.key]: v })} />)}
          {hasAddons && <fieldset className="opt-group">
            <legend><span>Finishing touches</span><b>{addons.length ? `${addons.length} selected` : 'Optional'}</b></legend>
            <div className="opt-addons">{ADDONS.map(a => { const on = addons.includes(a.label); return <button key={a.label} className={`addon ${on ? 'on' : ''}`} onClick={() => toggleAddon(a.label)} aria-pressed={on}><span className="box">{on && <Icon name="check" size={12} />}</span><span><strong>{a.label}</strong><small>{a.hint}</small></span><em>+{money(a.price)}</em></button> })}</div>
          </fieldset>}
        </div>

        <div className="summary-box">
          <div><span>Your selection</span><p>{groups.map(gr => choices[gr.key]).join(' · ')}{addons.length > 0 && ` · ${addons.join(' · ')}`}</p></div>
          <div className="buy-row">
            <div className="qty" aria-label="Quantity"><button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease quantity"><Icon name="minus" size={15} /></button><span>{qty}</span><button onClick={() => setQty(qty + 1)} aria-label="Increase quantity"><Icon name="plus" size={15} /></button></div>
            <button className="btn primary grow" onClick={() => { onAdd(config); setAdded(true) }}>{added ? <>Added to bag <Icon name="check" size={16} /></> : <>Add to cart · {money(unit * qty)}</>}</button>
          </div>
          <button className="btn outline wide" onClick={() => onBuy(config)}>Buy now</button>
        </div>

        <ul className="perks">
          <li><Icon name="truck" size={18} /><span><strong>Delivery</strong>Accra 1–2 days · Ghana 2–5 days · International 5–10 days{product.availability === 'Made to order' && '. Made-to-order pieces dispatch in 10–15 working days.'}</span></li>
          <li><Icon name="return" size={18} /><span><strong>Easy returns</strong>Unworn ready-to-ship pieces within 7 days. Custom pieces are final sale.</span></li>
          <li><Icon name="shield" size={18} /><span><strong>Secure checkout</strong>Mobile Money and card payments via Paystack.</span></li>
        </ul>

        <div className="accs">
          <Accordion title="Product specifications" open>
            <dl className="specs">
              <dt>Hair type</dt><dd>100% virgin human hair, single donor</dd>
              <dt>Texture</dt><dd>{choices.texture}</dd>
              {choices.laceType && <><dt>Lace</dt><dd>{choices.laceType}{choices.laceSize && `, ${choices.laceSize}`}</dd></>}
              {choices.density && <><dt>Density</dt><dd>{choices.density}</dd></>}
              {choices.cap && <><dt>Cap</dt><dd>{choices.cap}, adjustable straps & combs</dd></>}
              <dt>Can be coloured</dt><dd>Yes, up to 613 (by a professional)</dd>
              <dt>Lifespan</dt><dd>12–24 months with proper care</dd>
            </dl>
          </Accordion>
          <Accordion title="Care instructions">
            <ul className="care"><li>Detangle gently from ends to roots with a wide-tooth comb.</li><li>Wash every 10–14 wears with sulphate-free shampoo and lukewarm water.</li><li>Condition generously, then air-dry on a wig stand.</li><li>Use heat protectant and keep tools below 180°C.</li><li>Store in the satin bag provided, away from direct sunlight.</li></ul>
          </Accordion>
          <Accordion title="Delivery & returns"><p>Orders placed before 2pm are dispatched the same working day. All parcels are tracked and insured. Need help? Message our specialists on WhatsApp.</p></Accordion>
        </div>
      </section>
    </div>

    {related.length > 0 && <section className="sec related-sec">
      <div className="sec-head"><h2>You may also like</h2></div>
      <div className="grid-4">{related.map(p => <ProductCard key={p.id} product={p} go={go} />)}</div>
    </section>}

    {/* Mobile sticky purchase bar */}
    <div className="sticky-buy">
      <span><small>Total</small><strong>{money(unit * qty)}</strong></span>
      <button className="btn primary" onClick={() => { onAdd(config); setAdded(true) }}>{added ? 'Added ✓' : 'Add to cart'}</button>
    </div>
  </main>
}
