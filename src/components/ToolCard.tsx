import { Link } from 'react-router-dom'
export default function ToolCard({tool}:{tool:any}){
  return (
    <Link to={`/tool/${tool.id}`} className="group relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[16px] p-4 hover:shadow-lg hover:border-zinc-300 transition-all">
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-[10px] bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 grid place-items-center text-[18px]">{tool.icon}</div>
        {tool.popular && <span className="text-[10px] font-bold tracking-widest bg-amber-400 text-black px-2 py-0.5 rounded-full">POPULAR</span>}
      </div>
      <h3 className="font-semibold mt-3 text-[15px] group-hover:underline">{tool.name}</h3>
      <p className="text-[13px] text-zinc-500 mt-1 leading-snug line-clamp-2">{tool.desc}</p>
      {!tool.implemented && <span className="absolute bottom-2 right-3 text-[10px] text-zinc-400">SOON</span>}
    </Link>
  )
}
