import { useState } from 'react'

type Unit = { name: string, factor: number }

const GROUPS: Record<string, { base: string, units: Unit[] }> = {
  Length: { base: 'meter', units: [
    { name: 'Millimeter', factor: 0.001 }, { name: 'Centimeter', factor: 0.01 }, { name: 'Meter', factor: 1 },
    { name: 'Kilometer', factor: 1000 }, { name: 'Inch', factor: 0.0254 }, { name: 'Foot', factor: 0.3048 },
    { name: 'Yard', factor: 0.9144 }, { name: 'Mile', factor: 1609.344 },
  ] },
  Weight: { base: 'kilogram', units: [
    { name: 'Milligram', factor: 0.000001 }, { name: 'Gram', factor: 0.001 }, { name: 'Kilogram', factor: 1 },
    { name: 'Ton (metric)', factor: 1000 }, { name: 'Ounce', factor: 0.0283495 }, { name: 'Pound', factor: 0.453592 },
  ] },
  Temperature: { base: 'celsius', units: [{ name: 'Celsius', factor: 1 }, { name: 'Fahrenheit', factor: 2 }, { name: 'Kelvin', factor: 3 }] },
  Volume: { base: 'liter', units: [
    { name: 'Milliliter', factor: 0.001 }, { name: 'Liter', factor: 1 }, { name: 'Gallon (US)', factor: 3.78541 },
    { name: 'Quart (US)', factor: 0.946353 }, { name: 'Cup', factor: 0.24 }, { name: 'Teaspoon', factor: 0.00492892 },
    { name: 'Tablespoon', factor: 0.0147868 }, { name: 'Cubic meter', factor: 1000 },
  ] },
  Data: { base: 'byte', units: [
    { name: 'Byte', factor: 1 }, { name: 'Kilobyte', factor: 1024 }, { name: 'Megabyte', factor: 1024 ** 2 },
    { name: 'Gigabyte', factor: 1024 ** 3 }, { name: 'Terabyte', factor: 1024 ** 4 }, { name: 'Bit', factor: 1 / 8 },
  ] },
  Speed: { base: 'mps', units: [
    { name: 'm/s', factor: 1 }, { name: 'km/h', factor: 1 / 3.6 }, { name: 'mph', factor: 0.44704 }, { name: 'Knot', factor: 0.514444 },
  ] },
  Time: { base: 'second', units: [
    { name: 'Millisecond', factor: 0.001 }, { name: 'Second', factor: 1 }, { name: 'Minute', factor: 60 },
    { name: 'Hour', factor: 3600 }, { name: 'Day', factor: 86400 }, { name: 'Week', factor: 604800 },
  ] },
}

function convert(v: number, fromFactor: number, toFactor: number, group: string) {
  if (group === 'Temperature') {
    if (fromFactor === 1 && toFactor === 2) return v * 9 / 5 + 32
    if (fromFactor === 2 && toFactor === 1) return (v - 32) * 5 / 9
    if (fromFactor === 1 && toFactor === 3) return v + 273.15
    if (fromFactor === 3 && toFactor === 1) return v - 273.15
    if (fromFactor === 2 && toFactor === 3) return (v - 32) * 5 / 9 + 273.15
    if (fromFactor === 3 && toFactor === 2) return (v - 273.15) * 9 / 5 + 32
    return v
  }
  return v * fromFactor / toFactor
}

export default function UnitConverter() {
  const [group, setGroup] = useState('Length')
  const [fromIdx, setFromIdx] = useState(2)
  const [toIdx, setToIdx] = useState(0)
  const [value, setValue] = useState('1')
  const g = GROUPS[group]
  const v = parseFloat(value)
  const result = isNaN(v) ? 0 : convert(v, g.units[fromIdx].factor, g.units[toIdx].factor, group)

  return (
    <div className="space-y-4 max-w-xl">
      <div className="flex flex-wrap gap-2">
        {Object.keys(GROUPS).map(k => (
          <button key={k} onClick={() => setGroup(k)} className={`px-3 h-9 text-sm border ${group === k ? 'bg-zinc-900 text-white' : ''}`}>{k}</button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 items-end">
        <label className="block text-sm font-semibold">From
          <select value={fromIdx} onChange={e => setFromIdx(parseInt(e.target.value))} className="w-full border px-2 h-9 mt-1 bg-transparent">
            {g.units.map((u, i) => <option key={u.name} value={i}>{u.name}</option>)}
          </select></label>
        <label className="block text-sm font-semibold">To
          <select value={toIdx} onChange={e => setToIdx(parseInt(e.target.value))} className="w-full border px-2 h-9 mt-1 bg-transparent">
            {g.units.map((u, i) => <option key={u.name} value={i}>{u.name}</option>)}
          </select></label>
        <input type="number" value={value} onChange={e => setValue(e.target.value)} className="border px-3 h-12 text-lg font-semibold" />
        <div className="border px-3 h-12 grid items-center bg-zinc-50 dark:bg-zinc-800">
          <b className="text-lg">{result.toLocaleString(undefined, { maximumFractionDigits: 6 })}</b>
        </div>
      </div>
      <div className="text-xs text-zinc-500 font-medium">
        {value} {g.units[fromIdx].name} = {result.toLocaleString(undefined, { maximumFractionDigits: 6 })} {g.units[toIdx].name}
      </div>
    </div>
  )
}
