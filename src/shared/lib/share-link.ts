/** What sharing a link came to: the share sheet took it, it was copied, or it failed. */
export type LinkShared = 'shared' | 'copied' | 'failed'

/**
 * Shares a page of the app by its path (round 28, a lesson's or a course's Share link): handed to the
 * browser's share sheet where there is one (a phone), else copied. Null where the share sheet was
 * closed: no failure, nothing to say.
 */
export async function shareLink({
  title,
  path,
}: {
  title: string
  path: string
}): Promise<LinkShared | null> {
  const url = new URL(path, window.location.origin).href
  try {
    if (typeof navigator.share === 'function') {
      await navigator.share({ title, url })
      return 'shared'
    }
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') return null
    return 'failed'
  }
  return (await copyText(url)) ? 'copied' : 'failed'
}

/** Copies a text (a link) to the clipboard: false where there is no clipboard or it refused. */
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}
