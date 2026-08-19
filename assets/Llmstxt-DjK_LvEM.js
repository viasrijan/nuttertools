import{r as s,j as t}from"./index-yRSkqa7I.js";import{B as p}from"./Button-ELKmkabf.js";function h(){const[o,r]=s.useState("NutterTools"),[a,i]=s.useState("Free internet tools for everyday tasks - images, PDFs, audio, video and more."),[l,c]=s.useState(`Tools
- PDF Tools: https://nutter.tools/tools/pdf-tools
- Image Tools: https://nutter.tools/tools/image-tools
- AI Tools: https://nutter.tools/tools/ai-tools

About
- About NutterTools: https://nutter.tools/about
- Privacy: https://nutter.tools/privacy`),n=s.useMemo(()=>`# ${o}

> ${a}

${l.split(`

`).map(e=>{const[d,...x]=e.split(`
`);return`## ${d}

${x.join(`
`)}`}).join(`

`)}
`,[o,a,l]);return t.jsxs("div",{className:"space-y-5",children:[t.jsxs("div",{className:"grid md:grid-cols-3 gap-2 text-sm",children:[t.jsxs("div",{children:[t.jsx("label",{className:"text-[11px] font-semibold text-zinc-900 dark:text-white uppercase",children:"Site title"}),t.jsx("input",{value:o,onChange:e=>r(e.target.value),className:"w-full mt-1  border border-zinc-200 dark:border-zinc-700 px-3 py-2 transition-all duration-200"})]}),t.jsxs("div",{className:"col-span-2",children:[t.jsx("label",{className:"text-[11px] font-semibold text-zinc-900 dark:text-white uppercase",children:"Description"}),t.jsx("input",{value:a,onChange:e=>i(e.target.value),className:"w-full mt-1  border border-zinc-200 dark:border-zinc-700 px-3 py-2 transition-all duration-200"})]})]}),t.jsxs("div",{children:[t.jsx("label",{className:"text-[11px] font-semibold text-zinc-900 dark:text-white uppercase",children:"Sections — one per blank line, first line = heading"}),t.jsx("textarea",{value:l,onChange:e=>c(e.target.value),className:"w-full h-[220px] border p-3 text-sm font-mono mt-1"})]}),t.jsx("pre",{className:"border p-3 text-xs max-h-[260px] overflow-auto whitespace-pre-wrap",children:n}),t.jsxs("div",{className:"flex gap-2.5",children:[t.jsx(p,{variant:"secondary",onClick:()=>navigator.clipboard.writeText(n),children:"Copy llms.txt"}),t.jsx("a",{href:`data:text/plain;charset=utf-8,${encodeURIComponent(n)}`,download:"llms.txt",className:"px-5 h-10 border text-sm inline-flex items-center",children:"Download"})]}),t.jsx("p",{className:"text-[11px] text-zinc-500",children:"llms.txt tells AI crawlers (ChatGPT, Claude, Perplexity…) what your site is about. Host the file at the root of your domain."})]})}export{h as default};
