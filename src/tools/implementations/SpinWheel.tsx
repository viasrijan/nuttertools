import { useEffect, useRef, useState } from 'react'

import { Button } from '../../components/ui/Button'

const COLORS = ['#6366f1', '#f97316', '#10b981', '#ec4899', '#14b8a6', '#f59e0b', '#8b5cf6', '#ef4444']

export default function SpinWheel() {
  const [items, setItems] = useState('Pizza\nSushi\nBurgers\nTacos\nSalad\nPasta')
  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rotRef = useRef(0)

  const list = items.split('\n').map((s) => s.trim()).filter(Boolean)

  useEffect(() => {
    rotRef.current = rotation
  }, [rotation])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || list.length === 0) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const size = canvas.width
    const cx = size / 2
    const r = size / 2 - 4
    ctx.clearRect(0, 0, size, size)
    const n = list.length
    const slice = (Math.PI * 2) / n
    ctx.save()
    ctx.translate(cx, cx)
    ctx.rotate(rotRef.current)
    list.forEach((item, i) => {
      const start = i * slice - Math.PI / 2
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.arc(0, 0, r, start, start + slice)
      ctx.closePath()
      ctx.fillStyle = COLORS[i % COLORS.length]
      ctx.fill()
      ctx.strokeStyle = 'rgba(255,255,255,0.6)'
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.save()
      ctx.rotate(start + slice / 2)
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 14px Inter, sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText(item.length > 12 ? item.slice(0, 11) + '…' : item, r - 12, 5)
      ctx.restore()
    })
    ctx.restore()
    ctx.beginPath()
    ctx.arc(0, 0, 12, 0, Math.PI * 2)
    ctx.fillStyle = '#fff'
    ctx.fill()
    ctx.strokeStyle = '#18181b'
    ctx.lineWidth = 3
    ctx.stroke()
  }, [list, rotation])

  const spin = () => {
    if (list.length === 0 || spinning) return
    setSpinning(true)
    setResult('')
    const start = rotRef.current
    const spins = 5 + Math.floor(Math.random() * 4)
    const target = start + spins * Math.PI * 2 + Math.random() * Math.PI * 2
    const duration = 4000
    const t0 = performance.now()
    const ease = (t: number) => 1 - Math.pow(1 - t, 3)
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / duration)
      rotRef.current = start + (target - start) * ease(t)
      setRotation(rotRef.current)
      if (t < 1) {
        requestAnimationFrame(step)
      } else {
        setSpinning(false)
        const n = list.length
        const slice = (Math.PI * 2) / n
        let a = (rotRef.current % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2)
        a = (a + Math.PI / 2 + slice / 2) % (Math.PI * 2)
        const idx = Math.floor((Math.PI * 2 - a) / slice) % n
        setResult(list[idx])
      }
    }
    requestAnimationFrame(step)
  }

  return (
    <div className="space-y-5 max-w-xl omni-rise">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
        <div>
          <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">Wheel options (one per line)</label>
          <textarea value={items} onChange={(e) => { setItems(e.target.value); setResult('') }} rows={7} spellCheck={false}
            className="w-full border bg-transparent p-3 font-mono text-[13px] text-zinc-900 dark:text-white outline-none focus:border-indigo-600" />
        </div>
        <div className="relative">
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10 w-0 h-0 border-l-[10px] border-r-[10px] border-t-[16px] border-l-transparent border-r-transparent border-t-green-500" />
          <canvas ref={canvasRef} width={320} height={320}
            className="w-full max-w-[320px] mx-auto  border-4 border-zinc-900 dark:border-white/80" />
        </div>
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <button onClick={spin} disabled={list.length === 0 || spinning}
          className={`px-6 h-11 bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600 text-sm font-semibold ${list.length === 0 || spinning ? 'opacity-50' : ''}`}>
          {spinning ? 'Spinning…' : 'Spin the wheel'}
        </button>
        {result && (
          <div className="text-lg font-black tracking-tight text-green-600 dark:text-green-400">It landed on: {result}</div>
        )}
      </div>
      {list.length < 2 && <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Add at least 2 options.</p>}
    </div>
  )
}
