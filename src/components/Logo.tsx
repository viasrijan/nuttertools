export default function Logo({ size = 30, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" aria-hidden="true" className={`drop-shadow-sm ${className}`}>
      <circle cx="128" cy="128" r="128" fill="#4454c9" />
      <g transform="translate(128 128) rotate(45)">
        <g className="logo-spin" fill="none" stroke="white" strokeWidth="16" strokeLinecap="round">
          <path d="M -52 -34 A 34 34 0 1 0 -52 34" />
          <path d="M 52 -34 A 34 34 0 1 1 52 34" />
          <path d="M -10 0 L 10 0" />
        </g>
      </g>
    </svg>
  )
}
