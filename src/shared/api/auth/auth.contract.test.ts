import { describe, expect, it } from 'vitest'
import { createFakeAuth } from './fake-auth'

// What every AuthGateway keeps (ADR 0116). The fake is held to it here; the Supabase adapter's own
// test checks it maps the server's answers onto the same results.
describe('an auth gateway', () => {
  const learner = { email: 'ana@example.com', name: 'Ana', password: 'correct horse' }

  it('signs a new learner up and in, and knows them after', async () => {
    const auth = createFakeAuth()
    const signedUp = await auth.signUp(learner)
    expect(signedUp).toMatchObject({ ok: true, value: { confirm: false } })
    expect(await auth.current()).toMatchObject({ email: 'ana@example.com', name: 'Ana' })
  })

  it('refuses a wrong password, and an email already taken', async () => {
    const auth = createFakeAuth({ accounts: [learner] })
    expect(await auth.signIn(learner.email, 'wrong')).toMatchObject({
      ok: false,
      reason: 'refused',
    })
    expect(await auth.signUp(learner)).toMatchObject({ ok: false, reason: 'refused' })
    expect(await auth.current()).toBeNull()
  })

  it('says offline before asking, and signs out offline all the same', async () => {
    let online = true
    const auth = createFakeAuth({ accounts: [learner], online: () => online })
    expect(await auth.signIn(learner.email, learner.password)).toMatchObject({ ok: true })
    online = false
    expect(await auth.requestPasswordReset(learner.email)).toEqual({ ok: false, reason: 'offline' })
    await auth.signOut()
    expect(await auth.current()).toBeNull()
  })

  it('tells its listeners of each sign-in and sign-out until they stop listening', async () => {
    const auth = createFakeAuth({ accounts: [learner] })
    const heard: (string | null)[] = []
    const stop = auth.onChange((account) => heard.push(account?.email ?? null))
    await auth.signIn(learner.email, learner.password)
    await auth.signOut()
    stop()
    await auth.signIn(learner.email, learner.password)
    expect(heard).toEqual(['ana@example.com', null])
  })

  it('changes the password of the account signed in', async () => {
    const auth = createFakeAuth({ accounts: [learner] })
    await auth.signIn(learner.email, learner.password)
    expect(await auth.updatePassword('a new one')).toEqual({ ok: true, value: undefined })
    await auth.signOut()
    expect(await auth.signIn(learner.email, 'a new one')).toMatchObject({ ok: true })
  })

  it('renames the account signed in, and its listeners hear it', async () => {
    const auth = createFakeAuth({ accounts: [learner] })
    await auth.signIn(learner.email, learner.password)
    const heard: string[] = []
    auth.onChange((account) => heard.push(account?.name ?? ''))
    expect(await auth.updateName('Anna')).toMatchObject({ ok: true, value: { name: 'Anna' } })
    expect(heard).toEqual(['Anna'])
    expect(await auth.current()).toMatchObject({ name: 'Anna' })
  })

  it('schedules a deletion, signs out, and lets the learner cancel it on signing in again', async () => {
    const auth = createFakeAuth({
      accounts: [learner],
      now: () => Date.parse('2026-10-29T10:00:00Z'),
    })
    await auth.signIn(learner.email, learner.password)
    expect(await auth.requestDeletion()).toEqual({
      ok: true,
      value: { purgeAfter: '2026-11-28T10:00:00.000Z' },
    })
    expect(await auth.current()).toBeNull()
    await auth.signIn(learner.email, learner.password)
    expect(await auth.pendingDeletion()).toEqual({ ok: true, value: '2026-11-28T10:00:00.000Z' })
    expect(await auth.cancelDeletion()).toEqual({ ok: true, value: undefined })
    expect(await auth.pendingDeletion()).toEqual({ ok: true, value: null })
  })
})
