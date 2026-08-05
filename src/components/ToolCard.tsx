import { Link } from 'react-router-dom'
import { hueFor, cardRing, textAccent } from '../lib/style'
import { CutoutToolIcon } from './Icon'

export default function ToolCard({ tool }: { tool: any }) {
  const h = hueFor(tool.category)
  return (
    <Link to={`/tool/${tool.id}`}
      className={`group relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 md:p-5 soft-shadow transition-all duration-200 hover:-translate-y-0.5 ${cardRing(h)}`}>
      <span className="block w-11 h-11 transition-transform duration-200 group-hover:scale-110">
        <CutoutToolIcon id={tool.id} className="w-full h-full" tone={textAccent(h)} />
      </span>
      <h3 className="font-semibold mt-4 text-[15px] tracking-[-0.01em]">{tool.name}</h3>
      <p className="text-[13px] font-medium text-zinc-900 dark:text-white mt-1.5 leading-relaxed line-clamp-2 text-pretty">{tool.desc}</p>
    </Link>
  )
}
