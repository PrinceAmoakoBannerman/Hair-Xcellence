import { IMAGES, MAPS_URL } from '../data'

/** First n option details, plus the production speed when the customer paid to rush it. */
export const shortDetail = (detail: string, n: number) => {
  const parts = detail.split(' · ')
  const rush = parts.find(x => x.endsWith(' production') && !x.startsWith('Standard'))
  return [...parts.slice(0, n), ...(rush && !parts.slice(0, n).includes(rush) ? [rush] : [])].join(' · ')
}

/** A bag line. productId / choices / addons are sent to the backend, which recalculates the price. */
export type CartItem = { productId: string; choices: Record<string, string>; addons: string[]; name: string; detail: string; price: number; image: string; tag: string; qty: number }
export function About() { return <main><section className="editorial-hero"><img src={IMAGES.colourEdit} alt="Hair Xcellence wigs in burgundy, ginger, platinum and black"/><div><h1>About Hair Xcellence</h1></div></section><section className="story-intro"><h2>Human hair wigs, bundles and closures from Accra.</h2><div><p>Hair Xcellence sells 100% human hair wigs, bundles, closures and frontals. Every wig is checked and finished in our Accra studio before it is shipped.</p><p>You can buy a ready-to-ship wig or have one made to order. Custom wigs let you choose the length, texture, lace, density, colour and cap size.</p></div></section><section className="values"><div><h3>Ready to ship</h3><p>In-stock wigs leave our studio within 1–2 working days.</p></div><div><h3>Made to order</h3><p>Custom wigs are ready in 10–15 working days, or faster with express or priority production. We send updates at each stage.</p></div><div><h3>Delivery</h3><p>Accra 1–2 days, rest of Ghana 2–5 days, international 5–10 days. All parcels are tracked.</p></div></section><section className="split-story"><img src={IMAGES.burgundy} alt="Burgundy body wave wig on a mannequin"/><div><h2>Visit or message us</h2><p>Our studio is on Odotei Tsui Street, Accra (<a className="text-link" href={MAPS_URL} target="_blank" rel="noopener noreferrer">get directions</a>). Fittings and collections are by appointment.</p><p>For help choosing a wig or planning a custom order, message us on WhatsApp or send an enquiry.</p></div></section></main> }



