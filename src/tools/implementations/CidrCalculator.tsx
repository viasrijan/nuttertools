import { useMemo, useState } from 'react'

export default function CidrCalculator() {
  const [cidr, setCidr] = useState('192.168.1.0/24')

  const res = useMemo(() => {
    const m = cidr.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\/(\d{1,2})$/)
    if (!m) return null
    const ip = m.slice(1, 5).map(Number)
    const bits = Number(m[5])
    if (ip.some(n => n < 0 || n > 255) || bits < 0 || bits > 32) return null
    const ipInt = ((ip[0] << 24) | (ip[1] << 16) | (ip[2] << 8) | ip[3]) >>> 0
    const mask = bits === 0 ? 0 : (~0 << (32 - bits)) >>> 0
    const net = ipInt & mask
    const bcast = bits === 32 ? net : net | (~mask >>> 0)
    const hosts = bits >= 31 ? (bits === 32 ? 1 : 2) : (2 ** (32 - bits)) - 2
    const fmt = (n: number) => `${(n >>> 24) & 255}.${(n >>> 16) & 255}.${(n >>> 8) & 255}.${n & 255}`
    const usable = bits >= 31 ? (bits === 32 ? [fmt(net)] : []) : [fmt(net + 1), fmt(bcast - 1)]
    return {
      mask: fmt(mask), wildcard: fmt(~mask >>> 0), net: fmt(net), bcast: fmt(bcast), hosts,
      networkClass: ip[0] < 128 ? 'A' : ip[0] < 192 ? 'B' : ip[0] < 224 ? 'C' : ip[0] < 240 ? 'D (multicast)' : 'E (reserved)',
      usable,
      binaryIp: ip.map(o => o.toString(2).padStart(8, '0')).join('.'),
      binaryMask: [mask >>> 24, (mask >>> 16) & 255, (mask >>> 8) & 255, mask & 255].map(o => o.toString(2).padStart(8, '0')).join('.'),
    }
  }, [cidr])

  return (
    <div className="space-y-4 max-w-xl">
      <input value={cidr} onChange={e => setCidr(e.target.value)} placeholder="192.168.1.0/24" className="w-full border px-3 py-2 text-sm font-mono" />
      {res ? (
        <div className="border text-sm divide-y">
          <div className="grid grid-cols-2 gap-2 p-3">
            <div><span className="text-[10px] uppercase font-semibold text-zinc-500 block">Network</span><code>{res.net}</code></div>
            <div><span className="text-[10px] uppercase font-semibold text-zinc-500 block">Broadcast</span><code>{res.bcast}</code></div>
            <div><span className="text-[10px] uppercase font-semibold text-zinc-500 block">Subnet mask</span><code>{res.mask}</code></div>
            <div><span className="text-[10px] uppercase font-semibold text-zinc-500 block">Wildcard</span><code>{res.wildcard}</code></div>
            <div><span className="text-[10px] uppercase font-semibold text-zinc-500 block">Usable hosts</span><code>{res.hosts.toLocaleString()}</code></div>
            <div><span className="text-[10px] uppercase font-semibold text-zinc-500 block">Class</span><code>{res.networkClass}</code></div>
          </div>
          {res.usable.length === 2 && (
            <div className="p-3 text-xs"><span className="text-[10px] uppercase font-semibold text-zinc-500 block mb-1">Usable range</span><code>{res.usable[0]} → {res.usable[1]}</code></div>
          )}
          <div className="p-3 text-xs font-mono space-y-1">
            <div className="text-[10px] uppercase font-semibold text-zinc-500">Binary IP</div>
            <div>{res.binaryIp}</div>
            <div className="text-[10px] uppercase font-semibold text-zinc-500 mt-2">Binary mask</div>
            <div>{res.binaryMask}</div>
          </div>
        </div>
      ) : (
        <p className="text-xs text-zinc-500">Enter an IPv4 CIDR like <code>10.0.0.0/8</code> or <code>172.16.5.42/28</code> (host bits are masked out).</p>
      )}
    </div>
  )
}
