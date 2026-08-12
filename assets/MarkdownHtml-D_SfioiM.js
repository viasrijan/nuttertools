import{r as n,j as e}from"./index-DJW17SVg.js";import{f as r}from"./marked.esm-BBJo1s5G.js";r.setOptions({gfm:!0,breaks:!0});function c(){const[t,a]=n.useState(`# Hello NutterTools

**Bold** and *italic*, a [link](https://nutter.tools), a list:

- item 1
- item 2

> Quote here

\`inline code\` and:

\`\`\`js
console.log("hi")
\`\`\``),s=n.useMemo(()=>{try{return r.parse(t)}catch{return""}},[t]);return e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"grid md:grid-cols-2 gap-2",children:[e.jsxs("div",{children:[e.jsx("label",{className:"text-xs font-semibold text-zinc-900 dark:text-white uppercase",children:"Markdown"}),e.jsx("textarea",{value:t,onChange:i=>a(i.target.value),className:"w-full h-[320px] border p-3 text-sm font-mono mt-1"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"text-xs font-semibold text-zinc-900 dark:text-white uppercase",children:"HTML output"}),e.jsx("pre",{className:"border p-3 text-xs font-mono mt-1 h-[320px] overflow-auto whitespace-pre-wrap break-all",children:s})]})]}),e.jsx("div",{className:"flex gap-2",children:e.jsx("button",{onClick:()=>navigator.clipboard.writeText(s),className:"px-5 h-10 bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600 text-sm",children:"Copy HTML"})})]})}export{c as default};
