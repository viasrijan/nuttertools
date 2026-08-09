import{r as l,j as e}from"./index-ClUMs2H0.js";import{l as p,d as u}from"./js-yaml-CtRGlkVu.js";const h=`name: NutterTools
version: 1.0.0
tools:
  - id: json-formatter
    implemented: true
  - id: video-compressor
    implemented: false
deploy:
  provider: github-pages
  branch: main
`,j=`{
  "name": "NutterTools",
  "version": "1.0.0",
  "tools": [
    { "id": "json-formatter", "implemented": true },
    { "id": "video-compressor", "implemented": false }
  ],
  "deploy": { "provider": "github-pages", "branch": "main" }
}`;function f(){const[s,n]=l.useState(h),[a,i]=l.useState(j),[r,c]=l.useState("y2j"),[d,o]=l.useState(""),m=()=>{o("");try{i(JSON.stringify(p(s),null,2))}catch(t){o(t.message)}},x=()=>{o("");try{n(u(JSON.parse(a),{indent:2}))}catch(t){o(t.message)}};return e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex flex-wrap gap-2",children:[e.jsx("button",{onClick:()=>{c("y2j"),m()},className:`px-4 h-9 text-sm border ${r==="y2j"?"bg-zinc-900 text-white":""}`,children:"YAML → JSON"}),e.jsx("button",{onClick:()=>{c("j2y"),x()},className:`px-4 h-9 text-sm border ${r==="j2y"?"bg-zinc-900 text-white":""}`,children:"JSON → YAML"}),e.jsx("button",{onClick:()=>navigator.clipboard.writeText(r==="y2j"?a:s),className:"px-4 h-9 border text-sm",children:"Copy"})]}),d&&e.jsx("p",{className:"text-xs text-red-500",children:d}),r==="y2j"?e.jsxs("div",{className:"grid md:grid-cols-2 gap-3",children:[e.jsx("textarea",{value:s,onChange:t=>n(t.target.value),className:"w-full h-96 border p-3 font-mono text-xs",spellCheck:!1}),e.jsx("textarea",{value:a,readOnly:!0,className:"w-full h-96 border p-3 font-mono text-xs bg-zinc-50 dark:bg-zinc-800"})]}):e.jsxs("div",{className:"grid md:grid-cols-2 gap-3",children:[e.jsx("textarea",{value:a,onChange:t=>i(t.target.value),className:"w-full h-96 border p-3 font-mono text-xs",spellCheck:!1}),e.jsx("textarea",{value:s,readOnly:!0,className:"w-full h-96 border p-3 font-mono text-xs bg-zinc-50 dark:bg-zinc-800"})]})]})}export{f as default};
