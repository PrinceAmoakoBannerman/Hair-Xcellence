export type Page = 'home' | 'shop' | 'product' | 'cart' | 'checkout' | 'account' | 'about' | 'contact'
export type GoOpts = { id?: string; category?: string }
export type Go = (page: Page, opts?: GoOpts) => void

/**
 * Brand imagery lives in /public/images (WebP). The Unsplash shots fill out galleries
 * until more product photography is ready Swap any URL here to update the whole site.
 */
const local = (name: string) => `/images/${name}.webp`
const u = (id: string, w = 1100) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=85`
export const IMAGES = {
  // Hair Xcellence photography
  hero: local('hero-duo'),                     // homepage hero: black & burgundy waves
  colourEdit: local('hero-colour-collection'), // four looks: burgundy, ginger, platinum, curly
  bodyWhite: local('bodywave-white-mannequin'), // long body wave on white mannequin
  bodyBrown: local('bodywave-brown-mannequin'), // body wave on brown mannequin
  straight: local('straight-long'),            // long straight HD lace on mannequin
  curly: local('deep-curly'),                  // deep curly bob on mannequin
  waterWave: local('water-wave-mannequin'),    // shoulder-length water wave
  longWater: local('long-water-wave'),         // waist-length water wave
  burgundy: local('burgundy-body-wave'),       // burgundy 99J body wave
  layered: local('layered-straight'),          // layered straight, flipped ends
  straightSide: local('straight-side-profile'), // long straight, side profile
  bundles: local('body-wave-bundles'),         // four body wave bundles
  // Supporting wig shots (Unsplash)
  ginger: u('1663582815412-665909d70e01'),     // straight ginger wig on brown mannequin, beige wall
  red: u('1560264641-1b5191cc63e2'),           // auburn wavy hair, close-up texture
  soft: u('1763771444803-64684b6cae65'),       // shelves of wigs on mannequin heads
  dark: u('1791748825821-f1faa487f3ec'),       // long-hair mannequin in a window at dusk
  story: u('1570570525340-cc356a1383fb', 1300), // row of styled wigs on mannequins
  rack: u('1754327748419-715068469357'),       // rack of hair extensions / bundles
}

/** Next collection drop: drives the homepage countdown and early-access popup. */
export const NEXT_DROP = new Date('2026-11-27T18:00:00Z')

/** WhatsApp business number (international format, digits only) and opening hours. */
export const WHATSAPP = '233245550198'
export const SUPPORT_HOURS = 'Mon–Sat, 9am–7pm'
/** Instagram profile. */
export const INSTAGRAM_HANDLE = 'hairxcellence._'
export const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}/`
export const whatsappLink = (message: string) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`

export const money = (n: number) => `GH₵ ${n.toLocaleString()}`

export type Kind = 'wig' | 'bundle' | 'closure'
export type Availability = 'In stock' | 'Low stock' | 'Made to order'
export type Texture = 'Straight' | 'Body Wave' | 'Deep Wave' | 'Loose Wave' | 'Curly'

export type Product = {
  id: string
  name: string
  kind: Kind
  categories: string[]
  texture: Texture
  price: number // base price at the shortest length with default options
  availability: Availability
  rating: number
  reviews: number
  isNew?: boolean
  isBest?: boolean
  tag: string
  image: string
  gallery: string[]
  short: string
  description: string
  // short spec line shown on cards and in the cart
  detail: string
  /** Colour pre-selected on the product page (defaults to Natural Black). */
  colour?: string
  /** Sale discount as a fraction (0.3 = 30% off). Shows a struck-through compare-at price. */
  sale?: number
}

const g = (...imgs: string[]) => imgs

export const products: Product[] = [
  { id: 'hd-lace-body-wave-wig', name: 'HD Lace Body Wave Wig', kind: 'wig', categories: ['HD Lace Wigs', 'Frontal Wigs', 'Body Wave'], texture: 'Body Wave', price: 2450, availability: 'In stock', rating: 4.9, reviews: 214, isBest: true, tag: 'Bestseller', image: IMAGES.bodyBrown, gallery: g(IMAGES.bodyBrown, IMAGES.bodyWhite, IMAGES.red, IMAGES.ginger), short: 'Body wave wig on a 13×4 HD lace frontal.', description: 'Our best-selling wig. 100% human hair in a soft body wave, on a 13×4 HD lace frontal that blends with most skin tones. Pre-plucked hairline, adjustable straps and combs.', detail: 'HD Lace · Frontal · Body Wave' },
  { id: 'glueless-water-wave-wig', name: 'Glueless Water Wave Wig', kind: 'wig', categories: ['Glueless Wigs', 'Closure Wigs', 'Curly Hair'], texture: 'Curly', price: 2150, availability: 'In stock', rating: 4.8, reviews: 96, isNew: true, tag: 'New', image: IMAGES.waterWave, gallery: g(IMAGES.waterWave, IMAGES.curly, IMAGES.longWater, IMAGES.story), short: 'Water wave wig on a glueless closure cap.', description: 'Glueless closure wig with an elastic band and pre-cut lace, so you can put it on without glue. Water wave texture that can be worn wet-look or fluffed out.', detail: 'Glueless · Closure · Water Wave' },
  { id: 'bone-straight-hd-lace-frontal-wig', name: 'Bone Straight HD Lace Frontal Wig', kind: 'wig', categories: ['HD Lace Wigs', 'Frontal Wigs', 'Straight Hair'], texture: 'Straight', price: 2300, availability: 'Low stock', rating: 4.9, reviews: 158, isBest: true, tag: 'Bestseller', image: IMAGES.straightSide, gallery: g(IMAGES.straightSide, IMAGES.straight, IMAGES.layered, IMAGES.ginger), short: 'Bone straight wig on a 13×4 HD lace frontal.', description: 'Single-donor bone straight hair with a natural shine. Stays smooth after washing and can be curled with heat protectant.', detail: 'HD Lace · Frontal · Straight' },
  { id: 'layered-straight-glueless-wig', name: 'Layered Straight Glueless Wig', kind: 'wig', categories: ['Glueless Wigs', 'Closure Wigs', 'Straight Hair'], texture: 'Straight', price: 1950, availability: 'In stock', rating: 4.8, reviews: 77, isNew: true, tag: 'New', image: IMAGES.layered, gallery: g(IMAGES.layered, IMAGES.straightSide, IMAGES.straight), short: 'Layered straight wig with flipped ends, glueless.', description: 'Straight hair cut into face-framing layers with the ends flipped out. Comes on a glueless closure cap with an elastic band.', detail: 'Glueless · Closure · Layered Straight' },
  { id: 'hd-lace-deep-wave-frontal-wig', name: 'HD Lace Deep Wave Frontal Wig', kind: 'wig', categories: ['HD Lace Wigs', 'Frontal Wigs', 'Deep Wave'], texture: 'Deep Wave', price: 2550, availability: 'Made to order', rating: 4.8, reviews: 64, isNew: true, tag: 'New', image: IMAGES.bodyWhite, gallery: g(IMAGES.bodyWhite, IMAGES.bodyBrown, IMAGES.red, IMAGES.dark), short: 'Deep wave wig on a 13×6 HD lace frontal.', description: 'Defined deep wave texture on a 13×6 HD frontal, which gives you more room to part the hair. Made to order.', detail: 'HD Lace · Frontal · Deep Wave' },
  { id: 'custom-made-to-order-wig', name: 'Custom Made-to-Order Wig', kind: 'wig', categories: ['HD Lace Wigs', 'Glueless Wigs', 'Loose Wave'], texture: 'Loose Wave', price: 2600, availability: 'Made to order', rating: 5.0, reviews: 41, tag: 'Custom', image: IMAGES.colourEdit, gallery: g(IMAGES.colourEdit, IMAGES.hero, IMAGES.burgundy, IMAGES.ginger, IMAGES.longWater), short: 'A wig made to your exact choices.', description: 'Choose the length, texture, lace, density, colour, cap size and finishing. We make the wig to your order and ship it in 10–15 working days.', detail: 'Bespoke · Made to order' },
  { id: 'burgundy-99j-body-wave-glueless-wig', name: 'Burgundy 99J Body Wave Glueless Wig', kind: 'wig', categories: ['Glueless Wigs', 'Closure Wigs', 'Body Wave'], texture: 'Body Wave', price: 1950, availability: 'In stock', rating: 4.6, reviews: 52, isNew: true, tag: 'New', image: IMAGES.burgundy, gallery: g(IMAGES.burgundy, IMAGES.bodyWhite, IMAGES.bodyBrown, IMAGES.red), short: 'Burgundy 99J body wave wig, glueless.', description: 'Body wave hair coloured burgundy 99J, on a glueless closure cap with pre-cut lace. Also available in natural black.', detail: 'Glueless · Closure · Burgundy 99J', colour: 'Burgundy 99J' },
  { id: 'water-wave-hd-lace-frontal-wig', name: 'Water Wave HD Lace Frontal Wig', kind: 'wig', categories: ['HD Lace Wigs', 'Frontal Wigs', 'Curly Hair'], texture: 'Curly', price: 2700, availability: 'Low stock', rating: 4.9, reviews: 88, isBest: true, tag: 'Bestseller', image: IMAGES.longWater, gallery: g(IMAGES.longWater, IMAGES.waterWave, IMAGES.curly, IMAGES.bodyBrown), short: 'Long water wave wig on a 13×4 HD lace frontal.', description: 'Full water wave texture on a 13×4 HD frontal with a pre-plucked hairline. Best kept moisturised with a leave-in conditioner.', detail: 'HD Lace · Frontal · Water Wave' },
  { id: 'straight-hair-bundles', name: 'Straight Hair Bundles', kind: 'bundle', categories: ['Hair Bundles', 'Straight Hair'], texture: 'Straight', price: 650, availability: 'In stock', rating: 4.8, reviews: 132, isBest: true, tag: 'Sale', sale: 0.3, image: IMAGES.straight, gallery: g(IMAGES.straight, IMAGES.straightSide, IMAGES.rack), short: 'Straight human hair bundles. Price per bundle.', description: 'Single-donor straight bundles with full ends and minimal shedding. Most installs use three bundles; mix lengths for a layered look.', detail: 'Bundle · Straight' },
  { id: 'body-wave-hair-bundles', name: 'Body Wave Hair Bundles', kind: 'bundle', categories: ['Hair Bundles', 'Body Wave'], texture: 'Body Wave', price: 690, availability: 'In stock', rating: 4.7, reviews: 101, tag: 'Sale', sale: 0.3, image: IMAGES.bundles, gallery: g(IMAGES.bundles, IMAGES.bodyWhite, IMAGES.bodyBrown), short: 'Body wave human hair bundles. Price per bundle.', description: 'Body wave bundles that hold a curl and go back to their wave after washing. Most installs use three or four bundles.', detail: 'Bundle · Body Wave' },
  { id: 'hd-lace-closure', name: 'HD Lace Closure', kind: 'closure', categories: ['Closures and Frontals'], texture: 'Straight', price: 780, availability: 'In stock', rating: 4.8, reviews: 73, tag: 'Sale', sale: 0.3, image: IMAGES.waterWave, gallery: g(IMAGES.waterWave, IMAGES.straight, IMAGES.soft), short: 'HD lace closure, 4×4 or 5×5.', description: 'Thin HD lace closure for a natural-looking part. Choose 4×4 or 5×5, or a frontal size.', detail: 'Closure · HD Lace' },
  { id: 'hd-lace-frontal', name: 'HD Lace Frontal', kind: 'closure', categories: ['Closures and Frontals'], texture: 'Body Wave', price: 1150, availability: 'Low stock', rating: 4.9, reviews: 58, isNew: true, tag: 'Sale', sale: 0.3, image: IMAGES.bodyBrown, gallery: g(IMAGES.bodyBrown, IMAGES.straight, IMAGES.dark), short: 'Ear-to-ear HD lace frontal, 13×4 or 13×6.', description: 'Pre-plucked HD lace frontal that lets you part the hair anywhere or wear it pulled back.', detail: 'Frontal · HD Lace' },
]

export const CATEGORIES = ['HD Lace Wigs', 'Closure Wigs', 'Frontal Wigs', 'Glueless Wigs', 'Straight Hair', 'Body Wave', 'Deep Wave', 'Curly Hair', 'Hair Bundles', 'Closures and Frontals']
export const TEXTURES: Texture[] = ['Straight', 'Body Wave', 'Deep Wave', 'Loose Wave', 'Curly']

/** Pseudo-categories used by the main navigation. */
export const matchesCategory = (p: Product, category: string) =>
  category === 'All' || (category === 'All Wigs' ? p.kind === 'wig' : p.categories.includes(category))

// ─── Customisation pricing ───────────────────────────────────────────
export type Option = { label: string; price: number; hint?: string; swatch?: string }
export type OptionGroup = { key: string; title: string; style: 'pill' | 'card' | 'swatch'; options: Option[]; note?: string }

/**
 * Production time for wigs. Customers can pay to have their wig made faster.
 * Edit the fees (GH₵) and turnaround times here.
 */
export const PRODUCTION: Option[] = [
  { label: 'Standard', price: 0, hint: 'Ready in 10–15 working days' },
  { label: 'Express', price: 400, hint: 'Ready in 5–7 working days' },
  { label: 'Priority', price: 800, hint: 'Ready in 48–72 hours' },
]

export const LENGTHS = ['10"', '12"', '14"', '16"', '18"', '20"', '22"', '24"', '26"', '28"', '30"', '32"']

export function groupsFor(p: Product): OptionGroup[] {
  const lengthStep = p.kind === 'bundle' ? 60 : p.kind === 'closure' ? 70 : 180
  const length: OptionGroup = { key: 'length', title: 'Hair length', style: 'pill', options: LENGTHS.map((label, i) => ({ label, price: i * lengthStep })) }
  const texture: OptionGroup = { key: 'texture', title: 'Hair texture', style: 'pill', options: [
    { label: 'Straight', price: 0 }, { label: 'Body Wave', price: 0 }, { label: 'Deep Wave', price: p.kind === 'wig' ? 150 : 40 }, { label: 'Loose Wave', price: p.kind === 'wig' ? 100 : 30 }, { label: 'Curly', price: p.kind === 'wig' ? 200 : 50 },
  ] }
  const laceType: OptionGroup = { key: 'laceType', title: 'Lace type', style: 'card', options: [
    { label: 'Transparent Lace', price: 0, hint: 'Clear, versatile, durable' }, { label: 'HD Lace', price: 350, hint: 'Thinnest, most undetectable' }, { label: 'Swiss Lace', price: 200, hint: 'Soft, breathable, strong' },
  ] }
  const laceSize: OptionGroup = { key: 'laceSize', title: 'Lace size', style: 'card', options: [
    { label: '4×4 Closure', price: 0, hint: 'Middle or side part' }, { label: '5×5 Closure', price: 250, hint: 'Wider parting space' }, { label: '13×4 Frontal', price: 550, hint: 'Ear-to-ear hairline' }, { label: '13×6 Frontal', price: 850, hint: 'Deep, free parting' },
  ] }
  const density: OptionGroup = { key: 'density', title: 'Density', style: 'pill', note: 'Higher density = fuller look', options: [
    { label: '150%', price: 0, hint: 'Natural' }, { label: '180%', price: 300, hint: 'Full' }, { label: '200%', price: 550, hint: 'Extra full' }, { label: '250%', price: 900, hint: 'Glam' },
  ] }
  const colour: OptionGroup = { key: 'colour', title: 'Hair colour', style: 'swatch', options: [
    { label: 'Natural Black', price: 0, swatch: '#2a211e' }, { label: 'Jet Black', price: 80, swatch: '#0d0b0b' }, { label: 'Chocolate Brown', price: 250, swatch: '#5a3524' }, { label: 'Burgundy 99J', price: 400, swatch: '#5e1a2c' }, { label: 'Ginger', price: 450, swatch: '#b0582a' }, { label: 'Honey Blonde', price: 450, swatch: '#c49453' },
  ] }
  const cap: OptionGroup = { key: 'cap', title: 'Cap size', style: 'pill', note: 'Medium fits most (22–22.5")', options: [
    { label: 'Small', price: 0, hint: '21–21.5"' }, { label: 'Medium', price: 0, hint: '22–22.5"' }, { label: 'Large', price: 0, hint: '23–23.5"' },
  ] }
  if (p.kind === 'bundle') return [length, texture, colour]
  if (p.kind === 'closure') return [length, texture, laceType, laceSize, colour]
  const production: OptionGroup = { key: 'production', title: 'Production time', style: 'card', note: 'Need it sooner? Choose express or priority and we move your wig to the front of the queue.', options: PRODUCTION }
  return [length, texture, laceType, laceSize, density, colour, cap, production]
}

export const ADDONS: Option[] = [
  { label: 'Bleached knots', price: 120, hint: 'Knots lightened for a scalp-like finish' },
  { label: 'Pre-plucked hairline', price: 150, hint: 'Natural, graduated hairline' },
  { label: 'Baby hair', price: 100, hint: 'Soft, laid edges' },
  { label: 'Custom styling', price: 300, hint: 'Cut, curl or layer by our stylists' },
]

export function defaultChoices(p: Product): Record<string, string> {
  const pick: Record<string, string> = {}
  for (const grp of groupsFor(p)) pick[grp.key] = grp.options[0].label
  pick.texture = p.texture
  if (p.colour && pick.colour !== undefined) pick.colour = p.colour
  if (pick.cap !== undefined) pick.cap = 'Medium'
  if (p.categories.includes('HD Lace Wigs')) pick.laceType = 'HD Lace'
  if (p.categories.includes('Frontal Wigs')) pick.laceSize = '13×4 Frontal'
  if (p.kind === 'wig') pick.length = '18"'
  return pick
}

/** Price of the default configuration, used as the "from" price on cards. */
export function priceFor(p: Product, choices: Record<string, string>, addons: string[]) {
  let total = p.price
  for (const grp of groupsFor(p)) total += grp.options.find(o => o.label === choices[grp.key])?.price ?? 0
  for (const a of addons) total += ADDONS.find(o => o.label === a)?.price ?? 0
  return total
}

/** Human-readable value of a chosen option, e.g. production time reads "Express production". */
export const choiceLabel = (key: string, value: string) => (key === 'production' ? `${value} production` : value)

/** The "from" price on cards: exactly the price set in the admin (shortest length, cheapest options). */
export const startingPrice = (p: Product) => p.price

/** Original price shown struck through when a product is on sale (rounded to the nearest 10). */
export const compareAtPrice = (p: Product) => (p.sale ? Math.round(startingPrice(p) / (1 - p.sale) / 10) * 10 : undefined)
