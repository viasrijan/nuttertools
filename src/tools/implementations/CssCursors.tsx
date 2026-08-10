import { useState } from 'react'

const CURSORS: [string, string][] = [
  ['default', 'Default arrow'], ['pointer', 'Clickable'], ['text', 'Text select'],
  ['move', 'Movable'], ['grab', 'Grabbable'], ['grabbing', 'Grabbing'],
  ['crosshair', 'Precision'], ['help', 'Help available'], ['wait', 'Busy'],
  ['progress', 'Working'], ['not-allowed', 'Not allowed'], ['no-drop', 'No drop'],
  ['copy', 'Copy allowed'], ['alias', 'Shortcut'], ['context-menu', 'Context menu'],
  ['cell', 'Cell select'], ['vertical-text', 'Vertical text'], ['zoom-in', 'Zoom in'],
  ['zoom-out', 'Zoom out'], ['all-scroll', 'All directions'], ['col-resize', 'Column resize'],
  ['row-resize', 'Row resize'], ['n-resize', 'Resize up'], ['e-resize', 'Resize right'],
  ['s-resize', 'Resize down'], ['w-resize', 'Resize left'], ['ne-resize', 'Resize NE'],
  ['nw-resize', 'Resize NW'], ['se-resize', 'Resize SE'], ['sw-resize', 'Resize SW'],
  ['ew-resize', 'Resize EW'], ['ns-resize', 'Resize NS'], ['nesw-resize', 'Resize NESW'],
  ['nwse-resize', 'Resize NWSE'], ['none', 'No cursor'],
]

export default function CssCursors() {
  const [copied, setCopied] = useState('')

  const copy = async (cursor: string) => {
    await navigator.clipboard.writeText(`cursor: ${cursor};`)
    setCopied(cursor)
    setTimeout(() => setCopied(''), 1200)
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {CURSORS.map(([cursor, label]) => (
          <button key={cursor} onClick={() => copy(cursor)}
            className="border p-4 text-center hover:border-green-500 transition group">
            <div className="h-12 grid place-items-center">
              <span className="w-6 h-6 rounded-full border-2 border-zinc-900 dark:border-white inline-block"
                style={{ cursor }} />
            </div>
            <div className="text-sm font-bold font-mono">{cursor}</div>
            <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">{copied === cursor ? 'Copied!' : label}</div>
          </button>
        ))}
      </div>
      <p className="text-xs text-zinc-500 dark:text-zinc-400">Hover any cell to feel its cursor. Click to copy <span className="font-mono">cursor: name;</span>.</p>
    </div>
  )
}
