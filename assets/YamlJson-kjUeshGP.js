import{r as o,j as e}from"./index-C9h2sjyn.js";import{l as p,d as g}from"./js-yaml-CtRGlkVu.js";const u=`name: NutterTools
version: 1.0.0
tools:
  - id: json-formatter
    implemented: true
  - id: video-compressor
    implemented: false
deploy:
  provider: github-pages
  branch: main
`,h=`{
  "name": "NutterTools",
  "version": "1.0.0",
  "tools": [
    { "id": "json-formatter", "implemented": true },
    { "id": "video-compressor", "implemented": false }
  ],
  "deploy": { "provider": "github-pages", "branch": "main" }
}`;function f(){const[s,l]=o.useState(u),[r,i]=o.useState(h),[a,c]=o.useState("y2j"),[d,n]=o.useState(""),m=()=>{n("");try{i(JSON.stringify(p(s),null,2))}catch(t){n(t.message)}},x=()=>{n("");try{l(g(JSON.parse(r),{indent:2}))}catch(t){n(t.message)}};return e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex flex-wrap gap-2",children:[e.jsx("button",{onClick:()=>{c("y2j"),m()},className:`px-4 h-9 text-sm border ${a==="y2j"?"bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600":""}`,children:"YAML → JSON"}),e.jsx("button",{onClick:()=>{c("j2y"),x()},className:`px-4 h-9 text-sm border ${a==="j2y"?"bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600":""}`,children:"JSON → YAML"}),e.jsx("button",{onClick:()=>navigator.clipboard.writeText(a==="y2j"?r:s),className:"px-4 h-9 border text-sm",children:"Copy"})]}),d&&e.jsx("p",{className:"text-xs text-red-500",children:d}),a==="y2j"?e.jsxs("div",{className:"grid md:grid-cols-2 gap-3",children:[e.jsx("textarea",{value:s,onChange:t=>l(t.target.value),className:"w-full h-96 border p-3 font-mono text-xs",spellCheck:!1}),e.jsx("textarea",{value:r,readOnly:!0,className:"w-full h-96 border p-3 font-mono text-xs bg-zinc-50 dark:bg-zinc-800"})]}):e.jsxs("div",{className:"grid md:grid-cols-2 gap-3",children:[e.jsx("textarea",{value:r,onChange:t=>i(t.target.value),className:"w-full h-96 border p-3 font-mono text-xs",spellCheck:!1}),e.jsx("textarea",{value:s,readOnly:!0,className:"w-full h-96 border p-3 font-mono text-xs bg-zinc-50 dark:bg-zinc-800"})]})]})}export{f as default};
