import { useState } from 'react'
import { Select } from '../../components/ui/Select'
import { Result } from '../../components/ui/Result'

const GROUPS = {
  'Default-src (fallback for everything)': ['default-src', `'self'`, `'unsafe-inline'`, `'unsafe-eval'`, 'https:'],
  'Script-src': ['script-src', `'self'`, `'unsafe-inline'`],
  'Style-src': ['style-src', `'self'`, `'unsafe-inline'`],
  'Img-src': ['img-src', `'self'`, 'data:', 'https:'],
  'Font-src': ['font-src', `'self'`, 'data:', 'https:'],
  'Connect-src': ['connect-src', `'self'`, 'https:'],
  'Frame-src': ['frame-src', `'self'`],
  'Object-src': ['object-src', `'none'`],
  'Base-uri': ['base-uri', `'self'`],
  'Form-action': ['form-action', `'self'`],
}

const PRESETS = [
  { v: 'strict', label: 'Strict (recommended)' },
  { v: 'balanced', label: 'Balanced' },
  { v: 'permissive', label: 'Permissive' },
]

export default function CspGenerator() {
  const [preset, setPreset] = useState('strict')
  const [reportOnly, setReportOnly] = useState(false)

  const directives = Object.entries(GROUPS)
    .map(([name, [key, ...vals]]) => {
      if (preset === 'strict' && ['script-src', 'img-src', 'connect-src'].includes(key)) {
        const strictVals: Record<string, string[]> = {
          'script-src': [`'self'`, `'wasm-unsafe-eval'`],
          'img-src': [`'self'`, 'data:', 'https:'],
          'connect-src': [`'self'`],
        }
        return `${key} ${strictVals[key].join(' ')};`
      }
      if (preset === 'permissive' && !['object-src', 'base-uri', 'form-action'].includes(key)) {
        return `${key} ${vals.join(' ')};`
      }
      if (preset === 'strict' && ['style-src', 'font-src', 'frame-src'].includes(key) && key !== 'default-src') return null
      return `${key} ${vals.join(' ')};`
    })
    .filter(Boolean) as string[]

  const header = (reportOnly ? 'Content-Security-Policy-Report-Only' : 'Content-Security-Policy') + ': ' + directives.join(' ')
  const meta = `<meta http-equiv="Content-Security-Policy" content="${directives.join(' ')}">`

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex flex-wrap items-end gap-4">
        <Select label="Policy preset" value={preset} onChange={setPreset} options={PRESETS} className="w-56" />
        <label className="flex items-center gap-2 pb-2.5 text-sm font-bold text-zinc-700 dark:text-zinc-300 cursor-pointer">
          <input type="checkbox" checked={reportOnly} onChange={(e) => setReportOnly(e.target.checked)} className="w-4 h-4 accent-indigo-600" />
          Report-Only mode (test, don't block)
        </label>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-bold uppercase tracking-wide text-zinc-700 dark:text-zinc-300">HTTP header</span>
          <button onClick={() => navigator.clipboard?.writeText(header)} className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 hover:underline">Copy</button>
        </div>
        <pre className="p-3 bg-zinc-100 dark:bg-zinc-800 font-mono text-[12px] leading-relaxed overflow-auto whitespace-pre-wrap">{header}</pre>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-bold uppercase tracking-wide text-zinc-700 dark:text-zinc-300">HTML meta tag</span>
          <button onClick={() => navigator.clipboard?.writeText(meta)} className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 hover:underline">Copy</button>
        </div>
        <pre className="p-3 bg-zinc-100 dark:bg-zinc-800 font-mono text-[12px] leading-relaxed overflow-auto whitespace-pre-wrap">{meta}</pre>
      </div>
      <div className="grid gap-2 max-w-md">
        <Result label="Directives" value={directives.length} />
      </div>
    </div>
  )
}