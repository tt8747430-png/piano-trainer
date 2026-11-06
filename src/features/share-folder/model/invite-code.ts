/** An invite code: letters, digits, hyphens (the server makes 20 hex digits). */
const CODE = /^[\w-]{4,64}$/

/**
 * The invite code in what the learner pasted (R32-C, Join with a link): a whole invite link, a link
 * without its address, or the code alone; none where it is none of these.
 */
export function inviteCodeOf(pasted: string): string | null {
  const text = pasted.trim()
  if (CODE.test(text)) return text
  const query = text.includes('?') ? text.slice(text.indexOf('?') + 1) : ''
  const code = new URLSearchParams(query.split('#')[0]).get('code')?.trim() ?? ''
  return text.includes('/songs/groups/join') && CODE.test(code) ? code : null
}
