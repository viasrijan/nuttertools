import{r as a,j as e}from"./index-DoLVWPbT.js";import{f as n}from"./marked.esm-BBJo1s5G.js";n.setOptions({gfm:!0,breaks:!0});function c(){const[t,r]=a.useState(`# Hello NutterTools

**Bold** and *italic*, a [link](https://nutter.tools), a list:

- item 1
- item 2

> Quote here

\`inline code\` and:

\`\`\`js
console.log("hi")
\`\`\``),s=a.useMemo(()=>{try{return n.parse(t)}catch{return""}},[t]);return e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"grid md:grid-cols-2 gap-2",children:[e.jsxs("div",{children:[e.jsx("label",{className:"text-xs font-semibold text-zinc-900 dark:text-white uppercase",children:"Markdown"}),e.jsx("textarea",{value:t,onChange:l=>r(l.target.value),className:"w-full h-[320px] border p-3 text-sm font-mono mt-1"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"text-xs font-semibold text-zinc-900 dark:text-white uppercase",children:"HTML output"}),e.jsx("pre",{className:"border p-3 text-xs font-mono mt-1 h-[320px] overflow-auto whitespace-pre-wrap break-all",children:s})]})]}),e.jsx("div",{className:"flex gap-2",children:e.jsx("button",{onClick:()=>navigator.clipboard.writeText(s),className:"px-5 h-10 bg-zinc-900 text-white text-sm",children:"Copy HTML"})})]})}export{c as default};
