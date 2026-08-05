export default function SectionHeading({ eyebrow, title, sub }: { eyebrow: string, title: string, sub?: string }) {
  return (
    <div className="mb-8">
      <p className="text-[22px] font-bold tracking-[-0.01em] text-indigo-600 dark:text-indigo-400">{eyebrow}</p>
      <h2 className="text-[24px] md:text-[28px] font-bold tracking-[-0.03em] mt-2 text-balance">{title}</h2>
      {sub && <p className="text-[14px] text-zinc-600 dark:text-zinc-300 mt-1.5 text-pretty">{sub}</p>}
    </div>
  )
}
