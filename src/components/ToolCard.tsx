import { Link } from 'react-router-dom'
import { hueFor, tile, cardRing } from '../lib/style'
import { ToolIcon } from './Icon'

export default function ToolCard({ tool }: { tool: any }) {
  const h = hueFor(tool.category)
  return (
    <Link to={`/tool/${tool.id}`}
      className={`group relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 transition-all duration-200 hover:shadow-xl hover:shadow-zinc-900/5 dark:hover:shadow-black/20 hover:-translate-y-0.5 ${cardRing(h)}`}>
      <span className={`w-11 h-11 grid place-items-center shadow-sm shrink-0 transition-transform duration-200 group-hover:scale-110 ${tile(h)}`}>
        <ToolIcon id={tool.id} className="w-5 h-5 text-white" />
      </span>
      <h3 className="font-semibold mt-4 text-[15px] tracking-[-0.01em]">{tool.name}</h3>
      <p className="text-[13px] text-zinc-600 dark:text-zinc-300 mt-1.5 leading-relaxed line-clamp-2 text-pretty">{tool.desc}</p>
    </Link>
  )
}
