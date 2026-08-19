import{r as a,j as e}from"./index-CMgCjzXT.js";import{B as d}from"./Button-B50Gw3cP.js";const o=`<h1 style="color:rebeccapurple">Hello, World!</h1>
<p>Edit this HTML and see the preview update live.</p>
<style>
  button { background: #4f46e5; color: white; border: 0; padding: 8px 16px; border-radius: 6px; cursor: pointer; }
</style>
<button onclick="alert('It works!')">Click me</button>`;function x(){const[s,c]=a.useState(o),[l,i]=a.useState(!0),[n,r]=a.useState(o);return e.jsxs("div",{className:"space-y-5",children:[e.jsxs("div",{className:"flex gap-2.5",children:[e.jsx(d,{variant:"secondary",size:"sm",onClick:()=>r(s),children:"Preview"}),e.jsxs("label",{className:"flex items-center gap-2 text-sm",children:[e.jsx("input",{type:"checkbox",checked:l,onChange:t=>{i(t.target.checked),t.target.checked&&r(s)}}),"Auto-refresh"]})]}),e.jsxs("div",{className:"grid md:grid-cols-2 gap-3",children:[e.jsx("textarea",{value:s,onChange:t=>{c(t.target.value),l&&r(t.target.value)},className:"w-full h-[420px] border p-3 font-mono text-xs",spellCheck:!1}),e.jsx("iframe",{title:"html-preview",srcDoc:n,className:"w-full h-[420px] border bg-white"})]})]})}export{x as default};
