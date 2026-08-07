import{r as a,j as e}from"./index-Dk2c6Lh-.js";const c=`<h1 style="color:rebeccapurple">Hello, World!</h1>
<p>Edit this HTML and see the preview update live.</p>
<style>
  button { background: #4f46e5; color: white; border: 0; padding: 8px 16px; border-radius: 6px; cursor: pointer; }
</style>
<button onclick="alert('It works!')">Click me</button>`;function p(){const[s,o]=a.useState(c),[l,i]=a.useState(!0),[n,r]=a.useState(c);return e.jsxs("div",{className:"space-y-3",children:[e.jsxs("div",{className:"flex gap-2",children:[e.jsx("button",{onClick:()=>r(s),className:"px-4 h-9 bg-zinc-900 text-white text-sm",children:"Preview"}),e.jsxs("label",{className:"flex items-center gap-2 text-sm",children:[e.jsx("input",{type:"checkbox",checked:l,onChange:t=>{i(t.target.checked),t.target.checked&&r(s)}}),"Auto-refresh"]})]}),e.jsxs("div",{className:"grid md:grid-cols-2 gap-3",children:[e.jsx("textarea",{value:s,onChange:t=>{o(t.target.value),l&&r(t.target.value)},className:"w-full h-[420px] border p-3 font-mono text-xs",spellCheck:!1}),e.jsx("iframe",{title:"html-preview",srcDoc:n,className:"w-full h-[420px] border bg-white"})]})]})}export{p as default};
