import { useState } from 'react'

import { Button } from '../../components/ui/Button'

function uuid() { return crypto.randomUUID() }

const FIRST = ['Adam', 'Bella', 'Carlos', 'Diana', 'Ethan', 'Fatima', 'George', 'Hana', 'Ivan', 'Julia', 'Kiran', 'Lena', 'Marco', 'Nina', 'Omar', 'Priya', 'Quinn', 'Rosa', 'Sam', 'Tara', 'Uma', 'Victor', 'Wendy', 'Xavier', 'Yara', 'Zane']
const LAST = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Lee', 'Kim', 'Patel', 'Singh', 'Kumar', 'Silva', 'Meyer', 'Khan', 'Ali', 'Novak']
const CITY = ['New York', 'London', 'Mumbai', 'Tokyo', 'Berlin', 'Paris', 'Toronto', 'Sydney', 'Sao Paulo', 'Cairo', 'Delhi', 'Cape Town']

const rand = (n: number) => Math.floor(Math.random() * n)

export default function UuidGenerator() {
  const [count, setCount] = useState(5)
  const [version, setVersion] = useState<'v4' | 'v1'>('v4')
  const [upper, setUpper] = useState(false)
  const [noHyphen, setNoHyphen] = useState(false)
  const [ids, setIds] = useState<string[]>([])

  const gen = () => {
    const arr: string[] = []
    for (let i = 0; i < count; i++) {
      let u = version === 'v4' ? uuid() : makeV1()
      if (noHyphen) u = u.replace(/-/g, '')
      if (upper) u = u.toUpperCase()
      arr.push(u)
    }
    setIds(arr)
  }

  const makeV1 = () => {
    const t = Date.now()
    const m = t * 10000 + 0x01b21dd213814000
    const hex = m.toString(16).padStart(15, '0')
    const timeHi = hex.slice(0, 3)
    const timeMid = hex.slice(3, 7)
    const timeLo = hex.slice(7, 11)
    return `${timeLo}-${timeMid}-1${timeHi.slice(0, 3)}-${['8', '9', 'a', 'b'][rand(4)]}${hex.slice(11, 13)}-${Math.floor(Math.random() * 0xffffffff).toString(16).padStart(12, '0')}`
  }

  const fakeData = {
    name: `${FIRST[rand(FIRST.length)]} ${LAST[rand(LAST.length)]}`,
    email: () => `${FIRST[rand(FIRST.length)].toLowerCase()}${rand(100)}@example.com`,
    phone: () => `+1-${rand(200) + 100}-${rand(900) + 100}-${rand(9000) + 1000}`,
    city: () => CITY[rand(CITY.length)],
    company: () => `${FIRST[rand(FIRST.length)]} ${['Labs', 'Works', 'Systems', 'Soft', 'Digital'][rand(5)]}`,
  }

  return (
    <div className="space-y-5 max-w-2xl omni-rise">
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm">Count <input type="number" min={1} max={100} value={count} onChange={e => setCount(parseInt(e.target.value) || 1)} className="border px-2 h-9 w-20 text-sm" /></label>
        <select value={version} onChange={e => setVersion(e.target.value as any)} className="border px-2 h-9 text-sm bg-transparent"><option value="v4">UUID v4 (random)</option><option value="v1">UUID v1 (time)</option></select>
        <label className="flex items-center gap-1.5 text-sm"><input type="checkbox" checked={upper} onChange={e => setUpper(e.target.checked)} />Uppercase</label>
        <label className="flex items-center gap-1.5 text-sm"><input type="checkbox" checked={noHyphen} onChange={e => setNoHyphen(e.target.checked)} />No hyphens</label>
        <Button variant="secondary" size="sm" onClick={gen}>Generate</Button>
        {ids.length > 0 && <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(ids.join('\n'))}>Copy</Button>}
      </div>
      <div className="border divide-y divide-zinc-100 dark:divide-zinc-800 max-h-64 overflow-auto">
        {ids.map((u, i) => <div key={i} className="px-3 py-2 font-mono text-xs">{u}</div>)}
      </div>
      <div>
        <p className="text-sm font-semibold mb-2">Fake data</p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="border px-3 py-2"><span className="text-[10px] font-bold uppercase text-zinc-500 block">Name</span>{fakeData.name}</div>
          <div className="border px-3 py-2"><span className="text-[10px] font-bold uppercase text-zinc-500 block">Email</span>{fakeData.email()}</div>
          <div className="border px-3 py-2"><span className="text-[10px] font-bold uppercase text-zinc-500 block">Phone</span>{fakeData.phone()}</div>
          <div className="border px-3 py-2"><span className="text-[10px] font-bold uppercase text-zinc-500 block">City</span>{fakeData.city()}</div>
        </div>
        <Button variant="outline" onClick={() => setCount(count)} className="mt-2 px-3 h-8  text-sm">Shuffle</Button>
      </div>
    </div>
  )
}
