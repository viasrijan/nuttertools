export default function Logo({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="16" fill="#4f46e5" />
      <g transform="translate(16 16) scale(-0.5 0.5) translate(-12 -12)">
        <path
          d="M22.7 19L13.6 9.9c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3l4.3 4.3-3 3-4.3-4.3c-1.2 2.4-.7 5.4 1.3 7.4 1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.4-.4.4-1 0-1.4z"
          fill="#fff"
        />
      </g>
    </svg>
  )
}
