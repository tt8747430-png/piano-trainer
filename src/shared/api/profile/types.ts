import type { NetResult } from '../network'

/** A handle as the server keeps it: lower case, 3 to 24 letters, digits or _. */
export const HANDLE = /^[a-z0-9_]{3,24}$/
export const NAME_MAX = 60
export const BIO_MAX = 160

/** The learner's public face (B1, D12, D17), as the server keeps it. */
export interface LearnerProfile {
  readonly name: string
  /** Their @handle, none until they choose one. */
  readonly handle: string | null
  readonly bio: string
  /** A built-in avatar's id, an uploaded picture's address, or none. */
  readonly avatar: string | null
  /** Whether others see their name and picture (Explore, published songs). */
  readonly public: boolean
  /** When the account began: an ISO date. */
  readonly joined: string
}

/** What Edit profile and Privacy change; a field left out stays. */
export type ProfilePatch = Partial<
  Pick<LearnerProfile, 'name' | 'handle' | 'bio' | 'avatar' | 'public'>
>

/**
 * The learner's profile on the server (B1): read, changed, a handle checked as it is typed, a
 * picture uploaded (already square, small) or taken away. Every call's result is a value; each
 * needs an account.
 */
export interface ProfilePort {
  read(): Promise<NetResult<LearnerProfile>>
  save(patch: ProfilePatch): Promise<NetResult<LearnerProfile>>
  /** Whether a handle is free for this learner: one they hold already is. */
  handleAvailable(handle: string): Promise<NetResult<boolean>>
  /** Uploads the picture and makes it the profile's; its address after. */
  uploadAvatar(picture: Blob): Promise<NetResult<LearnerProfile>>
  removeAvatar(): Promise<NetResult<LearnerProfile>>
}
