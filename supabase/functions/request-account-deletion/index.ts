import { createClient } from 'jsr:@supabase/supabase-js@2'
import { secretKey } from '../_shared/secret-keys.ts'

const GRACE_DAYS = 30

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })

Deno.serve(async (request: Request) => {
  if (request.method !== 'POST') return json({ error: 'method_not_allowed' }, 405)

  const authorization = request.headers.get('Authorization') ?? ''
  const token = authorization.replace(/^Bearer\s+/i, '')
  if (!token) return json({ error: 'unauthorized' }, 401)

  const admin = createClient(Deno.env.get('SUPABASE_URL') ?? '', secretKey(), {
    auth: { persistSession: false },
  })

  const { data: userData, error: userError } = await admin.auth.getUser(token)
  const user = userData?.user
  if (userError || !user) return json({ error: 'unauthorized' }, 401)

  const purgeAfter = new Date(Date.now() + GRACE_DAYS * 24 * 60 * 60 * 1000).toISOString()
  const requestedAt = new Date().toISOString()

  const { error: upsertError } = await admin
    .from('account_deletions')
    .upsert(
      { user_id: user.id, requested_at: requestedAt, purge_after: purgeAfter },
      { onConflict: 'user_id' },
    )
  if (upsertError) return json({ error: upsertError.message }, 500)

  const { error: signOutError } = await admin.auth.admin.signOut(token, 'global')
  if (signOutError) return json({ error: signOutError.message }, 500)

  return json({ requestedAt, purgeAfter })
})
