import { describe, expect, it } from 'vitest'
import { createFakeProfile } from './fake'

// What every ProfilePort keeps (B1); the Supabase adapter answers the same over learner_profiles.
describe('a profile', () => {
  it('reads and saves the learner’s own, private until they say', async () => {
    const profile = createFakeProfile()
    expect(await profile.read()).toMatchObject({ ok: true, value: { public: false, handle: null } })
    expect(await profile.save({ name: 'Ana', handle: 'ana_plays', public: true })).toMatchObject({
      ok: true,
      value: { name: 'Ana', handle: 'ana_plays', public: true },
    })
  })

  it('checks a handle: free, taken, or not one', async () => {
    const profile = createFakeProfile({ taken: ['bo'] })
    expect(await profile.handleAvailable('ana')).toEqual({ ok: true, value: true })
    expect(await profile.handleAvailable('bo')).toEqual({ ok: true, value: false })
    expect(await profile.handleAvailable('A!')).toEqual({ ok: true, value: false })
    expect(await profile.save({ handle: 'bo' })).toMatchObject({ ok: false, reason: 'refused' })
  })

  it('takes a picture and takes it away', async () => {
    const profile = createFakeProfile()
    const uploaded = await profile.uploadAvatar(new Blob(['x'], { type: 'image/webp' }))
    expect(uploaded.ok && uploaded.value.avatar).toMatch(/^blob:/)
    expect(await profile.removeAvatar()).toMatchObject({ ok: true, value: { avatar: null } })
  })

  it('needs an account, and says offline before asking', async () => {
    expect(await createFakeProfile({ who: () => null }).read()).toMatchObject({
      ok: false,
      reason: 'refused',
    })
    expect(await createFakeProfile({ online: () => false }).read()).toEqual({
      ok: false,
      reason: 'offline',
    })
  })
})
