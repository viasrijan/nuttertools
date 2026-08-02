export default function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <defs>
        <linearGradient id="omni-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6366f1" />
          <stop offset="1" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#omni-g)" />
      <rect x="7.5" y="7.5" width="7.5" height="7.5" rx="2" fill="#fff" opacity=".95" />
      <rect x="17" y="7.5" width="7.5" height="7.5" rx="2" fill="#fff" opacity=".55" />
      <rect x="7.5" y="17" width="7.5" height="7.5" rx="2" fill="#fff" opacity=".55" />
      <rect x="17" y="17" width="7.5" height="7.5" rx="2" fill="#fff" opacity=".95" />
    </svg>
  )
}
