import { notFound } from '@tanstack/react-router'
import type { ContentKind, ContentPort } from '@/shared/api/content'

/**
 * Brings a body a route's screen needs onto the device before it renders (ADR 0116): the route's
 * pending screen while it comes, its not found where the server has none for this learner, and the
 * route's error screen, which says when the device is offline, where it cannot come now.
 */
export async function ensureContent(
  content: ContentPort,
  kind: ContentKind,
  id: string,
): Promise<void> {
  const result = await content.ensure(kind, id)
  if (result.ok) return
  if (result.reason === 'refused') throw notFound()
  throw new Error(`The ${kind} ${id} could not be brought onto the device: ${result.reason}`)
}
