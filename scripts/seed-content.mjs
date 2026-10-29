// Puts the export (`node scripts/export-content.mjs`) into the project's content_items, published to everyone
// (ADR 0116, round 4): signed in as an editor, a batch at a time; an item whose version is unchanged is left.
// Run: SEED_EMAIL=… SEED_PASSWORD=… node scripts/seed-content.mjs
import { readFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const env = Object.fromEntries(
  readFileSync(new URL('../.env', import.meta.url), 'utf8')
    .split('\n')
    .filter((line) => line.includes('='))
    .map((line) => line.split('=').map((part) => part.trim())),
)
const { SEED_EMAIL: email, SEED_PASSWORD: password } = process.env
if (!email || !password) throw new Error('Set SEED_EMAIL and SEED_PASSWORD: an editor account')

const client = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: false },
})
const { error: signInError } = await client.auth.signInWithPassword({ email, password })
if (signInError) throw signInError

const records = JSON.parse(
  readFileSync(new URL('../content-export/items.json', import.meta.url), 'utf8'),
)
const { data: held, error: readError } = await client
  .from('content_items')
  .select('kind, id, version')
if (readError) throw readError
const versionOf = new Map(held.map(({ kind, id, version }) => [`${kind} ${id}`, version]))
const changed = records.filter(
  ({ kind, id, version }) => versionOf.get(`${kind} ${id}`) !== version,
)

const BATCH = 20
for (let i = 0; i < changed.length; i += BATCH) {
  const rows = changed.slice(i, i + BATCH).map(({ kind, id, version, meta, body }) => ({
    kind,
    id,
    version,
    meta,
    body,
    status: 'published',
    audience: 'everyone',
  }))
  const { error } = await client.from('content_items').upsert(rows, { onConflict: 'kind,id' })
  if (error) throw error
}
console.log(
  `${changed.length} of ${records.length} items written; ${records.length - changed.length} unchanged`,
)
await client.auth.signOut()
