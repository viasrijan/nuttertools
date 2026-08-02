import { Link } from 'react-router-dom'
export default function ToolCard({ tool }: { tool: any }) {
  return (
    <Link to={`/tool/${tool.id}`} className="group relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="w-11 h-11 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 grid place-items-center text-[19px] transition-transform duration-200 group-hover:scale-110">{tool.icon}</div>
        {tool.popular && <span className="text-[10px] font-bold tracking-[0.08em] bg-gradient-to-r from-amber-400 to-orange-400 text-black px-2 py-0.5 rounded-full">POPULAR</span>}
      </div>
      <h3 className="font-semibold mt-4 text-[15px] tracking-[-0.01em] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{tool.name}</h3>
      <p className="text-[13px] text-zinc-500 mt-1.5 leading-relaxed line-clamp-2">{tool.desc}</p>
      <div className="flex items-center gap-2 mt-4">
        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${tool.implemented ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'}`}>
          {tool.implemented ? 'Ready to use' : 'Soon'}
        </span>
      </div>
    </Link>
  )
}
