export default function SectionHeading({ eyebrow, title, sub }: { eyebrow: string, title: string, sub?: string }) {
  return (
    <div className="mb-8">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-indigo-600/90 dark:text-indigo-400/90">{eyebrow}</p>
      <h2 className="text-[24px] md:text-[28px] font-bold tracking-[-0.03em] mt-2 text-balance">{title}</h2>
      {sub && <p className="text-[14px] text-zinc-500 mt-1.5 text-pretty">{sub}</p>}
    </div>
  )
}
