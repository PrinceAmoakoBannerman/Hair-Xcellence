import { useState } from 'react'
import { type EnquiryTopic, sendEnquiry } from '../api'
import { useAuth } from '../auth'
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, MAPS_URL, PHONE_DISPLAY, PHONE_TEL, STORE_ADDRESS, whatsappLink } from '../data'
import { Icon } from '../ui'

const TOPICS: { value: EnquiryTopic; label: string }[] = [
  { value: 'request', label: 'Request a wig that isn’t on the site' },
  { value: 'choosing', label: 'Help choosing a wig' },
  { value: 'custom', label: 'Custom wig consultation' },
  { value: 'order', label: 'Order support' },
  { value: 'other', label: 'Something else' },
]

const PLACEHOLDER: Record<EnquiryTopic, string> = {
  request: 'Describe the wig you want: style, length, colour, lace, density… If you have a picture, mention it and we’ll ask for it on WhatsApp.',
  choosing: 'Tell us what you’re looking for and we’ll recommend a wig.',
  custom: 'What would you like us to make for you?',
  order: 'Your order number and how we can help.',
  other: 'Your message',
}

/**
 * Contact page with a form that saves to the admin (Enquiries).
 * `arg` can open it as a wig request: "request" or "request:<what they were looking at>".
 */
export function Contact({ arg = '' }: { arg?: string }) {
  const { account } = useAuth()
  const [argTopic, ...rest] = arg.split(':')
  const about = rest.join(':').trim()
  const [topic, setTopic] = useState<EnquiryTopic>(TOPICS.some(t => t.value === argTopic) ? (argTopic as EnquiryTopic) : 'choosing')
  const [form, setForm] = useState({ name: account?.name ?? '', phone: account?.phone ?? '', email: account?.email ?? '', message: '', needed_by: '', website: '' })
  const [product, setProduct] = useState(about)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm(f => ({ ...f, [k]: e.target.value }))
  const wantsDate = topic === 'request' || topic === 'custom'
  const today = new Date().toISOString().slice(0, 10)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.name.trim() || !form.phone.trim() || form.message.trim().length < 5) {
      setError('Please add your name, a phone or WhatsApp number, and a short message.')
      return
    }
    setBusy(true)
    try {
      await sendEnquiry({
        topic, name: form.name.trim(), phone: form.phone.trim(), email: form.email.trim(), message: form.message.trim(),
        product, needed_by: wantsDate && form.needed_by ? form.needed_by : null, website: form.website,
      })
      setSent(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return <main className="contact-page">
    <section className="contact-intro">
      <h1>Contact us</h1>
      <p>Questions about a wig, a custom order or your delivery? Can’t find the wig you want? Send us a message or a request and we’ll reply within one working day.</p>
      <a className="whatsapp" href={whatsappLink('Hi Hair Xcellence, I have a question.')} target="_blank" rel="noopener noreferrer"><Icon name="whatsapp" /> Chat with us on WhatsApp</a>
      <div className="contact-details">
        <p><small>CALL US</small><strong><a href={`tel:${PHONE_TEL}`}>{PHONE_DISPLAY}</a></strong></p>
        <p><small>EMAIL</small><strong>hello@hairxcellence.com</strong></p>
        <p><small>STUDIO</small><strong><a href={MAPS_URL} target="_blank" rel="noopener noreferrer">{STORE_ADDRESS}</a></strong><a className="text-link" href={MAPS_URL} target="_blank" rel="noopener noreferrer">Get directions</a></p>
        <p><small>FOLLOW</small><strong><a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">Instagram @{INSTAGRAM_HANDLE}</a></strong></p>
      </div>
    </section>

    <section className="contact-form">
      {sent ? <div className="sent">
        <Icon name="check" size={30} />
        <h2>{topic === 'request' ? 'Request received.' : 'Message received.'}</h2>
        <p>Thank you, {form.name.trim().split(/\s+/)[0]}. We’ll reply on WhatsApp or by phone ({form.phone.trim()}) within one working day.</p>
        <button className="text-link" onClick={() => { setSent(false); setForm(f => ({ ...f, message: '', needed_by: '' })) }}>Send another message</button>
      </div> : <form onSubmit={submit} noValidate>
        <h2>{topic === 'request' ? 'Request a wig' : 'Send a message'}</h2>
        <label><span>What can we help with?</span>
          <select value={topic} onChange={e => setTopic(e.target.value as EnquiryTopic)}>
            {TOPICS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </label>
        {product && <p className="enq-about">About: <b>{product}</b> <button type="button" onClick={() => setProduct('')} aria-label="Remove"><Icon name="x" size={14} /></button></p>}
        <label><span>Your name</span><input value={form.name} onChange={set('name')} autoComplete="name" placeholder="Full name" required /></label>
        <label><span>Phone or WhatsApp</span><input value={form.phone} onChange={set('phone')} type="tel" autoComplete="tel" placeholder="024 000 0000" required /></label>
        <label><span>Email address <em>(optional)</em></span><input value={form.email} onChange={set('email')} type="email" autoComplete="email" placeholder="you@example.com" /></label>
        {wantsDate && <label><span>Needed by <em>(optional)</em></span><input value={form.needed_by} onChange={set('needed_by')} type="date" min={today} /></label>}
        <label><span>{topic === 'request' ? 'What are you looking for?' : 'Your message'}</span>
          <textarea value={form.message} onChange={set('message')} rows={5} maxLength={2000} placeholder={PLACEHOLDER[topic]} required />
        </label>
        {/* Hidden from people; spam bots fill it in and are ignored. */}
        <input className="hp-field" name="website" value={form.website} onChange={set('website')} tabIndex={-1} autoComplete="off" aria-hidden="true" />
        {error && <p className="co-error" role="alert">{error}</p>}
        <button className="btn primary" disabled={busy}>{busy ? 'Sending…' : topic === 'request' ? 'Send request' : 'Send message'} <Icon name="arrow" /></button>
        <p className="enq-note">We reply on WhatsApp or by phone. For quick questions you can also <a href={whatsappLink('Hi Hair Xcellence, I have a question.')} target="_blank" rel="noopener noreferrer">message us on WhatsApp</a>.</p>
      </form>}
    </section>
  </main>
}
