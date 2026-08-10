import { useMemo, useState } from 'react'

export default function LlmTokenCounter() {
  const [text, setText] = useState('')
  const [model, setModel] = useState('gpt-4o')
  const [priceIn, setPriceIn] = useState('2.50')
  const [priceOut, setPriceOut] = useState('10.00')

  const MODELS: Record<string, { label: string, perToken: number, input: string, output: string }> = {
    'gpt-4o': { label: 'GPT-4o', perToken: 4, input: '2.50', output: '10.00' },
    'gpt-4o-mini': { label: 'GPT-4o mini', perToken: 4, input: '0.15', output: '0.60' },
    'gpt-4.1': { label: 'GPT-4.1', perToken: 4, input: '2.00', output: '8.00' },
    'claude': { label: 'Claude Sonnet 4', perToken: 3.5, input: '3.00', output: '15.00' },
    'llama': { label: 'Llama 3.1 70B', perToken: 4, input: '0.70', output: '2.80' },
    'deepseek': { label: 'DeepSeek V3', perToken: 3, input: '0.27', output: '1.10' },
    'gemini': { label: 'Gemini 2.0 Flash', perToken: 4, input: '0.10', output: '0.40' },
  }

  const stats = useMemo(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0
    const tokens = Math.ceil(words * MODELS[model].perToken / 3)
    const inCost = tokens / 1e6 * parseFloat(priceIn || '0')
    const outCost = tokens / 1e6 * parseFloat(priceOut || '0')
    return { words, chars: text.length, tokens, inCost, outCost }
  }, [text, model, priceIn, priceOut])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <div className="border p-3 text-center"><div className="text-xl font-bold">{stats.tokens.toLocaleString()}</div><div className="text-[11px] font-semibold text-zinc-900 dark:text-white">Tokens (est.)</div></div>
        <div className="border p-3 text-center"><div className="text-xl font-bold">{stats.words.toLocaleString()}</div><div className="text-[11px] font-semibold text-zinc-900 dark:text-white">Words</div></div>
        <div className="border p-3 text-center"><div className="text-xl font-bold">{stats.chars.toLocaleString()}</div><div className="text-[11px] font-semibold text-zinc-900 dark:text-white">Characters</div></div>
        <div className="border p-3 text-center"><div className="text-xl font-bold">${(stats.inCost + stats.outCost).toFixed(4)}</div><div className="text-[11px] font-semibold text-zinc-900 dark:text-white">Est. cost</div></div>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <label className="font-semibold text-zinc-900 dark:text-white">Model</label>
        <select value={model} onChange={e => { const m = MODELS[e.target.value]; setModel(e.target.value); setPriceIn(m.input); setPriceOut(m.output) }} className="border px-2 py-2 bg-white dark:bg-zinc-900">
          {Object.entries(MODELS).map(([k, m]) => <option key={k} value={k}>{m.label}</option>)}
        </select>
        <label className="font-semibold text-zinc-900 dark:text-white">$ in/1M</label>
        <input value={priceIn} onChange={e => setPriceIn(e.target.value)} className="border px-2 py-2 w-20" />
        <label className="font-semibold text-zinc-900 dark:text-white">$ out/1M</label>
        <input value={priceOut} onChange={e => setPriceOut(e.target.value)} className="border px-2 py-2 w-20" />
      </div>
      <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Paste text to count tokens…" className="w-full h-[240px] border p-3 text-sm" />
      <div className="flex gap-2">
        <button onClick={() => navigator.clipboard.writeText(String(stats.tokens))} className="px-5 h-10 bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600 text-sm">Copy count</button>
        <button onClick={() => setText('')} className="px-5 h-10 border text-sm">Clear</button>
      </div>
      <p className="text-xs text-zinc-500">Estimate uses ~{MODELS[model].perToken} chars per token. Actual count varies by tokenizer.</p>
    </div>
  )
}
