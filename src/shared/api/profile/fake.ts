import { netResult } from '../network'
import { HANDLE, type LearnerProfile, type ProfilePort } from './types'

const refused = (message: string) => Object.assign(new Error(message), { status: 403 })

/**
 * The profile in memory for tests, as the server keeps it: `who()` is who is signed in (null for no
 * one), `taken` the handles others hold, `online` the device's connection.
 */
export function createFakeProfile({
  who = () => 'ana',
  online = () => true,
  taken = [],
  initial = {},
}: {
  who?: () => string | null
  online?: () => boolean
  taken?: readonly string[]
  initial?: Partial<LearnerProfile>
} = {}): ProfilePort & { readonly uploads: Blob[] } {
  let profile: LearnerProfile = {
    name: '',
    handle: null,
    bio: '',
    avatar: null,
    public: false,
    joined: '2026-03-14T10:00:00.000Z',
    ...initial,
  }
  const uploads: Blob[] = []
  const ask = <T>(run: () => Promise<T>) => netResult(run, { online })
  const signedIn = () => {
    if (!who()) throw refused('Not signed in')
  }
  return {
    uploads,
    read: () =>
      ask(async () => {
        signedIn()
        return profile
      }),
    save: (patch) =>
      ask(async () => {
        signedIn()
        if (patch.handle && (!HANDLE.test(patch.handle) || taken.includes(patch.handle)))
          throw refused('Handle taken')
        profile = { ...profile, ...patch }
        return profile
      }),
    handleAvailable: (handle) =>
      ask(async () => {
        signedIn()
        return HANDLE.test(handle) && !taken.includes(handle)
      }),
    uploadAvatar: (picture) =>
      ask(async () => {
        signedIn()
        uploads.push(picture)
        profile = { ...profile, avatar: `blob:avatar-${uploads.length}` }
        return profile
      }),
    removeAvatar: () =>
      ask(async () => {
        signedIn()
        profile = { ...profile, avatar: null }
        return profile
      }),
  }
}
