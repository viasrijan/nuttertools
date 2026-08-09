import{r as s,j as t}from"./index-ClUMs2H0.js";function u(){const[o,r]=s.useState("NutterTools"),[l,i]=s.useState("Free, privacy-first internet tools that run entirely in your browser."),[a,c]=s.useState(`Tools
- PDF Tools: https://nutter.tools/tools/pdf-tools
- Image Tools: https://nutter.tools/tools/image-tools
- AI Tools: https://nutter.tools/tools/ai-tools

About
- About NutterTools: https://nutter.tools/about
- Privacy: https://nutter.tools/privacy`),n=s.useMemo(()=>`# ${o}

> ${l}

${a.split(`

`).map(e=>{const[x,...p]=e.split(`
`);return`## ${x}

${p.join(`
`)}`}).join(`

`)}
`,[o,l,a]);return t.jsxs("div",{className:"space-y-4",children:[t.jsxs("div",{className:"grid md:grid-cols-3 gap-2 text-sm",children:[t.jsxs("div",{children:[t.jsx("label",{className:"text-[11px] font-semibold text-zinc-900 dark:text-white uppercase",children:"Site title"}),t.jsx("input",{value:o,onChange:e=>r(e.target.value),className:"w-full border px-2 py-2 mt-1"})]}),t.jsxs("div",{className:"col-span-2",children:[t.jsx("label",{className:"text-[11px] font-semibold text-zinc-900 dark:text-white uppercase",children:"Description"}),t.jsx("input",{value:l,onChange:e=>i(e.target.value),className:"w-full border px-2 py-2 mt-1"})]})]}),t.jsxs("div",{children:[t.jsx("label",{className:"text-[11px] font-semibold text-zinc-900 dark:text-white uppercase",children:"Sections — one per blank line, first line = heading"}),t.jsx("textarea",{value:a,onChange:e=>c(e.target.value),className:"w-full h-[220px] border p-3 text-sm font-mono mt-1"})]}),t.jsx("pre",{className:"border p-3 text-xs max-h-[260px] overflow-auto whitespace-pre-wrap",children:n}),t.jsxs("div",{className:"flex gap-2",children:[t.jsx("button",{onClick:()=>navigator.clipboard.writeText(n),className:"px-5 h-10 bg-zinc-900 text-white text-sm",children:"Copy llms.txt"}),t.jsx("a",{href:`data:text/plain;charset=utf-8,${encodeURIComponent(n)}`,download:"llms.txt",className:"px-5 h-10 border text-sm inline-flex items-center",children:"Download"})]}),t.jsx("p",{className:"text-[11px] text-zinc-500",children:"llms.txt tells AI crawlers (ChatGPT, Claude, Perplexity…) what your site is about. Host the file at the root of your domain."})]})}export{u as default};
