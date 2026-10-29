import { netResult, type NetResult } from '../network'

/** The kinds of content whose body may be away from the device: a piece's music, a lesson's sections. */
export const CONTENT_KINDS = ['piece', 'lesson'] as const
export type ContentKind = (typeof CONTENT_KINDS)[number]

export const isContentKind = (value: string): value is ContentKind =>
  (CONTENT_KINDS as readonly string[]).includes(value)

/**
 * Where content's bodies come from (ADR 0116). The catalog's index is always on the device; a body is
 * brought onto it the first time it is opened and is read from there after, offline too. A route
 * that needs a body ensures it before its screen renders.
 */
export interface ContentPort {
  /** Whether the body is on the device, so it reads at once. */
  has(kind: ContentKind, id: string): boolean
  /** Brings the body onto the device: refused where the server has none this learner may read. */
  ensure(kind: ContentKind, id: string): Promise<NetResult<void>>
}

const ON_DEVICE: NetResult<void> = { ok: true, value: undefined }

/** Content written into the app: every body is on the device. */
export function filesContent(): ContentPort {
  return { has: () => true, ensure: async () => ON_DEVICE }
}

type Ref = readonly [ContentKind, string]

/**
 * Content for tests: `away` bodies are not on the device until ensured, `refused` ones the server
 * will not give, and `online` is the device's connection.
 */
export function createFakeContent({
  away = [],
  refused = [],
  online = () => true,
}: { away?: readonly Ref[]; refused?: readonly Ref[]; online?: () => boolean } = {}): ContentPort {
  const name = (kind: ContentKind, id: string) => `${kind} ${id}`
  const missing = new Set(away.map(([kind, id]) => name(kind, id)))
  const denied = new Set(refused.map(([kind, id]) => name(kind, id)))
  return {
    has: (kind, id) => !missing.has(name(kind, id)) && !denied.has(name(kind, id)),
    ensure: async (kind, id) => {
      const ref = name(kind, id)
      if (!missing.has(ref) && !denied.has(ref)) return ON_DEVICE
      return netResult(
        async () => {
          if (denied.has(ref)) throw Object.assign(new Error(ref), { status: 404 })
          missing.delete(ref)
        },
        { online },
      )
    },
  }
}
