import{r as a,j as e}from"./index-CmizELgx.js";import{B as u}from"./Button-CDdYcluq.js";function j(){const[s,c]=a.useState("Q3 budget update"),[r,d]=a.useState("All staff"),[i,p]=a.useState(`Marketing budget increases 15%
Hiring freeze until October
New expense approval process from Monday`),[n,x]=a.useState("Please review your team budgets by Friday"),l=a.useMemo(()=>{const t=new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}),m=i.split(`
`).map(o=>o.trim()).filter(Boolean).map(o=>`- ${o}`).join(`
`);return`MEMORANDUM

To: ${r}
From: NutterTools Team
Date: ${t}
Re: ${s}

${m}

Action required: ${n}

Questions? Reply to this thread — answers will be shared team-wide.`},[s,r,i,n]);return e.jsxs("div",{className:"space-y-5",children:[e.jsxs("div",{className:"grid md:grid-cols-2 gap-2 text-sm",children:[e.jsxs("div",{children:[e.jsx("label",{className:"text-[11px] font-semibold text-zinc-900 dark:text-white uppercase",children:"Subject"}),e.jsx("input",{value:s,onChange:t=>c(t.target.value),className:"w-full mt-1  border border-zinc-200 dark:border-zinc-700 px-3 py-2 transition-all duration-200"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"text-[11px] font-semibold text-zinc-900 dark:text-white uppercase",children:"To"}),e.jsx("input",{value:r,onChange:t=>d(t.target.value),className:"w-full mt-1  border border-zinc-200 dark:border-zinc-700 px-3 py-2 transition-all duration-200"})]})]}),e.jsxs("div",{children:[e.jsx("label",{className:"text-[11px] font-semibold text-zinc-900 dark:text-white uppercase",children:"Key points — one per line"}),e.jsx("textarea",{value:i,onChange:t=>p(t.target.value),className:"w-full h-[130px] border p-3 text-sm mt-1"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"text-[11px] font-semibold text-zinc-900 dark:text-white uppercase",children:"Action required"}),e.jsx("input",{value:n,onChange:t=>x(t.target.value),className:"w-full border px-2 py-2 text-sm mt-1"})]}),e.jsx("pre",{className:"border p-4 text-sm whitespace-pre-wrap",children:l}),e.jsx("div",{className:"flex gap-2.5",children:e.jsx(u,{variant:"secondary",onClick:()=>navigator.clipboard.writeText(l),children:"Copy memo"})})]})}export{j as default};
