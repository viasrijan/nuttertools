import { Wrench } from 'lucide-react'

export default function Logo({ size = 42 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" fill="#4f46e5" />
      <g transform="translate(4 4)">
        <Wrench width={24} height={24} strokeWidth={2} stroke="#fff" fill="none" />
      </g>
    </svg>
  )
}
