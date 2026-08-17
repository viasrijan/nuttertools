import { useMemo, useState } from 'react'

const AI_PHRASES = ['delve', 'delve into', 'tapestry', 'it is important to note', 'in today\'s fast-paced', 'in the realm of', 'furthermore', 'moreover', 'additionally', 'in conclusion', 'to summarize', 'leverage', 'cutting-edge', 'game-changer', 'unlock', 'unleash', 'revolutionize', 'seamless', 'seamlessly', 'robust', 'comprehensive', 'elevate', 'navigate the', 'landscape', 'as an ai', 'as a language model', 'overall', 'all in all', 'in essence', 'arguably', 'undoubtedly', 'notably', 'crucially', 'importantly', 'significant', 'showcase', 'showcasing', 'utilize', 'utilizing']

export default function AiContentDetector() {
  const [text, setText] = useState('')

  const res = useMemo(() => {
    const t = text.toLowerCase()
    const words = t.match(/[a-z']+/g) || []
    const total = words.length
    if (!total) return null
    const phrases = AI_PHRASES.filter(p => t.includes(p)).length
    const uniq = new Set(words).size
    const trr = total ? (uniq / total) : 0
    const sent = t.split(/[.!?]+/).filter(s => s.trim().length > 3)
    const lens = sent.map(s => s.trim().split(/\s+/).length)
    const avg = lens.length ? lens.reduce((a, b) => a + b, 0) / lens.length : 0
    const varSum = lens.reduce((a, l) => a + (l - avg) ** 2, 0)
    const variance = lens.length ? Math.sqrt(varSum / lens.length) : 0
    let score = 0
    score += phrases * 6
    if (trr > 0.5) score -= 8
    if (trr < 0.35) score += 8
    if (variance < 2.5) score += 12
    if (variance > 6) score -= 10
    const pct = Math.max(0, Math.min(97, Math.round(score)))
    return {
      pct,
      phrases,
      trr: trr.toFixed(2),
      variance: variance.toFixed(1),
      label: pct > 65 ? 'Likely AI-generated' : pct > 40 ? 'Possibly AI-assisted' : 'Looks human-written',
      color: pct > 65 ? '#dc2626' : pct > 40 ? '#ea580c' : '#16a34a',
    }
  }, [text])

  return (
    <div className="space-y-5">
      <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Paste text to analyze…" className="w-full h-[240px] border p-3 text-sm" />
      {res && text.trim() && (
        <div className="space-y-5">
          <div className=" border border-zinc-200/80 dark:border-zinc-700/80 bg-white/50 dark:bg-zinc-900/50 p-5 transition-all duration-200 hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.12)]">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold" style={{ color: res.color }}>{res.label}</span>
              <span className="text-2xl font-bold font-mono" style={{ color: res.color }}>{res.pct}%</span>
            </div>
            <div className="h-3 bg-zinc-200 dark:bg-zinc-800  overflow-hidden">
              <div className="h-full transition-all" style={{ width: `${res.pct}%`, background: res.color }} />
            </div>
            <div className="grid grid-cols-3 gap-2 text-center mt-3 text-xs">
              <div className="border p-2"><div className="font-bold text-sm">{res.phrases}</div>AI buzz phrases</div>
              <div className="border p-2"><div className="font-bold text-sm">{res.trr}</div>Type-token ratio</div>
              <div className="border p-2"><div className="font-bold text-sm">{res.variance}</div>Sentence variance</div>
            </div>
          </div>
          <p className="text-[11px] text-zinc-500">Heuristic analysis (phrase frequency + vocabulary richness + sentence uniformity). It is an indicator, not proof — AI detectors are known to flag human text.</p>
        </div>
      )}
    </div>
  )
}
