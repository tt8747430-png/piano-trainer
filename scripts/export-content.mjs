// Writes every built-in piece and lesson as the database's records (ADR 0116, round 4):
// `content-export/items.json`, and `content-export/seed-NN.sql` in chunks small enough for the SQL editor.
// Run: node scripts/export-content.mjs
import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

const root = fileURLToPath(new URL('..', import.meta.url))
// Vite loads the app's modules as the app does: its aliases, its plugins, its file kinds.
const vite = await createServer({
  root,
  server: { middlewareMode: true, hmr: false },
  appType: 'custom',
  logLevel: 'error',
})
const { exportContent } = await vite.ssrLoadModule('/src/app/content/export-content.ts')

const records = exportContent()
const out = `${root}content-export`
rmSync(out, { recursive: true, force: true })
mkdirSync(out)
writeFileSync(`${out}/items.json`, JSON.stringify(records))

const literal = (value) => `'${JSON.stringify(value).replaceAll("'", "''")}'::jsonb`
const row = ({ kind, id, version, meta, body }) =>
  `('${kind}', '${id.replaceAll("'", "''")}', '${version}', 'published', 'everyone', ${literal(meta)}, ${literal(body)})`
const CHUNK = 400_000
let chunk = []
let size = 0
let n = 0
const flush = () => {
  if (chunk.length === 0) return
  const sql =
    'insert into public.content_items (kind, id, version, status, audience, meta, body) values\n' +
    chunk.join(',\n') +
    '\non conflict (kind, id) do update set version = excluded.version, status = excluded.status,' +
    ' meta = excluded.meta, body = excluded.body where content_items.version <> excluded.version;\n'
  writeFileSync(`${out}/seed-${String(n++).padStart(2, '0')}.sql`, sql)
  chunk = []
  size = 0
}
for (const record of records) {
  const line = row(record)
  if (size + line.length > CHUNK) flush()
  chunk.push(line)
  size += line.length
}
flush()
console.log(`${records.length} items, ${n} seed files in content-export/`)
await vite.close()
