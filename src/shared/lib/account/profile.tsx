import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { LearnerProfile, ProfilePort } from '@/shared/api/profile'
import type { NetResult } from '@/shared/api/network'
import { ProfileContextOf, type ProfileContext, type ProfileState } from './profile-context'
import { useOnline } from '../use-online'
import { useAccountContext } from './context'

/**
 * The learner's profile (B1), offline first: read once signed in and again when the device comes
 * back online; the last read kept in memory, so a screen opened again shows it at once and offline
 * still shows it. Signed out, none.
 */
export function ProfileProvider({ port, children }: { port: ProfilePort; children: ReactNode }) {
  const { account } = useAccountContext()
  const online = useOnline()
  const id = account?.id ?? null
  const [held, setHeld] = useState<{ id: string; state: ProfileState } | null>(null)
  useEffect(() => {
    if (!id || !online) return
    let current = true
    void port.read().then((result) => {
      if (!current) return
      setHeld((before) =>
        result.ok
          ? { id, state: { kind: 'ready', profile: result.value } }
          : before?.id === id && before.state.kind === 'ready'
            ? before
            : { id, state: { kind: 'failed' } },
      )
    })
    return () => {
      current = false
    }
  }, [port, id, online])
  const state = useMemo<ProfileState>(
    () => (!id ? { kind: 'guest' } : held?.id === id ? held.state : { kind: 'loading' }),
    [id, held],
  )
  const kept = useCallback(
    async (asked: Promise<NetResult<LearnerProfile>>) => {
      const result = await asked
      if (result.ok && id) setHeld({ id, state: { kind: 'ready', profile: result.value } })
      return result
    },
    [id],
  )
  const value = useMemo<ProfileContext>(
    () => ({
      state,
      port,
      save: (patch) => kept(port.save(patch)),
      uploadAvatar: (picture) => kept(port.uploadAvatar(picture)),
      removeAvatar: () => kept(port.removeAvatar()),
    }),
    [state, port, kept],
  )
  return <ProfileContextOf value={value}>{children}</ProfileContextOf>
}
