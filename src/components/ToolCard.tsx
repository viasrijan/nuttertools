import { Link } from 'react-router-dom'
import { hueFor, cardRing, textAccent } from '../lib/style'
import { CutoutToolIcon } from './Icon'

export default function ToolCard({ tool }: { tool: any }) {
  const h = hueFor(tool.category)
  return (
    <Link
      to={`/tool/${tool.id}`}
      className={`group relative overflow-hidden bg-white dark:bg-[#242424]/90 border border-zinc-200/70 dark:border-zinc-800  p-4 md:p-5 soft-shadow transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_2px_6px_rgba(0,0,0,0.03),0_14px_32px_-16px_rgba(0,0,0,0.12)] hover:border-zinc-300 dark:hover:border-zinc-700 ${cardRing(h)}`}
    >
      {/* soft gradient sheen sweeping in on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-16 h-16 bg-[radial-gradient(50%_80%_at_50%_100%,rgba(255,255,255,0.35),transparent_70%)] opacity-0 translate-y-8 group-hover:opacity-100 dark:group-hover:opacity-[0.07] group-hover:translate-y-16 transition-all duration-500 ease-out"
      />
      <span className="relative flex items-start justify-between">
        <span className="block w-9 h-9 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110 group-hover:-rotate-3">
          <CutoutToolIcon id={tool.id} className="w-full h-full" tone={textAccent(h)} />
        </span>
        <svg
          aria-hidden
          className="w-4 h-4 mt-1 text-zinc-300 dark:text-zinc-600 -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300"
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        >
          <path d="M7 17 17 7" />
          <path d="M8 7h9v9" />
        </svg>
      </span>
      <h3 className="relative font-semibold mt-4 text-[15px] tracking-[-0.01em] text-center sm:text-left text-zinc-900 dark:text-white">
        {tool.name}
      </h3>
      <p className="relative text-[13px] font-medium text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed line-clamp-2 text-pretty text-center sm:text-left">
        {tool.desc}
      </p>
    </Link>
  )
}
