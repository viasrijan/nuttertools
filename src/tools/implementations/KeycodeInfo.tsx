import { useEffect, useState } from 'react'

import { Button } from '../../components/ui/Button'

type KeyEventInfo = {
  key: string
  code: string
  keyCode: number
  which: number
  location: number
  ctrl: boolean
  alt: boolean
  shift: boolean
  meta: boolean
  repeat: boolean
}

const PRESETS: { name: string, key: string, code: string, keyCode: number }[] = [
  { name: 'Enter', key: 'Enter', code: 'Enter', keyCode: 13 },
  { name: 'Tab', key: 'Tab', code: 'Tab', keyCode: 9 },
  { name: 'Backspace', key: 'Backspace', code: 'Backspace', keyCode: 8 },
  { name: 'Escape', key: 'Escape', code: 'Escape', keyCode: 27 },
  { name: 'Space', key: ' ', code: 'Space', keyCode: 32 },
  { name: 'Arrow Up', key: 'ArrowUp', code: 'ArrowUp', keyCode: 38 },
  { name: 'Arrow Down', key: 'ArrowDown', code: 'ArrowDown', keyCode: 40 },
  { name: 'Arrow Left', key: 'ArrowLeft', code: 'ArrowLeft', keyCode: 37 },
  { name: 'Arrow Right', key: 'ArrowRight', code: 'ArrowRight', keyCode: 39 },
  { name: 'Home', key: 'Home', code: 'Home', keyCode: 36 },
  { name: 'End', key: 'End', code: 'End', keyCode: 35 },
  { name: 'Page Up', key: 'PageUp', code: 'PageUp', keyCode: 33 },
  { name: 'Page Down', key: 'PageDown', code: 'PageDown', keyCode: 34 },
  { name: 'Delete', key: 'Delete', code: 'Delete', keyCode: 46 },
  { name: 'Caps Lock', key: 'CapsLock', code: 'CapsLock', keyCode: 20 },
  { name: 'F1', key: 'F1', code: 'F1', keyCode: 112 },
  { name: 'F5', key: 'F5', code: 'F5', keyCode: 116 },
  { name: 'F12', key: 'F12', code: 'F12', keyCode: 123 },
]

export default function KeycodeInfo() {
  const [info, setInfo] = useState<KeyEventInfo | null>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      e.preventDefault()
      setInfo({
        key: e.key,
        code: e.code,
        keyCode: e.keyCode,
        which: e.which,
        location: e.location,
        ctrl: e.ctrlKey,
        alt: e.altKey,
        shift: e.shiftKey,
        meta: e.metaKey,
        repeat: e.repeat,
      })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const copyJson = async () => {
    if (!info) return
    await navigator.clipboard.writeText(JSON.stringify(info, null, 2))
  }

  const rows: [string, string][] = info ? [
    ['event.key', info.key || '(empty)'],
    ['event.code', info.code],
    ['event.keyCode', String(info.keyCode)],
    ['event.which', String(info.which)],
    ['event.location', String(info.location)],
    ['ctrlKey', String(info.ctrl)],
    ['altKey', String(info.alt)],
    ['shiftKey', String(info.shift)],
    ['metaKey', String(info.meta)],
    ['repeat', String(info.repeat)],
  ] : []

  return (
    <div className="space-y-5 max-w-xl omni-rise">
      <div className={`border border-dashed p-10 text-center transition ${info ? 'border-green-500' : 'border-zinc-300 dark:border-zinc-700'}`}>
        {info ? (
          <div>
            <div className="text-5xl font-black tracking-tight">{info.key === ' ' ? 'Space' : info.key}</div>
            <div className="mt-1 text-xs font-mono text-zinc-500 dark:text-zinc-400">keyCode {info.keyCode}</div>
          </div>
        ) : (
          <div className="text-sm font-medium text-zinc-900 dark:text-white">Press any key to see its JavaScript event data</div>
        )}
      </div>
      {info && (
        <div className="space-y-3">
          <div className="border divide-y divide-zinc-200 dark:divide-zinc-800 text-[13px] font-mono">
            {rows.map(([k, v]) => (
              <div key={k} className="flex justify-between px-3 py-2">
                <span className="text-zinc-500 dark:text-zinc-400">{k}</span>
                <span className="font-semibold text-zinc-900 dark:text-white">{v}</span>
              </div>
            ))}
          </div>
          <Button variant="secondary" onClick={copyJson}>Copy as JSON</Button>
        </div>
      )}
      <div>
        <h4 className="text-[11px] font-bold uppercase tracking-[0.16em] text-green-600 dark:text-green-400 mb-2">Common keycodes</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {PRESETS.map((p) => (
            <button key={p.key} onClick={() => setInfo({ key: p.key, code: p.code, keyCode: p.keyCode, which: p.keyCode, location: 0, ctrl: false, alt: false, shift: false, meta: false, repeat: false })}
              className="px-3 h-9 text-xs border border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-2">
              <span className="font-medium text-zinc-900 dark:text-white">{p.name}</span>
              <span className="font-mono text-zinc-500 dark:text-zinc-400">{p.keyCode}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
