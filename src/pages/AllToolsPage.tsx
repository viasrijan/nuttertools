import { useEffect } from 'react'
import toolsData from '../data/tools.json'
import ToolCard from '../components/ToolCard'

const TOOLS = toolsData as any[]

export default function AllToolsPage() {
  useEffect(() => {
    document.title = `All ${TOOLS.length} tools | NutterTools`
  }, [])

  return (
    <div className="max-w-[1200px] mx-auto px-5 sm:px-6 pt-8 md:pt-12 pb-16 animate-[omni-fade_0.3s_ease-out]">
      <h1 className="text-center text-[24px] md:text-[38px] font-[800] tracking-[-0.02em] text-zinc-900 dark:text-white">All Tools</h1>
      <p className="text-center mt-2 text-[15.5px] font-medium text-zinc-900 dark:text-white">
        Every one of the {TOOLS.length} tools — free, private, no sign-up.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
        {TOOLS.map((t) => <ToolCard key={t.id} tool={t} />)}
      </div>
    </div>
  )
}
