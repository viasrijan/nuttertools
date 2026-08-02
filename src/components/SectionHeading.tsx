export default function SectionHeading({ eyebrow, title, sub }: { eyebrow: string, title: string, sub?: string }) {
  return (
    <div className="mb-6">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-indigo-600 dark:text-indigo-400">{eyebrow}</p>
      <h2 className="text-[22px] md:text-[26px] font-bold tracking-[-0.025em] mt-1.5 text-balance">{title}</h2>
      {sub && <p className="text-[14px] text-zinc-500 mt-1 text-pretty">{sub}</p>}
    </div>
  )
}
