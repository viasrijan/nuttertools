import { useMemo, useState } from 'react'

type Mode = { read: boolean, write: boolean, exec: boolean }

const PERM = ['---', '--x', '-w-', '-wx', 'r--', 'r-x', 'rw-', 'rwx']

export default function ChmodCalc() {
  const [owner, setOwner] = useState<Mode>({ read: true, write: true, exec: true })
  const [group, setGroup] = useState<Mode>({ read: true, write: true, exec: false })
  const [other, setOther] = useState<Mode>({ read: true, write: false, exec: false })
  const [special, setSpecial] = useState<'none' | 'suid' | 'sgid' | 'sticky'>('none')
  const [mode, setMode] = useState<'file' | 'dir'>('file')

  const val = (m: Mode) => (m.read ? 4 : 0) + (m.write ? 2 : 0) + (m.exec ? 1 : 0)
  const numeric = `${val(owner)}${val(group)}${val(other)}`
  const full = `${special !== 'none' ? special === 'suid' ? 4 : special === 'sgid' ? 2 : 1 : 0}${numeric}`
  const sym = `${special === 'suid' ? (mode === 'dir' ? 's' : 'S') : special === 'sgid' ? 's' : special === 'sticky' ? 't' : ''}${PERM[val(owner)]}${PERM[val(group)]}${PERM[val(other)]}`

  const octal = useMemo(() => numeric.split('').map(d => parseInt(d)).reduce((a, b) => a + b, 0), [numeric])
  const table = useMemo(() => {
    const rows: { bits: string, num: number, desc: string }[] = [
      { bits: '000', num: 0, desc: 'No permissions' },
      { bits: '001', num: 1, desc: 'Execute only' },
      { bits: '010', num: 2, desc: 'Write only' },
      { bits: '011', num: 3, desc: 'Write + execute' },
      { bits: '100', num: 4, desc: 'Read only' },
      { bits: '101', num: 5, desc: 'Read + execute' },
      { bits: '110', num: 6, desc: 'Read + write' },
      { bits: '111', num: 7, desc: 'Read + write + execute' },
    ]
    return rows
  }, [])

  const ModeRow = ({ label, m, set }: { label: string, m: Mode, set: (m: Mode) => void }) => (
    <div className="flex items-center gap-3 py-2 border-b last:border-0">
      <span className="w-16 text-sm font-semibold">{label}</span>
      {(['read', 'write', 'exec'] as const).map(k => (
        <label key={k} className="flex items-center gap-1.5 text-sm"><input type="checkbox" checked={m[k]} onChange={e => set({ ...m, [k]: e.target.checked })} />{k}</label>
      ))}
      <span className="ml-auto font-mono text-sm">{PERM[val(m)]}</span>
    </div>
  )

  return (
    <div className="space-y-5 max-w-lg">
      <div className="space-y-0.5">
        <ModeRow label="Owner" m={owner} set={setOwner} />
        <ModeRow label="Group" m={group} set={setGroup} />
        <ModeRow label="Others" m={other} set={setOther} />
      </div>
      <div className="flex flex-wrap gap-4">
        <label className="text-sm flex items-center gap-2">Type
          <select value={mode} onChange={e => setMode(e.target.value as any)} className="border px-2 h-9 text-sm bg-transparent">
            <option value="file">File</option><option value="dir">Directory</option>
          </select>
        </label>
        <label className="text-sm flex items-center gap-2">Special bit
          <select value={special} onChange={e => setSpecial(e.target.value as any)} className="border px-2 h-9 text-sm bg-transparent">
            <option value="none">None</option><option value="suid">Setuid (4)</option><option value="sgid">Setgid (2)</option><option value="sticky">Sticky (1)</option>
          </select>
        </label>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="border p-4 text-center"><div className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Command</div>
          <code className="block mt-1 font-mono text-sm">chmod {full} {mode === 'file' ? 'file.txt' : 'folder'}</code>
        </div>
        <div className="border p-4 text-center"><div className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Symbolic</div>
          <code className="block mt-1 font-mono text-sm">-rw-{sym.slice(3)}</code>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {table.map(r => (
          <div key={r.bits} className={`border p-2 text-center ${r.num === val(owner) + val(group) + val(other) && special === 'none' ? 'ring-2 ring-sky-500' : ''}`}>
            <div className="font-mono text-sm font-bold">{r.num}</div>
            <div className="font-mono text-[10px] text-zinc-500">{r.bits}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
