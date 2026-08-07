import { useState } from 'react'

const CODES: [number, string, string][] = [
  [100, 'Continue', 'Informational — client may continue with its request.'],
  [101, 'Switching Protocols', 'The server is switching protocols as requested.'],
  [200, 'OK', 'The request succeeded.'],
  [201, 'Created', 'A new resource was created as a result.'],
  [202, 'Accepted', 'Request accepted for processing, but not completed.'],
  [204, 'No Content', 'Request succeeded but there is no content to send back.'],
  [301, 'Moved Permanently', 'Resource has permanently moved to a new URL.'],
  [302, 'Found', 'Resource temporarily located elsewhere.'],
  [304, 'Not Modified', 'Cached copy is still valid.'],
  [307, 'Temporary Redirect', 'Temporary redirect preserving the method.'],
  [308, 'Permanent Redirect', 'Permanent redirect preserving the method.'],
  [400, 'Bad Request', 'The server cannot process the request due to client error.'],
  [401, 'Unauthorized', 'Authentication is required and has failed or not been provided.'],
  [403, 'Forbidden', 'The server understood the request but refuses to authorize it.'],
  [404, 'Not Found', 'The requested resource could not be found.'],
  [405, 'Method Not Allowed', 'The HTTP method is not allowed for this resource.'],
  [408, 'Request Timeout', 'The server timed out waiting for the request.'],
  [409, 'Conflict', 'The request conflicts with the current state of the resource.'],
  [410, 'Gone', 'The resource is no longer available.'],
  [418, "I'm a teapot", 'HTTP status code defined as a joke (RFC 2324).'],
  [422, 'Unprocessable Entity', 'The server understands the content but cannot process it.'],
  [429, 'Too Many Requests', 'The user has sent too many requests in a given time.'],
  [500, 'Internal Server Error', 'A generic server-side error occurred.'],
  [501, 'Not Implemented', 'The server does not support the requested functionality.'],
  [502, 'Bad Gateway', 'An invalid response was received from the upstream server.'],
  [503, 'Service Unavailable', 'The server is not ready to handle the request.'],
  [504, 'Gateway Timeout', 'The upstream server failed to respond in time.'],
  [505, 'HTTP Version Not Supported', 'The HTTP protocol version is not supported.'],
]

const CLASS = {
  '1': { label: '1xx Informational', color: 'bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300' },
  '2': { label: '2xx Success', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300' },
  '3': { label: '3xx Redirection', color: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300' },
  '4': { label: '4xx Client Error', color: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-300' },
  '5': { label: '5xx Server Error', color: 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300' },
}

export default function HttpStatus() {
  const [q, setQ] = useState('')
  const filtered = CODES.filter(([n, name]) => String(n).includes(q) || name.toLowerCase().includes(q.toLowerCase()))
  return (
    <div className="space-y-4">
      <input value={q} onChange={e => setQ(e.target.value)} className="w-full border px-3 h-10 text-sm" placeholder="Search by code or name…" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map(([code, name, desc]) => (
          <div key={code} className="border p-3">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${CLASS[String(code)[0] as '1'].color}`}>{code}</span>
              <span className="text-sm font-semibold">{name}</span>
            </div>
            <p className="text-xs text-zinc-500 mt-1.5">{desc}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {Object.values(CLASS).map(c => (
          <span key={c.label} className={`px-2 py-1 rounded text-[11px] font-bold ${c.color}`}>{c.label}</span>
        ))}
      </div>
    </div>
  )
}
