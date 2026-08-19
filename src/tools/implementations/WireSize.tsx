import { useState } from 'react'
import { Field } from '../../components/ui/Field'
import { Result, ResultGrid } from '../../components/ui/Result'

const AWG_AMPS: [string, number][] = [['14', 15], ['12', 20], ['10', 30], ['8', 40], ['6', 55], ['4', 70], ['2', 95], ['1', 110], ['0', 125], ['2/0', 145], ['3/0', 165], ['4/0', 195]]

export default function WireSize() {
  const [amps, setAmps] = useState('20')
  const [len, setLen] = useState('50')

  const A = parseFloat(amps) || 0
  const L = parseFloat(len) || 0

  const min = AWG_AMPS.find(([, cap]) => cap >= A * 1.25) || AWG_AMPS[AWG_AMPS.length - 1]
  const awgIdx = AWG_AMPS.findIndex(([a]) => a === min[0])
  const voltDropWire = AWG_AMPS[Math.min(awgIdx - 2, AWG_AMPS.length - 1)]
  const recommended = L > 100 ? voltDropWire[0] : min[0]

  return (
    <div className="space-y-6 max-w-xl">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Circuit current (A)" type="number" value={amps} onChange={(e) => setAmps(e.target.value)} />
        <Field label="Run length (ft)" type="number" value={len} onChange={(e) => setLen(e.target.value)} />
      </div>
      <ResultGrid>
        <Result label="Minimum gauge (125% rule)" value={`${min[0]} AWG`} tone="good" />
        <Result label="Breaker size" value={`${min[1]} A`} />
        <Result label="Recommended for long runs" value={`${recommended} AWG`} tone="good" />
      </ResultGrid>
    </div>
  )
}