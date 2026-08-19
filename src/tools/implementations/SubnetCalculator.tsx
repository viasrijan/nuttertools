import { useState } from 'react'
import { Field } from '../../components/ui/Field'
import { Result } from '../../components/ui/Result'

export default function SubnetCalculator() {
  const [ip, setIp] = useState('192.168.1.0')
  const [prefix, setPrefix] = useState(24)

  const octets = ip.split('.').map((n) => parseInt(n, 10) & 0xff)
  if (octets.length !== 4 || octets.some(isNaN)) {
    return <p className="text-sm font-semibold text-rose-600">Enter a valid IPv4 address like 192.168.1.0</p>
  }
  const ipInt = octets.reduce((acc, o) => (acc << 8) | o, 0) >>> 0
  const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0
  const network = ipInt & mask
  const broadcast = (network | (~mask >>> 0)) >>> 0
  const hosts = prefix >= 31 ? Math.pow(2, 32 - prefix) : Math.pow(2, 32 - prefix) - 2
  const first = prefix >= 31 ? network : network + 1
  const last = prefix >= 31 ? broadcast : broadcast - 1
  const toIp = (n: number) => [(n >>> 24) & 0xff, (n >>> 16) & 0xff, (n >>> 8) & 0xff, n & 0xff].join('.')

  return (
    <div className="space-y-6 max-w-xl">
      <div className="grid grid-cols-2 gap-4">
        <Field label="IP address" value={ip} onChange={(e) => setIp(e.target.value)} />
        <Field label="Prefix length (/)" type="number" min={0} max={32} value={prefix} onChange={(e) => setPrefix(Math.max(0, Math.min(32, parseInt(e.target.value) || 0)))} />
      </div>
      <div className="grid gap-2">
        <Result label="Network address" value={toIp(network) + `/${prefix}`} />
        <Result label="Subnet mask" value={toIp(mask)} />
        <Result label="Broadcast address" value={toIp(broadcast)} />
        <Result label="Usable host range" value={`${toIp(first)} – ${toIp(last)}`} />
        <Result label="Total host count" value={`${hosts.toLocaleString()}`} />
        <Result label="Host bits" value={`${32 - prefix} bits`} />
      </div>
    </div>
  )
}