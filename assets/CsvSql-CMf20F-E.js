import{r as h,j as n}from"./index-yRSkqa7I.js";import{B as N}from"./Button-ELKmkabf.js";function g(a){const l=[];let t=[],r="",o=!1;for(let e=0;e<a.length;e++){const s=a[e];o?s==='"'&&a[e+1]==='"'?(r+='"',e++):s==='"'?o=!1:r+=s:s==='"'?o=!0:s===","?(t.push(r),r=""):s===`
`?(t.push(r),l.push(t),t=[],r=""):s!=="\r"&&(r+=s)}return(r!==""||t.length)&&(t.push(r),l.push(t)),l.filter(e=>e.some(s=>s!==""))}const j=a=>`'${a.replace(/'/g,"''")}'`,u=a=>a.replace(/[^a-zA-Z0-9_]/g,"_").replace(/^[0-9]/,"c_")||"col";function C(){const[a,l]=h.useState(`name,age,city
Alice,30,New York
Bob,25,London
Carol,29,"Paris, France"`),[t,r]=h.useState("users"),o=h.useMemo(()=>{try{const e=g(a);if(!e.length)return"/* Empty input */";const s=e[0],m=e.slice(1),d=s.map((c,p)=>{const i=m.length>0&&m.every(f=>f[p]!==void 0&&f[p]!==""&&!isNaN(Number(f[p])));return`${u(c)} ${i?"NUMERIC":"TEXT"}`}),x=`CREATE TABLE ${u(t)} (
  ${d.join(`,
  `)}
);`,v=m.map(c=>`INSERT INTO ${u(t)} (${s.map(u).join(", ")}) VALUES (${s.map((p,i)=>c[i]===void 0||c[i]===""?"NULL":j(c[i])).join(", ")});`);return`${x}

${v.join(`
`)}`}catch(e){return"/* Error: "+e.message+" */"}},[a,t]);return n.jsxs("div",{className:"space-y-5",children:[n.jsxs("div",{className:"flex items-center gap-2 text-sm",children:[n.jsx("label",{className:"font-semibold text-zinc-900 dark:text-white",children:"Table name"}),n.jsx("input",{value:t,onChange:e=>r(e.target.value),className:"border px-2 py-2 w-40"})]}),n.jsx("textarea",{value:a,onChange:e=>l(e.target.value),placeholder:"Paste CSV (first row = headers)…",className:"w-full h-[200px] border p-3 text-sm font-mono"}),n.jsx(N,{variant:"secondary",onClick:()=>navigator.clipboard.writeText(o),children:"Copy SQL"}),n.jsx("pre",{className:"border p-3 text-xs max-h-[300px] overflow-auto whitespace-pre",children:o})]})}export{C as default};
