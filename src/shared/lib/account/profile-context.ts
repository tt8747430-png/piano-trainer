import { createContext, use } from 'react'
import type { NetResult } from '@/shared/api/network'
import type { LearnerProfile, ProfilePatch, ProfilePort } from '@/shared/api/profile'

/** Where the learner's profile stands: no account, being read the first time, read, or unread. */
export type ProfileState =
  | { readonly kind: 'guest' }
  | { readonly kind: 'loading' }
  | { readonly kind: 'ready'; readonly profile: LearnerProfile }
  | { readonly kind: 'failed' }

export interface ProfileContext {
  readonly state: ProfileState
  readonly port: ProfilePort
  /** Saves a change; the profile kept is the one the server answers with. */
  readonly save: (patch: ProfilePatch) => Promise<NetResult<LearnerProfile>>
  readonly uploadAvatar: (picture: Blob) => Promise<NetResult<LearnerProfile>>
  readonly removeAvatar: () => Promise<NetResult<LearnerProfile>>
}

export const ProfileContextOf = createContext<ProfileContext | null>(null)

/** The learner's profile and its acts (B1); needs a `ProfileProvider`. */
export function useLearnerProfile(): ProfileContext {
  const context = use(ProfileContextOf)
  if (!context) throw new Error('useLearnerProfile needs a ProfileProvider')
  return context
}
