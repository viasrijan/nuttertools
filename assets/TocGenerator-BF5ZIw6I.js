import{r as i,j as e}from"./index-3laJNV5c.js";import{B as c}from"./Button-C93Tkd7H.js";function m(){const[n,d]=i.useState(`# My Article

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
</ul>`;return e.jsxs("div",{className:"space-y-5",children:[e.jsx("textarea",{value:n,onChange:t=>d(t.target.value),placeholder:"Paste markdown with headings (#, ##, …)",className:"w-full h-[220px] border p-3 text-sm font-mono"}),s.length===0&&e.jsx("p",{className:"text-xs text-zinc-500",children:"No headings found — use # level headings in your markdown."}),e.jsxs("div",{className:"grid md:grid-cols-2 gap-2",children:[e.jsxs("div",{children:[e.jsx("label",{className:"text-xs font-semibold text-zinc-900 dark:text-white uppercase",children:"Markdown TOC"}),e.jsx("pre",{className:"border p-3 text-xs mt-1 max-h-[240px] overflow-auto whitespace-pre-wrap",children:r})]}),e.jsxs("div",{children:[e.jsx("label",{className:"text-xs font-semibold text-zinc-900 dark:text-white uppercase",children:"HTML TOC"}),e.jsx("pre",{className:"border p-3 text-xs mt-1 max-h-[240px] overflow-auto whitespace-pre-wrap break-all",children:l})]})]}),e.jsxs("div",{className:"flex gap-2.5",children:[e.jsx(c,{variant:"secondary",onClick:()=>navigator.clipboard.writeText(r),children:"Copy Markdown"}),e.jsx(c,{variant:"outline",onClick:()=>navigator.clipboard.writeText(l),children:"Copy HTML"})]})]})}export{m as default};
