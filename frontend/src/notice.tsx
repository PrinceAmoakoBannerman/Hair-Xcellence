import { useEffect, useState } from 'react'
import { type ApiStatus, checkConnection, onApiStatus } from './api'
import { whatsappLink } from './data'
import { Icon } from './ui'

/**
 * Small message at the bottom of the screen when the shop's server is slow or can't be reached,
 * or the shopper's device is offline. Browsing keeps working either way (products are kept in the browser).
 */
export function ServiceNotice() {
  const [status, setStatus] = useState<ApiStatus>('ok')
  const [offline, setOffline] = useState(() => typeof navigator !== 'undefined' && navigator.onLine === false)
  const [dismissed, setDismissed] = useState(false)
  const [checking, setChecking] = useState(false)

  useEffect(() => onApiStatus(s => { setStatus(s); if (s !== 'ok') setDismissed(false) }), [])
  useEffect(() => {
    const on = () => { setOffline(false); void checkConnection() }
    const off = () => { setOffline(true); setDismissed(false) }
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off) }
  }, [])

  const retry = async () => {
    setChecking(true)
    await checkConnection()
    setChecking(false)
  }

  const kind = offline ? 'offline' : status
  if (kind === 'ok' || dismissed) return null

  return <div className={`svc-notice svc-${kind}`} role="status" aria-live="polite">
    {kind === 'slow' ? <span className="svc-spin" aria-hidden /> : <span className="svc-dot" aria-hidden>!</span>}
    <p>
      {kind === 'offline' && <><strong>You’re offline.</strong> Check your internet connection. You can keep browsing; we’ll reconnect automatically.</>}
      {kind === 'slow' && <><strong>Connecting to the shop…</strong> This can take up to a minute the first time. Please keep this page open.</>}
      {kind === 'down' && <><strong>We can’t reach the shop right now.</strong> You can keep browsing; sign-in and checkout will work again shortly.{' '}
        <a href={whatsappLink('Hi Hair Xcellence, your website is not loading for me.')} target="_blank" rel="noopener noreferrer">Message us on WhatsApp</a></>}
    </p>
    {kind === 'down' && <button className="svc-retry" onClick={retry} disabled={checking}>{checking ? 'Checking…' : 'Try again'}</button>}
    {kind !== 'slow' && <button className="svc-close" onClick={() => setDismissed(true)} aria-label="Dismiss"><Icon name="x" size={16} /></button>}
  </div>
}
