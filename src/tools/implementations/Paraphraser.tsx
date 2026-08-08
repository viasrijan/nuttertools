import { useState } from 'react'

const SYNONYMS: Record<string, string[]> = {
  good: ['excellent', 'great', 'superb', 'outstanding', 'fine'],
  bad: ['poor', 'terrible', 'awful', 'substandard', 'inferior'],
  big: ['large', 'huge', 'enormous', 'substantial', 'massive'],
  small: ['little', 'tiny', 'compact', 'modest', 'minor'],
  happy: ['delighted', 'pleased', 'thrilled', 'content', 'joyful'],
  sad: ['unhappy', 'downcast', 'gloomy', 'sorrowful', 'dejected'],
  important: ['crucial', 'vital', 'essential', 'significant', 'key'],
  beautiful: ['stunning', 'gorgeous', 'attractive', 'lovely', 'elegant'],
  fast: ['quick', 'rapid', 'swift', 'speedy', 'brisk'],
  slow: ['sluggish', 'gradual', 'leisurely', 'unhurried'],
  easy: ['simple', 'straightforward', 'effortless', 'uncomplicated'],
  difficult: ['challenging', 'hard', 'tough', 'demanding', 'arduous'],
  help: ['assist', 'aid', 'support', 'lend a hand'],
  show: ['display', 'demonstrate', 'present', 'reveal'],
  make: ['create', 'produce', 'build', 'construct', 'generate'],
  use: ['utilize', 'employ', 'leverage', 'apply'],
  need: ['require', 'necessitate', 'call for'],
  want: ['desire', 'wish', 'seek', 'aspire to'],
  think: ['believe', 'consider', 'reckon', 'suppose', 'imagine'],
  know: ['understand', 'recognize', 'comprehend', 'be aware of'],
  get: ['obtain', 'acquire', 'receive', 'secure'],
  give: ['provide', 'offer', 'supply', 'grant'],
  find: ['discover', 'locate', 'uncover', 'identify'],
  start: ['begin', 'commence', 'initiate', 'launch', 'kick off'],
  end: ['finish', 'conclude', 'terminate', 'wrap up'],
  look: ['observe', 'examine', 'inspect', 'glance'],
  see: ['view', 'witness', 'spot', 'glimpse'],
  very: ['extremely', 'exceptionally', 'remarkably', 'immensely'],
  really: ['truly', 'genuinely', 'actually', 'certainly'],
  many: ['numerous', 'countless', 'various', 'plenty of'],
  always: ['consistently', 'constantly', 'invariably', 'continually'],
  often: ['frequently', 'regularly', 'commonly', 'repeatedly'],
  first: ['initial', 'primary', 'foremost', 'leading'],
  new: ['fresh', 'novel', 'modern', 'recent'],
  old: ['ancient', 'former', 'dated', 'outdated'],
  try: ['attempt', 'strive', 'endeavor', 'aim'],
  change: ['modify', 'alter', 'adjust', 'transform'],
  wrong: ['incorrect', 'mistaken', 'inaccurate', 'erroneous'],
  right: ['correct', 'accurate', 'proper', 'appropriate'],
  smart: ['intelligent', 'clever', 'brilliant', 'astute'],
  strong: ['powerful', 'robust', 'sturdy', 'vigorous'],
  weak: ['feeble', 'frail', 'flimsy', 'vulnerable'],
  interesting: ['engaging', 'fascinating', 'captivating', 'intriguing'],
  boring: ['dull', 'tedious', 'monotonous', 'uninteresting'],
}

export default function Paraphraser() {
  const [input, setInput] = useState('The quick brown fox jumps over the lazy dog. This is a very good example of an interesting sentence that uses many common words. We often think that simple things are easy, but in reality they can be difficult.')
  const [mode, setMode] = useState<'light' | 'heavy'>('light')

  const paraphrase = (): string => {
    const rate = mode === 'light' ? 0.45 : 0.85
    return input
      .split(/(\s+)/)
      .map(tok => {
        const w = tok.toLowerCase().replace(/[^a-z']/g, '')
        const opts = SYNONYMS[w]
        if (opts && Math.random() < rate) {
          const sub = opts[Math.floor(Math.random() * opts.length)]
          const punct = tok.match(/[^a-zA-Z']+$/) || ''
          const cap = /^[A-Z]/.test(tok)
          const s = cap ? sub[0].toUpperCase() + sub.slice(1) : sub
          return s + punct
        }
        return tok
      })
      .join('')
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 text-sm">
        <button onClick={() => setMode('light')} className={`px-4 h-9 border ${mode === 'light' ? 'bg-zinc-900 text-white' : ''}`}>Light (45% words)</button>
        <button onClick={() => setMode('heavy')} className={`px-4 h-9 border ${mode === 'heavy' ? 'bg-zinc-900 text-white' : ''}`}>Heavy (85% words)</button>
      </div>
      <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Paste text to paraphrase…" className="w-full h-[160px] border p-3 text-sm" />
      <div className="flex gap-2">
        <button onClick={() => navigator.clipboard.writeText(paraphrase())} className="px-5 h-10 bg-zinc-900 text-white text-sm">Paraphrase & copy</button>
      </div>
      <p className="text-[11px] text-zinc-500">AI-free: swaps words for synonyms from a built-in dictionary. Great for drafts, not for SEO gaming.</p>
    </div>
  )
}
