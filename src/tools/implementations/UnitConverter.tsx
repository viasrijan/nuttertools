import { useState } from 'react'
import { Field } from '../../components/ui/Field'
import { Select } from '../../components/ui/Select'

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
    <div className="space-y-6 max-w-xl">
      <div className="max-w-[240px]">
        <Select label="Category" value={group} onChange={setGroup} options={Object.keys(GROUPS).map((k) => ({ v: k, label: k }))} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Select label="From" value={String(fromIdx)} onChange={(v) => setFromIdx(parseInt(v))} options={g.units.map((u, i) => ({ v: String(i), label: u.name }))} />
        <Select label="To" value={String(toIdx)} onChange={(v) => setToIdx(parseInt(v))} options={g.units.map((u, i) => ({ v: String(i), label: u.name }))} />
      </div>
      <div className="grid grid-cols-2 gap-4 items-end">
        <Field label="Value" type="number" value={value} onChange={(e) => setValue(e.target.value)} />
        <div className="space-y-1.5">
          <span className="block text-[12px] font-bold uppercase tracking-wide text-zinc-700 dark:text-zinc-300">Result</span>
          <div className="px-3 h-10 grid items-center bg-zinc-100 dark:bg-zinc-800">
            <b className="text-base">{result.toLocaleString(undefined, { maximumFractionDigits: 6 })}</b>
          </div>
        </div>
      </div>
      <p className="text-[13px] font-semibold text-zinc-600 dark:text-zinc-300">
        {value} {g.units[fromIdx].name} = {result.toLocaleString(undefined, { maximumFractionDigits: 6 })} {g.units[toIdx].name}
      </p>
    </div>
  )
}