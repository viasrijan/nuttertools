import{r,j as e}from"./index-CMgCjzXT.js";import{B as l}from"./Button-B50Gw3cP.js";import{f as a}from"./marked.esm-BBJo1s5G.js";a.setOptions({gfm:!0,breaks:!0});function x(){const[t,n]=r.useState(`# Hello NutterTools

**Bold** and *italic*, a [link](https://nutter.tools), a list:

- item 1
- item 2

> Quote here

\`inline code\` and:

\`\`\`js
console.log("hi")
\`\`\``),s=r.useMemo(()=>{try{return a.parse(t)}catch{return""}},[t]);return e.jsxs("div",{className:"space-y-5",children:[e.jsxs("div",{className:"grid md:grid-cols-2 gap-2",children:[e.jsxs("div",{children:[e.jsx("label",{className:"text-xs font-semibold text-zinc-900 dark:text-white uppercase",children:"Markdown"}),e.jsx("textarea",{value:t,onChange:o=>n(o.target.value),className:"w-full h-[320px] border p-3 text-sm font-mono mt-1"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"text-xs font-semibold text-zinc-900 dark:text-white uppercase",children:"HTML output"}),e.jsx("pre",{className:"border p-3 text-xs font-mono mt-1 h-[320px] overflow-auto whitespace-pre-wrap break-all",children:s})]})]}),e.jsx("div",{className:"flex gap-2.5",children:e.jsx(l,{variant:"secondary",onClick:()=>navigator.clipboard.writeText(s),children:"Copy HTML"})})]})}export{x as default};
