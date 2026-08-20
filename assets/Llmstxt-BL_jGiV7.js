import{r as s,j as t}from"./index-Do83dEV8.js";import{B as x}from"./Button-L890mn-c.js";import{D as u}from"./DownloadButton-3cTRzY5B.js";import{s as m}from"./download-CyCRIN1C.js";function v(){const[o,n]=s.useState("NutterTools"),[a,i]=s.useState("Free internet tools for everyday tasks - images, PDFs, audio, video and more."),[l,c]=s.useState(`Tools
- PDF Tools: https://nutter.tools/tools/pdf-tools
- Image Tools: https://nutter.tools/tools/image-tools
- AI Tools: https://nutter.tools/tools/ai-tools

About
- About NutterTools: https://nutter.tools/about
- Privacy: https://nutter.tools/privacy`),r=s.useMemo(()=>`# ${o}

> ${a}

${l.split(`

`).map(e=>{const[d,...p]=e.split(`
`);return`## ${d}

${p.join(`
`)}`}).join(`

`)}
`,[o,a,l]);return t.jsxs("div",{className:"space-y-5",children:[t.jsxs("div",{className:"grid md:grid-cols-3 gap-2 text-sm",children:[t.jsxs("div",{children:[t.jsx("label",{className:"text-[11px] font-semibold text-zinc-900 dark:text-white uppercase",children:"Site title"}),t.jsx("input",{value:o,onChange:e=>n(e.target.value),className:"w-full mt-1  border border-zinc-200 dark:border-zinc-700 px-3 py-2 transition-all duration-200"})]}),t.jsxs("div",{className:"col-span-2",children:[t.jsx("label",{className:"text-[11px] font-semibold text-zinc-900 dark:text-white uppercase",children:"Description"}),t.jsx("input",{value:a,onChange:e=>i(e.target.value),className:"w-full mt-1  border border-zinc-200 dark:border-zinc-700 px-3 py-2 transition-all duration-200"})]})]}),t.jsxs("div",{children:[t.jsx("label",{className:"text-[11px] font-semibold text-zinc-900 dark:text-white uppercase",children:"Sections — one per blank line, first line = heading"}),t.jsx("textarea",{value:l,onChange:e=>c(e.target.value),className:"w-full h-[220px] border p-3 text-sm font-mono mt-1"})]}),t.jsx("pre",{className:"border p-3 text-xs max-h-[260px] overflow-auto whitespace-pre-wrap",children:r}),t.jsxs("div",{className:"flex gap-2.5",children:[t.jsx(x,{variant:"secondary",onClick:()=>navigator.clipboard.writeText(r),children:"Copy llms.txt"}),t.jsx(u,{onClick:()=>m(`data:text/plain;charset=utf-8,${encodeURIComponent(r)}`,"llms.txt"),className:"px-5 h-10",children:"Download"})]}),t.jsx("p",{className:"text-[11px] text-zinc-500",children:"llms.txt tells AI crawlers (ChatGPT, Claude, Perplexity…) what your site is about. Host the file at the root of your domain."})]})}export{v as default};
