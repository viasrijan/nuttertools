import{r as i,j as e}from"./index-BDTsgP4K.js";function p(){const[n,c]=i.useState(`# My Article

Intro paragraph.

## Getting Started

Stuff.

### Installation

More stuff.

## Advanced Usage

Details.

### FAQ

Questions.`),s=i.useMemo(()=>{const t=n.split(`
`),o=[];for(const x of t){const a=x.match(/^(#{1,6})\s+(.+)$/);a&&o.push({level:a[1].length,title:a[2],anchor:a[2].toLowerCase().replace(/[^\w\s-]/g,"").replace(/\s+/g,"-")})}return o},[n]),r=s.map(t=>"  ".repeat(t.level-1)+`- [${t.title}](#${t.anchor})`).join(`
`),l=`<ul>
`+s.map(t=>`${"  ".repeat(t.level-1)}<li><a href="#${t.anchor}">${t.title}</a></li>`).join(`
`)+`
</ul>`;return e.jsxs("div",{className:"space-y-4",children:[e.jsx("textarea",{value:n,onChange:t=>c(t.target.value),placeholder:"Paste markdown with headings (#, ##, …)",className:"w-full h-[220px] border p-3 text-sm font-mono"}),s.length===0&&e.jsx("p",{className:"text-xs text-zinc-500",children:"No headings found — use # level headings in your markdown."}),e.jsxs("div",{className:"grid md:grid-cols-2 gap-2",children:[e.jsxs("div",{children:[e.jsx("label",{className:"text-xs font-semibold text-zinc-900 dark:text-white uppercase",children:"Markdown TOC"}),e.jsx("pre",{className:"border p-3 text-xs mt-1 max-h-[240px] overflow-auto whitespace-pre-wrap",children:r})]}),e.jsxs("div",{children:[e.jsx("label",{className:"text-xs font-semibold text-zinc-900 dark:text-white uppercase",children:"HTML TOC"}),e.jsx("pre",{className:"border p-3 text-xs mt-1 max-h-[240px] overflow-auto whitespace-pre-wrap break-all",children:l})]})]}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx("button",{onClick:()=>navigator.clipboard.writeText(r),className:"px-5 h-10 bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600 text-sm",children:"Copy Markdown"}),e.jsx("button",{onClick:()=>navigator.clipboard.writeText(l),className:"px-5 h-10 border text-sm",children:"Copy HTML"})]})]})}export{p as default};
