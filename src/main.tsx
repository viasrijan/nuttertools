import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import App from './App'
import './index.css'

const syncRangeFill = (el: HTMLInputElement) => {
  if (el.type !== 'range') return
  const min = el.min !== '' ? parseFloat(el.min) : 0
  const max = el.max !== '' ? parseFloat(el.max) : 100
  const pct = max > min ? ((parseFloat(el.value) - min) / (max - min)) * 100 : 50
  el.style.setProperty('--fill', `${Math.max(0, Math.min(100, pct))}%`)
}

document.addEventListener('input', (e) => {
  const t = e.target as HTMLElement
  if (t instanceof HTMLInputElement && t.type === 'range') syncRangeFill(t)
})

const mo = new MutationObserver((muts) => {
  for (const m of muts) {
    for (const n of m.addedNodes) {
      if (!(n instanceof HTMLElement)) continue
      if (n instanceof HTMLInputElement && n.type === 'range') syncRangeFill(n)
      n.querySelectorAll?.('input[type=range]').forEach((i) => syncRangeFill(i as HTMLInputElement))
    }
  }
})
mo.observe(document.body, { childList: true, subtree: true })

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter><App/></HashRouter>
    <Analytics />
  </React.StrictMode>
)
