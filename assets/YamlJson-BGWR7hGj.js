import{r as l,j as e}from"./index-z2ZORx-W.js";import{B as c}from"./Button-BZAqQRr4.js";import{C as u}from"./CopyButton-BR-elJPw.js";import{l as g,d as h}from"./js-yaml-CtRGlkVu.js";const j=`name: NutterTools
version: 1.0.0
tools:
  - id: json-formatter
    implemented: true
  - id: video-compressor
    implemented: false
deploy:
  provider: github-pages
  branch: main
`,f=`{
  "name": "NutterTools",
  "version": "1.0.0",
  "tools": [
    { "id": "json-formatter", "implemented": true },
    { "id": "video-compressor", "implemented": false }
  ],
  "deploy": { "provider": "github-pages", "branch": "main" }
}`;function S(){const[s,n]=l.useState(j),[a,i]=l.useState(f),[r,d]=l.useState("y2j"),[m,o]=l.useState(""),x=()=>{o("");try{i(JSON.stringify(g(s),null,2))}catch(t){o(t.message)}},p=()=>{o("");try{n(h(JSON.parse(a),{indent:2}))}catch(t){o(t.message)}};return e.jsxs("div",{className:"space-y-5",children:[e.jsxs("div",{className:"flex flex-wrap gap-2.5",children:[e.jsx(c,{variant:"outline",onClick:()=>{d("y2j"),x()},className:`px-4 h-9 text-sm ${r==="y2j"?"bg-indigo-600 text-white shadow-[0_4px_14px_-4px_rgba(79,70,229,0.6)]":""}`,children:"YAML → JSON"}),e.jsx(c,{variant:"outline",onClick:()=>{d("j2y"),p()},className:`px-4 h-9 text-sm ${r==="j2y"?"bg-indigo-600 text-white shadow-[0_4px_14px_-4px_rgba(79,70,229,0.6)]":""}`,children:"JSON → YAML"}),e.jsx(u,{value:r==="y2j"?a:s})]}),m&&e.jsx("p",{className:"text-xs text-red-500",children:m}),r==="y2j"?e.jsxs("div",{className:"grid md:grid-cols-2 gap-3",children:[e.jsx("textarea",{value:s,onChange:t=>n(t.target.value),className:"w-full h-96 border p-3 font-mono text-xs",spellCheck:!1}),e.jsx("textarea",{value:a,readOnly:!0,className:"w-full h-96 border p-3 font-mono text-xs bg-zinc-50 dark:bg-zinc-800"})]}):e.jsxs("div",{className:"grid md:grid-cols-2 gap-3",children:[e.jsx("textarea",{value:a,onChange:t=>i(t.target.value),className:"w-full h-96 border p-3 font-mono text-xs",spellCheck:!1}),e.jsx("textarea",{value:s,readOnly:!0,className:"w-full h-96 border p-3 font-mono text-xs bg-zinc-50 dark:bg-zinc-800"})]})]})}export{S as default};
