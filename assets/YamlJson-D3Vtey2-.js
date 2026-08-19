import{r as n,j as e}from"./index-3laJNV5c.js";import{C as p}from"./CopyButton-CCXJ1svY.js";import{l as u,d as g}from"./js-yaml-CtRGlkVu.js";const j=`name: NutterTools
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
}`;function N(){const[s,l]=n.useState(j),[r,i]=n.useState(h),[a,c]=n.useState("y2j"),[d,o]=n.useState(""),m=()=>{o("");try{i(JSON.stringify(u(s),null,2))}catch(t){o(t.message)}},x=()=>{o("");try{l(g(JSON.parse(r),{indent:2}))}catch(t){o(t.message)}};return e.jsxs("div",{className:"space-y-5",children:[e.jsxs("div",{className:"flex flex-wrap gap-2.5",children:[e.jsx("button",{onClick:()=>{c("y2j"),m()},className:`px-4 h-9 text-sm border ${a==="y2j"?"bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600":""}`,children:"YAML → JSON"}),e.jsx("button",{onClick:()=>{c("j2y"),x()},className:`px-4 h-9 text-sm border ${a==="j2y"?"bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600":""}`,children:"JSON → YAML"}),e.jsx(p,{value:a==="y2j"?r:s})]}),d&&e.jsx("p",{className:"text-xs text-red-500",children:d}),a==="y2j"?e.jsxs("div",{className:"grid md:grid-cols-2 gap-3",children:[e.jsx("textarea",{value:s,onChange:t=>l(t.target.value),className:"w-full h-96 border p-3 font-mono text-xs",spellCheck:!1}),e.jsx("textarea",{value:r,readOnly:!0,className:"w-full h-96 border p-3 font-mono text-xs bg-zinc-50 dark:bg-zinc-800"})]}):e.jsxs("div",{className:"grid md:grid-cols-2 gap-3",children:[e.jsx("textarea",{value:r,onChange:t=>i(t.target.value),className:"w-full h-96 border p-3 font-mono text-xs",spellCheck:!1}),e.jsx("textarea",{value:s,readOnly:!0,className:"w-full h-96 border p-3 font-mono text-xs bg-zinc-50 dark:bg-zinc-800"})]})]})}export{N as default};
