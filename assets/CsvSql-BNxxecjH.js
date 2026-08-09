import{r as x,j as r}from"./index-KzpBKpTY.js";function g(a){const l=[];let t=[],n="",o=!1;for(let e=0;e<a.length;e++){const s=a[e];o?s==='"'&&a[e+1]==='"'?(n+='"',e++):s==='"'?o=!1:n+=s:s==='"'?o=!0:s===","?(t.push(n),n=""):s===`
`?(t.push(n),l.push(t),t=[],n=""):s!=="\r"&&(n+=s)}return(n!==""||t.length)&&(t.push(n),l.push(t)),l.filter(e=>e.some(s=>s!==""))}const v=a=>`'${a.replace(/'/g,"''")}'`,u=a=>a.replace(/[^a-zA-Z0-9_]/g,"_").replace(/^[0-9]/,"c_")||"col";function j(){const[a,l]=x.useState(`name,age,city
Alice,30,New York
Bob,25,London
Carol,29,"Paris, France"`),[t,n]=x.useState("users"),o=x.useMemo(()=>{try{const e=g(a);if(!e.length)return"/* Empty input */";const s=e[0],m=e.slice(1),f=s.map((c,p)=>{const i=m.length>0&&m.every(h=>h[p]!==void 0&&h[p]!==""&&!isNaN(Number(h[p])));return`${u(c)} ${i?"NUMERIC":"TEXT"}`}),d=`CREATE TABLE ${u(t)} (
  ${f.join(`,
  `)}
);`,N=m.map(c=>`INSERT INTO ${u(t)} (${s.map(u).join(", ")}) VALUES (${s.map((p,i)=>c[i]===void 0||c[i]===""?"NULL":v(c[i])).join(", ")});`);return`${d}

${N.join(`
`)}`}catch(e){return"/* Error: "+e.message+" */"}},[a,t]);return r.jsxs("div",{className:"space-y-4",children:[r.jsxs("div",{className:"flex items-center gap-2 text-sm",children:[r.jsx("label",{className:"font-semibold text-zinc-900 dark:text-white",children:"Table name"}),r.jsx("input",{value:t,onChange:e=>n(e.target.value),className:"border px-2 py-2 w-40"})]}),r.jsx("textarea",{value:a,onChange:e=>l(e.target.value),placeholder:"Paste CSV (first row = headers)…",className:"w-full h-[200px] border p-3 text-sm font-mono"}),r.jsx("button",{onClick:()=>navigator.clipboard.writeText(o),className:"px-5 h-10 bg-zinc-900 text-white text-sm",children:"Copy SQL"}),r.jsx("pre",{className:"border p-3 text-xs max-h-[300px] overflow-auto whitespace-pre",children:o})]})}export{j as default};
