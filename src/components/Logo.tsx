export default function Logo({ size = 30, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" aria-hidden="true" className={`drop-shadow-sm ${className}`}>
      <circle cx="128" cy="128" r="128" fill="#4454c9" />
      <g transform="translate(128 128) scale(1.6)">
        <g className="logo-spin" fill="none" stroke="white">
          <path
            d="M 29 0 L 41 0 M 23.46 17.05 L 33.17 24.11 M 8.96 27.58 L 12.67 39 M -8.96 27.58 L -12.67 39 M -23.46 17.05 L -33.17 24.11 M -29 0 L -41 0 M -23.46 -17.05 L -33.17 -24.11 M -8.96 -27.58 L -12.67 -39 M 8.96 -27.58 L 12.67 -39 M 23.46 -17.05 L 33.17 -24.11"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <circle r="24" strokeWidth="14" />
          <circle r="12" strokeWidth="8" />
        </g>
      </g>
    </svg>
  )
}
