import { useMemo, useState } from 'react'

function diff(a: string[], b: string[]) {
  const n = a.length, m = b.length
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0))
  for (let i = n - 1; i >= 0; i--)
    for (let j = m - 1; j >= 0; j--)
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1])
  const ops: { type: 'same' | 'del' | 'add', text: string }[] = []
  let i = 0, j = 0
  while (i < n && j < m) {
    if (a[i] === b[j]) { ops.push({ type: 'same', text: a[i] }); i++; j++ }
    else if (dp[i + 1][j] >= dp[i][j + 1]) { ops.push({ type: 'del', text: a[i] }); i++ }
    else { ops.push({ type: 'add', text: b[j] }); j++ }
  }
  while (i < n) { ops.push({ type: 'del', text: a[i] }); i++ }
  while (j < m) { ops.push({ type: 'add', text: b[j] }); j++ }
  return ops
}

const COLS = {
  same: 'bg-transparent',
  del: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300',
  add: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300',
}

export default function DiffChecker() {
  const [a, setA] = useState('Hello world\nThis is line two\nSame line')
  const [b, setB] = useState('Hello world\nThis is line two edited\nSame line\nExtra line')
  const ops = useMemo(() => diff(a.split('\n'), b.split('\n')), [a, b])
  return (
    <div className="space-y-5">
      <div className="grid md:grid-cols-2 gap-3">
        <textarea value={a} onChange={e => setA(e.target.value)} className="w-full h-40 border p-3 text-xs font-mono" placeholder="Original" />
        <textarea value={b} onChange={e => setB(e.target.value)} className="w-full h-40 border p-3 text-xs font-mono" placeholder="Changed" />
      </div>
      <div className="border">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-widest bg-zinc-50 dark:bg-zinc-800 border-b">
          <span className="text-red-500">- removed</span> · <span className="text-emerald-500">+ added</span> · {ops.filter(o => o.type !== 'same').length} changes
        </div>
        {ops.map((o, i) => (
          <div key={i} className={`px-3 py-1 font-mono text-[12px] whitespace-pre-wrap ${COLS[o.type]}`}>{o.type === 'same' ? ' ' : o.type === 'del' ? '−' : '+'} {o.text || '␣'}</div>
        ))}
      </div>
    </div>
  )
}
