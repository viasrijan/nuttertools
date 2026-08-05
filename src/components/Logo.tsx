export default function Logo({ size = 38 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <defs>
        <linearGradient id="omni-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6366f1" />
          <stop offset="1" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#omni-g)" />
      <rect x="6.5" y="6.5" width="19" height="19" rx="4.5" fill="none" stroke="#fff" strokeWidth="2.4" opacity=".95" />
      <rect x="12" y="12" width="8" height="8" rx="2.2" fill="#fff" />
      <circle cx="23.5" cy="8.5" r="2.6" fill="#fff" opacity=".85" />
    </svg>
  )
}
