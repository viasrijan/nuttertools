import { useState } from 'react'
import { Field } from '../../components/ui/Field'
import { Result, ResultGrid } from '../../components/ui/Result'
import { Select } from '../../components/ui/Select'

export default function FuelTripCost() {
  const [distance, setDistance] = useState('300')
  const [mpg, setMpg] = useState('32')
  const [price, setPrice] = useState('3.5')
  const [travelers, setTravelers] = useState('2')
  const [unit, setUnit] = useState('us')

  const d = parseFloat(distance) || 0
  const e = parseFloat(mpg) || 1
  const p = parseFloat(price) || 0
  const t = parseInt(travelers) || 1

  const isMetric = unit === 'metric'
  const gallons = isMetric ? d / 100 * 2.20462 * 0.264172 * (e / 100) : d / e
  const gallonsUS = isMetric ? d / 100 * (e / 100) * 0.264172 : d / e
  const liters = gallonsUS * 3.78541
  const cost = isMetric ? d / 100 * e * p : gallons * p

  return (
    <div className="space-y-6 max-w-xl">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Field label={isMetric ? 'Distance (km)' : 'Distance (miles)'} type="number" value={distance} onChange={(e) => setDistance(e.target.value)} />
        <Field label={isMetric ? 'Consumption (L/100km)' : 'Efficiency (mpg)'} type="number" value={mpg} onChange={(e) => setMpg(e.target.value)} />
        <Field label={isMetric ? 'Fuel price per L' : 'Fuel price per gallon'} type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        <Field label="Travelers" type="number" value={travelers} onChange={(e) => setTravelers(e.target.value)} />
      </div>
      <div className="max-w-[200px]">
        <Select label="Units" value={unit} onChange={setUnit} options={[{ v: 'us', label: 'US (miles/gallons)' }, { v: 'metric', label: 'Metric (km/liters)' }]} />
      </div>
      <ResultGrid>
        <Result label="Total fuel cost" value={`$${cost.toFixed(2)}`} tone="good" />
        <Result label="Fuel needed" value={isMetric ? `${liters.toFixed(1)} liters` : `${gallons.toFixed(1)} gallons`} />
        <Result label="Cost per traveler" value={`$${(cost / t).toFixed(2)}`} />
        <Result label="Cost per mile/km" value={`$${(cost / Math.max(d, 1)).toFixed(3)}`} />
      </ResultGrid>
    </div>
  )
}