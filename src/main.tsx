import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

/**
 * Hide the splash once the page is ready (fonts + above-the-fold images),
 * but never keep visitors waiting: it is shown for at least MIN_MS to avoid
 * a flicker and at most MAX_MS no matter how slow the network is.
 */
const MIN_MS = 1600
const MAX_MS = 2500

function hideSplash() {
  const splash = document.getElementById('splash')
  if (!splash) return
  splash.classList.add('hide')
  setTimeout(() => splash.remove(), 500)
}

const pageReady = new Promise<void>(resolve => {
  if (document.readyState === 'complete') resolve()
  else window.addEventListener('load', () => resolve(), { once: true })
}).then(() => document.fonts?.ready)

const elapsed = performance.now()
Promise.race([
  Promise.all([pageReady, new Promise(r => setTimeout(r, Math.max(0, MIN_MS - elapsed)))]),
  new Promise(r => setTimeout(r, Math.max(0, MAX_MS - elapsed))),
]).then(hideSplash)
