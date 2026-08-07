import { Link } from 'react-router-dom'
import { hueFor, cardRing, textAccent } from '../lib/style'
import { CutoutToolIcon } from './Icon'

export default function ToolCard({ tool }: { tool: any }) {
  const h = hueFor(tool.category)
  return (
    <Link to={`/tool/${tool.id}`}
      className={`group relative bg-[#f0f0f0] dark:bg-[#242424] border border-zinc-200 dark:border-zinc-700 p-4 md:p-5 soft-shadow transition-all duration-200 hover:scale-[1.03] ${cardRing(h)}`}>
      <span className="block w-9 h-9 mx-auto sm:mx-0 transition-transform duration-200 group-hover:scale-110">
        <CutoutToolIcon id={tool.id} className="w-full h-full" tone={textAccent(h)} />
      </span>
      <h3 className="font-semibold mt-4 text-[15px] tracking-[-0.01em] text-center sm:text-left text-zinc-900 dark:text-white">{tool.name}</h3>
      <p className="text-[13px] font-medium text-zinc-900 dark:text-white mt-1.5 leading-relaxed line-clamp-2 text-pretty text-center sm:text-left">{tool.desc}</p>
    </Link>
  )
}
