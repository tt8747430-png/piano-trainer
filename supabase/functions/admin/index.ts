import { createClient } from 'jsr:@supabase/supabase-js@2'
import { secretKey } from '../_shared/secret-keys.ts'

// The admin's account tools (ADR 0116, round 5): what needs the service role, behind a check of the caller's
// own role. Every change is written to admin_log. Groups, switches and reports are tables the admin writes
// directly under row-level security.

const ROLES = ['admin', 'editor', 'learner'] as const
type Role = (typeof ROLES)[number]
const PAGE = 50

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
    },
  })

interface Account {
  id: string
  email: string
  name: string
  role: Role
  joinedAt: string
  lastSignInAt: string | null
}

const roleOf = (meta: Record<string, unknown> | undefined): Role => {
  const role = meta?.role
  return role === 'admin' || role === 'editor' ? role : 'learner'
}

Deno.serve(async (request: Request) => {
  if (request.method === 'OPTIONS') return json({})
  if (request.method !== 'POST') return json({ error: 'method_not_allowed' }, 405)

  const token = (request.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '')
  if (!token) return json({ error: 'unauthorized' }, 401)
  const admin = createClient(Deno.env.get('SUPABASE_URL') ?? '', secretKey(), {
    auth: { persistSession: false },
  })
  const { data: caller, error: callerError } = await admin.auth.getUser(token)
  if (callerError || !caller.user) return json({ error: 'unauthorized' }, 401)
  if (roleOf(caller.user.app_metadata) !== 'admin') return json({ error: 'forbidden' }, 403)

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return json({ error: 'bad_request' }, 400)
  }
  const log = (action: string, target: string, detail: Record<string, unknown> = {}) =>
    admin.from('admin_log').insert({ admin_id: caller.user.id, action, target, detail })

  if (body.action === 'list-accounts') {
    const page = typeof body.page === 'number' && body.page >= 1 ? Math.floor(body.page) : 1
    const query = typeof body.query === 'string' ? body.query.trim().toLowerCase() : ''
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: PAGE })
    if (error) return json({ error: error.message }, 500)
    const accounts: Account[] = data.users
      .map((user) => ({
        id: user.id,
        email: user.email ?? '',
        name: typeof user.user_metadata?.name === 'string' ? user.user_metadata.name : '',
        role: roleOf(user.app_metadata),
        joinedAt: user.created_at,
        lastSignInAt: user.last_sign_in_at ?? null,
      }))
      .filter((account) =>
        query ? `${account.email} ${account.name}`.toLowerCase().includes(query) : true,
      )
    return json({ accounts, more: data.users.length === PAGE })
  }

  if (body.action === 'set-role') {
    const userId = typeof body.userId === 'string' ? body.userId : ''
    const role = ROLES.find((each) => each === body.role)
    if (!userId || !role) return json({ error: 'bad_request' }, 400)
    if (userId === caller.user.id && role !== 'admin')
      return json({ error: 'An admin cannot take away their own role' }, 400)
    const { data: found, error: findError } = await admin.auth.admin.getUserById(userId)
    if (findError || !found.user) return json({ error: 'not_found' }, 404)
    // The server merges app_metadata key by key: a learner's role is set to null, never left out.
    const { error } = await admin.auth.admin.updateUserById(userId, {
      app_metadata: { ...found.user.app_metadata, role: role === 'learner' ? null : role },
    })
    if (error) return json({ error: error.message }, 500)
    await log('set-role', userId, { role })
    return json({ ok: true })
  }

  return json({ error: 'unknown_action' }, 400)
})
