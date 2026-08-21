import{r as s,j as e}from"./index-BagPWHp0.js";import{B as l}from"./Button-BXaqM8vk.js";import{f as d}from"./marked.esm-BBJo1s5G.js";function x(){const[t,r]=s.useState(`# Hello 👋

This is **live** markdown preview.

- Edit the text on the left
- See the preview on the right
- [NutterTools](https://viasrijan.github.io/nuttertools/)

\`\`\`js
console.log('hi')
\`\`\`
`),[o,a]=s.useState(""),i=()=>a(d.parse(t));return e.jsxs("div",{className:"space-y-5",children:[e.jsx(l,{variant:"secondary",size:"sm",onClick:i,children:"Preview"}),e.jsxs("div",{className:"grid md:grid-cols-2 gap-3",children:[e.jsx("textarea",{value:t,onChange:n=>r(n.target.value),className:"w-full h-[420px] border p-3 font-mono text-xs"}),e.jsx("iframe",{title:"markdown-preview",sandbox:"",srcDoc:`<style>body{font-family:system-ui,sans-serif;padding:12px;line-height:1.6}pre{background:#f4f4f5;padding:10px;border-radius:6px;overflow:auto}code{font-family:monospace}</style>${o||'<p style="color:#999">Preview appears here</p>'}`,className:"w-full h-[420px] border bg-white"})]})]})}export{x as default};
