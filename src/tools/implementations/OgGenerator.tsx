import { useRef, useState } from 'react'

import { Button } from '../../components/ui/Button'
import { DownloadButton } from '../../components/ui/DownloadButton'

export default function OgGenerator() {
  const [title, setTitle] = useState('NutterTools')
  const [sub, setSub] = useState('Every useful tool, all in one place')
  const [bg, setBg] = useState('#4F46E5')
  const [fg, setFg] = useState('#FFFFFF')
  const [accent, setAccent] = useState('#22D3EE')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const W = 1200, H = 630

  const draw = () => {
    const c = canvasRef.current!
    c.width = W; c.height = H
    const ctx = c.getContext('2d')!
    const g = ctx.createLinearGradient(0, 0, W, H)
    g.addColorStop(0, bg)
    g.addColorStop(1, shade(bg, -35))
    ctx.fillStyle = g
    ctx.fillRect(0, 0, W, H)
    ctx.fillStyle = 'rgba(255,255,255,0.08)'
    ctx.beginPath(); ctx.arc(W * 0.85, H * 0.2, 180, 0, Math.PI * 2); ctx.fill()
    ctx.beginPath(); ctx.arc(W * 0.1, H * 0.9, 120, 0, Math.PI * 2); ctx.fill()
    ctx.textAlign = 'left'
    ctx.fillStyle = fg
    ctx.font = '700 96px system-ui, sans-serif'
    ctx.fillText(title.slice(0, 16), 80, H / 2 - 20)
    ctx.font = '400 44px system-ui, sans-serif'
    ctx.fillStyle = accent
    ctx.fillText(sub.slice(0, 60), 80, H / 2 + 60)
    ctx.font = '500 30px system-ui, sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.7)'
    ctx.fillText('nuttertools', 80, H - 80)
  }

  function shade(hex: string, amt: number) {
    const n = parseInt(hex.slice(1), 16)
    let r = Math.max(0, Math.min(255, ((n >> 16) & 255) + amt))
    let g = Math.max(0, Math.min(255, ((n >> 8) & 255) + amt))
    let b = Math.max(0, Math.min(255, (n & 255) + amt))
    return `rgb(${r},${g},${b})`
  }

  const download = () => {
    draw()
    const a = document.createElement('a')
    a.href = canvasRef.current!.toDataURL('image/png')
    a.download = 'og-image.png'
    a.click()
  }

  const field = (label: string, v: string, set: (s: string) => void, type: 'text' | 'color' = 'text') => (
    <label className="block text-sm font-semibold">{label}
      <input type={type} value={v} onChange={e => set(e.target.value)} className="w-full border px-3 h-9 mt-1" />
    </label>
  )

  return (
    <div className="space-y-5 max-w-3xl omni-rise">
      <div className="grid sm:grid-cols-2 gap-3">
        {field('Title', title, setTitle)}
        {field('Subtitle', sub, setSub)}
        {field('Background', bg, setBg, 'color')}
        {field('Text color', fg, setFg, 'color')}
        {field('Accent color', accent, setAccent, 'color')}
      </div>
      <div className="flex gap-2.5">
        <Button variant="secondary" size="sm" onClick={draw}>Preview</Button>
        <DownloadButton onClick={download}>Download PNG (1200×630)</DownloadButton>
      </div>
      <canvas ref={canvasRef} className="w-full border  shadow" />
    </div>
  )
}
