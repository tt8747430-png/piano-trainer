import { createClient, type SupabaseClient } from 'jsr:@supabase/supabase-js@2'
import { secretKey, sentSecretKey } from '../_shared/secret-keys.ts'

// Every table that holds a learner's documents (supabase/migrations), and every bucket keyed by them.
const MIRROR_TABLES = [
  'profiles',
  'settings',
  'progress',
  'views',
  'diagram_inversions',
  'patterns',
  'pieces',
  'takes',
  'library',
] as const

const BUCKETS = ['takes', 'avatars'] as const

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

const PAGE = 1000

async function emptyPrefix(admin: SupabaseClient, bucket: string, userId: string): Promise<void> {
  for (;;) {
    const { data, error } = await admin.storage.from(bucket).list(userId, { limit: PAGE })
    if (error) throw new Error(`${bucket}: ${error.message}`)
    const paths = (data ?? []).map((file) => `${userId}/${file.name}`)
    if (!paths.length) return
    const { error: removeError } = await admin.storage.from(bucket).remove(paths)
    if (removeError) throw new Error(`${bucket}: ${removeError.message}`)
  }
}

async function purge(admin: SupabaseClient, userId: string): Promise<void> {
  for (const bucket of BUCKETS) await emptyPrefix(admin, bucket, userId)

  for (const table of MIRROR_TABLES) {
    const { error } = await admin.from(table).delete().eq('user_id', userId)
    if (error) throw new Error(`${table}: ${error.message}`)
  }

  const { error: userError } = await admin.auth.admin.deleteUser(userId)
  if (userError) throw new Error(`auth: ${userError.message}`)
}

Deno.serve(async (request: Request) => {
  if (request.method !== 'POST') return json({ error: 'method_not_allowed' }, 405)

  if (!sentSecretKey(request)) return json({ error: 'forbidden' }, 403)

  const admin = createClient(Deno.env.get('SUPABASE_URL') ?? '', secretKey(), {
    auth: { persistSession: false },
  })

  const { data, error } = await admin
    .from('account_deletions')
    .select('user_id')
    .lte('purge_after', new Date().toISOString())
  if (error) return json({ error: error.message }, 500)

  const purged: string[] = []
  const failed: { userId: string; reason: string }[] = []

  for (const row of data ?? []) {
    const userId = row.user_id as string
    try {
      await purge(admin, userId)
      purged.push(userId)
    } catch (cause) {
      failed.push({ userId, reason: cause instanceof Error ? cause.message : String(cause) })
    }
  }

  return json({ purged: purged.length, failed })
})
