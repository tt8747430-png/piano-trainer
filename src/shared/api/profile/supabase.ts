import { netResult, type NetOptions } from '../network'
import type { Backend, PianoClient } from '../supabase'
import type { LearnerProfile, ProfilePort } from './types'

const FIELDS = 'name, handle, bio, avatar, public, created_at'

interface Row {
  readonly name: string
  readonly handle: string | null
  readonly bio: string
  readonly avatar: string | null
  readonly public: boolean
  readonly created_at: string
}

const thrown = (error: { message: string }, status: number) =>
  Object.assign(new Error(error.message), { status })

/** An uploaded picture is a path in the private `avatars` bucket: `${userId}/…`. */
const isUploaded = (avatar: string | null): avatar is string => !!avatar && avatar.includes('/')

/**
 * The learner's profile on Supabase (B1): the `learner_profiles` row they own, `handle_available`,
 * and their pictures in the `avatars` bucket (read through an address signed for an hour).
 */
export function createSupabaseProfile(backend: Backend, { online }: NetOptions = {}): ProfilePort {
  const ask = <T>(run: (client: PianoClient, me: string) => Promise<T>) =>
    netResult(
      async () => {
        const client = await backend()
        const { data } = await client.auth.getSession()
        const me = data.session?.user.id
        if (!me) throw thrown({ message: 'Not signed in' }, 401)
        return run(client, me)
      },
      online ? { online } : {},
    )
  const profileOf = async (client: PianoClient, row: Row): Promise<LearnerProfile> => {
    let avatar = row.avatar
    if (isUploaded(avatar)) {
      const { data } = await client.storage.from('avatars').createSignedUrl(avatar, 60 * 60)
      avatar = data?.signedUrl ?? null
    }
    return {
      name: row.name,
      handle: row.handle,
      bio: row.bio,
      avatar,
      public: row.public,
      joined: row.created_at,
    }
  }
  const write = async (client: PianoClient, me: string, patch: Partial<Row>) => {
    const { data, error, status } = await client
      .from('learner_profiles')
      .update(patch)
      .eq('id', me)
      .select(FIELDS)
      .single()
    if (error) throw thrown(error, status)
    return profileOf(client, data)
  }
  return {
    read: () =>
      ask(async (client, me) => {
        const { data, error, status } = await client
          .from('learner_profiles')
          .select(FIELDS)
          .eq('id', me)
          .single()
        if (error) throw thrown(error, status)
        return profileOf(client, data)
      }),
    save: (patch) =>
      // An uploaded picture's address is never written back: only a built-in's id, or none.
      ask((client, me) =>
        write(
          client,
          me,
          patch.avatar !== undefined && patch.avatar !== null && isUploaded(patch.avatar)
            ? { ...patch, avatar: undefined }
            : patch,
        ),
      ),
    handleAvailable: (handle) =>
      ask(async (client) => {
        const { data, error, status } = await client.rpc('handle_available', { wanted: handle })
        if (error) throw thrown(error, status)
        return data
      }),
    uploadAvatar: (picture) =>
      ask(async (client, me) => {
        const path = `${me}/avatar-${Date.now()}.webp`
        const { error } = await client.storage
          .from('avatars')
          .upload(path, picture, { contentType: picture.type || 'image/webp', upsert: true })
        if (error) throw thrown(error, 400)
        return write(client, me, { avatar: path })
      }),
    removeAvatar: () => ask((client, me) => write(client, me, { avatar: null })),
  }
}
