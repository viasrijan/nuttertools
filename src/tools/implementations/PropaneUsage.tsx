import { useState } from 'react'
import { Field } from '../../components/ui/Field'
import { Result, ResultGrid } from '../../components/ui/Result'
import { Select } from '../../components/ui/Select'

export default function PropaneUsage() {
  const [btu, setBtu] = useState('30000')
  const [hours, setHours] = useState('4')
  const [tank, setTank] = useState('20')

  const B = parseFloat(btu) || 0
  const H = parseFloat(hours) || 0
  const T = parseFloat(tank) || 20

  const lbPerHr = B / 21500
  const perSession = lbPerHr * H
  const sessions = perSession > 0 ? T / perSession : 0
  const costPerHr = lbPerHr * 1.5

  return (
    <div className="space-y-6 max-w-xl">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Field label="BTU/hr rating" type="number" value={btu} onChange={(e) => setBtu(e.target.value)} hint="On the appliance label" />
        <Field label="Use per session (hrs)" type="number" value={hours} onChange={(e) => setHours(e.target.value)} />
        <Select label="Tank size" value={tank} onChange={setTank} options={[{ v: '20', label: '20 lb (grill)' }, { v: '30', label: '30 lb' }, { v: '40', label: '40 lb' }, { v: '100', label: '100 lb' }, { v: '250', label: '250 gal (residential)' }]} />
      </div>
      <ResultGrid>
        <Result label="Burn rate" value={`${lbPerHr.toFixed(2)} lb/hr`} />
        <Result label="Per session" value={`${perSession.toFixed(2)} lb`} tone="good" />
        <Result label="Sessions per tank" value={sessions > 0 ? `${sessions.toFixed(1)}` : '—'} tone="good" />
        <Result label="Approx. cost / hr" value={`$${costPerHr.toFixed(2)}`} />
      </ResultGrid>
    </div>
  )
}