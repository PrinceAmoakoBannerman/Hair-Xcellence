import { useEffect, useMemo, useState } from 'react'
import { type Availability, type Go, type Product, type Texture, CATEGORIES, TEXTURES, matchesCategory, products, startingPrice } from '../data'
import { Icon, ProductCard } from '../ui'

const PRICE_BANDS = [
  { label: 'Under GH₵ 1,500', min: 0, max: 1499 },
  { label: 'GH₵ 1,500 – 3,000', min: 1500, max: 3000 },
  { label: 'GH₵ 3,000 – 4,500', min: 3001, max: 4500 },
  { label: 'Over GH₵ 4,500', min: 4501, max: Infinity },
]
const AVAIL: Availability[] = ['In stock', 'Low stock', 'Made to order']
const SORTS = ['Featured', 'Best selling', 'Newest', 'Price: low to high', 'Price: high to low'] as const
type Sort = typeof SORTS[number]

const TITLES: Record<string, string> = { All: 'Shop all', 'All Wigs': 'All wigs' }

export default function Shop({ go, category, onQuickView }: { go: Go; category: string; onQuickView: (p: Product) => void }) {
  const [cat, setCat] = useState(category)
  const [q, setQ] = useState('')
  const [bands, setBands] = useState<string[]>([])
  const [textures, setTextures] = useState<Texture[]>([])
  const [avail, setAvail] = useState<Availability[]>([])
  const [sort, setSort] = useState<Sort>('Featured')
  const [drawer, setDrawer] = useState(false)
  useEffect(() => setCat(category), [category])

  const toggle = <T,>(list: T[], set: (x: T[]) => void, v: T) => set(list.includes(v) ? list.filter(x => x !== v) : [...list, v])
  const clear = () => { setBands([]); setTextures([]); setAvail([]); setQ('') }
  const activeCount = bands.length + textures.length + avail.length

  const results = useMemo(() => {
    const s = q.trim().toLowerCase()
    const list = products.filter(p => {
      const price = startingPrice(p)
      return matchesCategory(p, cat)
        && (!s || [p.name, p.detail, p.short, ...p.categories].join(' ').toLowerCase().includes(s))
        && (bands.length === 0 || PRICE_BANDS.some(b => bands.includes(b.label) && price >= b.min && price <= b.max))
        && (textures.length === 0 || textures.includes(p.texture))
        && (avail.length === 0 || avail.includes(p.availability))
    })
    const by: Record<Sort, (a: Product, b: Product) => number> = {
      'Featured': () => 0,
      'Best selling': (a, b) => b.reviews - a.reviews,
      'Newest': (a, b) => Number(!!b.isNew) - Number(!!a.isNew),
      'Price: low to high': (a, b) => startingPrice(a) - startingPrice(b),
      'Price: high to low': (a, b) => startingPrice(b) - startingPrice(a),
    }
    return [...list].sort(by[sort])
  }, [cat, q, bands, textures, avail, sort])

  const filters = <>
    <div className="f-group"><h4>Price</h4>{PRICE_BANDS.map(b => <label key={b.label} className="check"><input type="checkbox" checked={bands.includes(b.label)} onChange={() => toggle(bands, setBands, b.label)} /><span />{b.label}</label>)}</div>
    <div className="f-group"><h4>Hair texture</h4>{TEXTURES.map(t => <label key={t} className="check"><input type="checkbox" checked={textures.includes(t)} onChange={() => toggle(textures, setTextures, t)} /><span />{t}<small>{products.filter(p => p.texture === t && matchesCategory(p, cat)).length}</small></label>)}</div>
    <div className="f-group"><h4>Availability</h4>{AVAIL.map(a => <label key={a} className="check"><input type="checkbox" checked={avail.includes(a)} onChange={() => toggle(avail, setAvail, a)} /><span />{a}</label>)}</div>
    {activeCount > 0 && <button className="text-link" onClick={clear}>Clear all filters</button>}
  </>

  return <main className="shop">
    <section className="shop-hero">
      <p className="crumbs"><button onClick={() => go('home')}>Home</button> / <span>Shop</span>{cat !== 'All' && <> / <span>{cat}</span></>}</p>
      <h1>{TITLES[cat] ?? cat}</h1>
      <p>100% human hair wigs, bundles and closures. Most wigs can be customised.</p>
    </section>

    <div className="cat-strip" role="tablist" aria-label="Categories">
      {['All', 'All Wigs', ...CATEGORIES].map(c => <button key={c} role="tab" aria-selected={cat === c} className={cat === c ? 'on' : ''} onClick={() => setCat(c)}>{c === 'All' ? 'Shop all' : c}</button>)}
    </div>

    <div className="shop-layout">
      <aside className="filters" aria-label="Filters">{filters}</aside>

      <section>
        <div className="toolbar">
          <div className="shop-search"><Icon name="search" size={18} /><input value={q} onChange={e => setQ(e.target.value)} placeholder="Search the collection" aria-label="Search products" />{q && <button onClick={() => setQ('')} aria-label="Clear search"><Icon name="x" size={16} /></button>}</div>
          <button className="filter-btn" onClick={() => setDrawer(true)}><Icon name="sliders" size={18} /> Filters{activeCount > 0 && <b>{activeCount}</b>}</button>
          <span className="count">{results.length} {results.length === 1 ? 'piece' : 'pieces'}</span>
          <label className="sort"><span>Sort by</span><select value={sort} onChange={e => setSort(e.target.value as Sort)}>{SORTS.map(s => <option key={s}>{s}</option>)}</select></label>
        </div>
        {activeCount > 0 && <div className="chips">{[...bands, ...textures, ...avail].map(v => <button key={v} onClick={() => { setBands(bands.filter(x => x !== v)); setTextures(textures.filter(x => x !== v)); setAvail(avail.filter(x => x !== v)) }}>{v} <Icon name="x" size={12} /></button>)}</div>}
        {results.length === 0 ? <div className="no-results"><h2>No pieces match your selection.</h2><p>Try removing a filter, or let us create something custom for you.</p><div><button className="btn outline" onClick={() => { clear(); setCat('All') }}>Reset filters</button><button className="btn primary" onClick={() => go('product', { id: 'custom-made-to-order-wig' })}>Design a custom wig</button></div></div> :
          <div className="grid-3">{results.map(p => <ProductCard key={p.id} product={p} go={go} onQuickView={onQuickView} />)}</div>}
      </section>
    </div>

    <div className={`drawer-bg ${drawer ? 'open' : ''}`} onClick={() => setDrawer(false)}>
      <aside className="drawer drawer-right" onClick={e => e.stopPropagation()} aria-label="Filters">
        <div className="drawer-top"><strong className="drawer-title">Filters</strong><button className="icon-btn" onClick={() => setDrawer(false)} aria-label="Close filters"><Icon name="x" /></button></div>
        <div className="filters mobile">{filters}</div>
        <button className="btn primary wide" onClick={() => setDrawer(false)}>Show {results.length} pieces</button>
      </aside>
    </div>
  </main>
}
