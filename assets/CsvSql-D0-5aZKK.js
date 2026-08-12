import{r as x,j as r}from"./index-B3PXtXjC.js";function N(a){const c=[];let t=[],n="",o=!1;for(let e=0;e<a.length;e++){const s=a[e];o?s==='"'&&a[e+1]==='"'?(n+='"',e++):s==='"'?o=!1:n+=s:s==='"'?o=!0:s===","?(t.push(n),n=""):s===`
`?(t.push(n),c.push(t),t=[],n=""):s!=="\r"&&(n+=s)}return(n!==""||t.length)&&(t.push(n),c.push(t)),c.filter(e=>e.some(s=>s!==""))}const v=a=>`'${a.replace(/'/g,"''")}'`,u=a=>a.replace(/[^a-zA-Z0-9_]/g,"_").replace(/^[0-9]/,"c_")||"col";function j(){const[a,c]=x.useState(`name,age,city
Alice,30,New York
Bob,25,London
Carol,29,"Paris, France"`),[t,n]=x.useState("users"),o=x.useMemo(()=>{try{const e=N(a);if(!e.length)return"/* Empty input */";const s=e[0],m=e.slice(1),d=s.map((l,p)=>{const i=m.length>0&&m.every(h=>h[p]!==void 0&&h[p]!==""&&!isNaN(Number(h[p])));return`${u(l)} ${i?"NUMERIC":"TEXT"}`}),f=`CREATE TABLE ${u(t)} (
  ${d.join(`,
  `)}
);`,g=m.map(l=>`INSERT INTO ${u(t)} (${s.map(u).join(", ")}) VALUES (${s.map((p,i)=>l[i]===void 0||l[i]===""?"NULL":v(l[i])).join(", ")});`);return`${f}

${g.join(`
`)}`}catch(e){return"/* Error: "+e.message+" */"}},[a,t]);return r.jsxs("div",{className:"space-y-4",children:[r.jsxs("div",{className:"flex items-center gap-2 text-sm",children:[r.jsx("label",{className:"font-semibold text-zinc-900 dark:text-white",children:"Table name"}),r.jsx("input",{value:t,onChange:e=>n(e.target.value),className:"border px-2 py-2 w-40"})]}),r.jsx("textarea",{value:a,onChange:e=>c(e.target.value),placeholder:"Paste CSV (first row = headers)…",className:"w-full h-[200px] border p-3 text-sm font-mono"}),r.jsx("button",{onClick:()=>navigator.clipboard.writeText(o),className:"px-5 h-10 bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600 text-sm",children:"Copy SQL"}),r.jsx("pre",{className:"border p-3 text-xs max-h-[300px] overflow-auto whitespace-pre",children:o})]})}export{j as default};
