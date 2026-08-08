import { useMemo, useState } from 'react'
import Ajv from 'ajv'

export default function JsonSchemaValidator() {
  const [schema, setSchema] = useState('{"type": "object", "required": ["name", "age"], "properties": {"name": {"type": "string"}, "age": {"type": "integer", "minimum": 0}, "email": {"type": "string", "format": "email"}}}')
  const [data, setData] = useState('{"name": "Nutter", "age": 25, "email": "not-an-email"}')

  const result = useMemo(() => {
    try {
      const ajv = new Ajv({ allErrors: true })
      const validate = ajv.compile(JSON.parse(schema))
      const instance = JSON.parse(data)
      const valid = validate(instance)
      return { valid, errors: validate.errors || [] }
    } catch (e: any) {
      return { valid: null as null | boolean, errors: [], message: e.message }
    }
  }, [schema, data])

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-semibold text-zinc-900 dark:text-white uppercase">JSON Schema</label>
        <textarea value={schema} onChange={e => setSchema(e.target.value)} className="w-full h-[180px] border p-3 text-sm font-mono mt-1" />
      </div>
      <div>
        <label className="text-xs font-semibold text-zinc-900 dark:text-white uppercase">Data to validate</label>
        <textarea value={data} onChange={e => setData(e.target.value)} className="w-full h-[180px] border p-3 text-sm font-mono mt-1" />
      </div>
      {result.valid === null && <p className="text-sm text-red-600">Parse error: {result.message}</p>}
      {result.valid === true && <div className="border border-green-500 p-3 text-sm text-green-600 font-semibold">✓ Valid — data matches the schema</div>}
      {result.valid === false && (
        <div className="border border-red-500 p-3 text-sm">
          <p className="text-red-600 font-semibold mb-2">✗ Invalid — {result.errors.length} error{result.errors.length === 1 ? '' : 's'}</p>
          <ul className="space-y-1 text-zinc-900 dark:text-white font-mono text-xs">
            {result.errors.map((e, i) => <li key={i}>· {e.instancePath || '(root)'} {e.message}</li>)}
          </ul>
        </div>
      )}
    </div>
  )
}
