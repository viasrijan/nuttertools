import{r as s,j as e}from"./index-By2YPvnv.js";function h(){const[a,c]=s.useState("Q3 budget update"),[r,d]=s.useState("All staff"),[i,p]=s.useState(`Marketing budget increases 15%
Hiring freeze until October
New expense approval process from Monday`),[n,x]=s.useState("Please review your team budgets by Friday"),o=s.useMemo(()=>{const t=new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}),m=i.split(`
`).map(l=>l.trim()).filter(Boolean).map(l=>`- ${l}`).join(`
`);return`MEMORANDUM

To: ${r}
From: NutterTools Team
Date: ${t}
Re: ${a}

${m}

Action required: ${n}

Questions? Reply to this thread — answers will be shared team-wide.`},[a,r,i,n]);return e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"grid md:grid-cols-2 gap-2 text-sm",children:[e.jsxs("div",{children:[e.jsx("label",{className:"text-[11px] font-semibold text-zinc-900 dark:text-white uppercase",children:"Subject"}),e.jsx("input",{value:a,onChange:t=>c(t.target.value),className:"w-full border px-2 py-2 mt-1"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"text-[11px] font-semibold text-zinc-900 dark:text-white uppercase",children:"To"}),e.jsx("input",{value:r,onChange:t=>d(t.target.value),className:"w-full border px-2 py-2 mt-1"})]})]}),e.jsxs("div",{children:[e.jsx("label",{className:"text-[11px] font-semibold text-zinc-900 dark:text-white uppercase",children:"Key points — one per line"}),e.jsx("textarea",{value:i,onChange:t=>p(t.target.value),className:"w-full h-[130px] border p-3 text-sm mt-1"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"text-[11px] font-semibold text-zinc-900 dark:text-white uppercase",children:"Action required"}),e.jsx("input",{value:n,onChange:t=>x(t.target.value),className:"w-full border px-2 py-2 text-sm mt-1"})]}),e.jsx("pre",{className:"border p-4 text-sm whitespace-pre-wrap",children:o}),e.jsx("div",{className:"flex gap-2",children:e.jsx("button",{onClick:()=>navigator.clipboard.writeText(o),className:"px-5 h-10 bg-zinc-900 text-white text-sm",children:"Copy memo"})})]})}export{h as default};
