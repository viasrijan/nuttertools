import { useState } from 'react'

import { Button } from '../../components/ui/Button'

function blobPath(points: number, jitter: number, seed = 1) {
  const rnd = mulberry(seed)
  const angle = (i: number) => (i / points) * Math.PI * 2
  let path = ''
  for (let i = 0; i < points; i++) {
    const a = angle(i)
    const r = 50 + (rnd() * 2 - 1) * jitter
    const x = 50 + r * Math.cos(a)
    const y = 50 + r * Math.sin(a)
    if (i === 0) path += `M ${x.toFixed(2)} ${y.toFixed(2)}`
    else {
      const p = angle(i - 1)
      const px = 50 + (50 + (rnd() * 2 - 1) * jitter) * Math.cos(p)
      const py = 50 + (50 + (rnd() * 2 - 1) * jitter) * Math.sin(p)
      const cx = (px + x) / 2, cy = (py + y) / 2
      path += ` C ${cx.toFixed(2)} ${cy.toFixed(2)}, ${cx.toFixed(2)} ${cy.toFixed(2)}, ${x.toFixed(2)} ${y.toFixed(2)}`
    }
  }
  return path + ' Z'
}
function mulberry(seed: number) {
  let a = seed
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
function waveSvg(kind: 'wave' | 'sine', color: string) {
  if (kind === 'wave') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="${color}" d="M0,160L60,176C120,192,240,224,360,213.3C480,203,600,149,720,138.7C840,128,960,160,1080,170.7C1200,181,1320,171,1380,165.3L1440,160L1440,320L0,320Z"/></svg>`
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="${color}" d="M0,192L80,160C160,128,320,64,480,74.7C640,85,800,171,960,202.7C1120,235,1280,213,1440,192L1440,320L0,320Z"/></svg>`
}

export default function BlobMaker() {
  const [color, setColor] = useState('#4F46E5')
  const [points, setPoints] = useState(8)
  const [jitter, setJitter] = useState(18)
  const [seed, setSeed] = useState(1)
  const [kind, setKind] = useState<'blob' | 'wave' | 'sine'>('blob')

  const svg = kind === 'blob'
    ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%"><path d="${blobPath(points, jitter, seed)}" fill="${color}"/></svg>`
    : waveSvg(kind, color)

  return (
    <div className="space-y-5 max-w-3xl omni-rise">
      <div className="flex flex-wrap gap-2.5">
        {(['blob', 'wave', 'sine'] as const).map(k => (
          <Button variant="outline" key={k} onClick={() => setKind(k)} className={`px-4 h-9 text-sm  ${kind === k ? 'bg-indigo-600 text-white shadow-[0_4px_14px_-4px_rgba(79,70,229,0.6)]' : ''}`}>{k}</Button>
        ))}
      </div>
      {kind === 'blob' ? (
        <div className="grid sm:grid-cols-3 gap-3">
          <label className="text-sm">Color <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-full h-10 mt-1 border" /></label>
          <label className="text-sm">Complexity ({points}) <input type="range" min={4} max={20} value={points} onChange={e => setPoints(parseInt(e.target.value))} className="w-full mt-2" /></label>
          <label className="text-sm">Jitter ({jitter}) <input type="range" min={0} max={40} value={jitter} onChange={e => setJitter(parseInt(e.target.value))} className="w-full mt-2" /></label>
        </div>
      ) : (
        <label className="block text-sm">Color <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-full h-10 mt-1 border" /></label>
      )}
      <div className="border p-4 bg-white">
        <div className="max-w-md mx-auto" dangerouslySetInnerHTML={{ __html: svg }} />
      </div>
      <div className="flex gap-2.5">
        <Button variant="secondary" size="sm" onClick={() => setSeed(Math.floor(Math.random() * 10000))}>Shuffle</Button>
        <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(svg)}>Copy SVG</Button>
        <a href={`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`} download={`${kind}.svg`} className="px-4 h-9 border text-sm inline-flex items-center">Download SVG</a>
      </div>
    </div>
  )
}
