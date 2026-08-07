export default function Logo({ size = 30, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" aria-hidden="true" className={`drop-shadow-sm ${className}`}>
      <circle cx="128" cy="128" r="128" fill="#4454c9" />
      <g transform="translate(128 128) scale(1.1)">
        <g className="logo-spin" fill="none" stroke="white">
          <g transform="rotate(45)">
            <path d="M -52 -34 A 34 34 0 1 0 -52 34" strokeWidth="16" strokeLinecap="round" />
            <path d="M 52 -34 A 34 34 0 1 1 52 34" strokeWidth="16" strokeLinecap="round" />
            <path d="M -10 0 L 10 0" strokeWidth="16" strokeLinecap="round" />
          </g>
          <g transform="rotate(-45)">
            <path d="M -70 0 L 70 0" strokeWidth="14" strokeLinecap="round" />
            <path d="M 70 -20 L 70 20" strokeWidth="18" strokeLinecap="butt" />
          </g>
        </g>
      </g>
    </svg>
  )
}
