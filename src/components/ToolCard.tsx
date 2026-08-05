import { Link } from 'react-router-dom'
import { hueFor, tile, cardRing } from '../lib/style'
import { ToolIcon } from './Icon'

export default function ToolCard({ tool }: { tool: any }) {
  const h = hueFor(tool.category)
  return (
    <Link to={`/tool/${tool.id}`}
      className={`group relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 transition-all duration-200 hover:shadow-xl hover:shadow-zinc-900/5 dark:hover:shadow-black/20 hover:-translate-y-0.5 ${cardRing(h)}`}>
      <span className={`w-11 h-11 rounded-xl grid place-items-center shadow-sm shrink-0 transition-transform duration-200 group-hover:scale-110 ${tile(h)}`}>
        <ToolIcon id={tool.id} className="w-5 h-5 text-white" />
      </span>
      <h3 className="font-semibold mt-4 text-[15px] tracking-[-0.01em]">{tool.name}</h3>
      <p className="text-[13px] text-zinc-500 mt-1.5 leading-relaxed line-clamp-2 text-pretty">{tool.desc}</p>
      <div className="mt-4 flex items-center gap-2">
        <span className={`text-[10.5px] font-semibold px-2 py-0.5 rounded-full ${tool.implemented ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'}`}>
          {tool.implemented ? 'Ready to use' : 'Soon'}
        </span>
      </div>
    </Link>
  )
}
