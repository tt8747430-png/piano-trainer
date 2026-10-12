export const NAME_MAX = 48

/** One cleaner for every step and job name. */
export function cleanName(raw: string, max = NAME_MAX): string {
  let s = raw.replace(/`([^`]*)`/g, '$1').replace(/`/g, '')
  // A path keeps its last part.
  s = s.replace(/(?:[\w@.+~-]*\/)+([\w@.+-]+)/g, '$1')
  s = s.replace(/\s+/g, ' ').trim()
  if (s === '') return 'Working on it'
  s = s.charAt(0).toUpperCase() + s.slice(1)
  if (s.length <= max) return s
  const room = s.slice(0, max - 1)
  const cut = room.lastIndexOf(' ')
  return `${(cut > max / 2 ? room.slice(0, cut) : room).replace(/[\s,.;:-]+$/, '')}…`
}

/** The first few words of a prompt, for the line shown before a plan arrives. */
export function firstWords(text: string, words = 6): string {
  const list = text.replace(/\s+/g, ' ').trim().split(' ').filter(Boolean)
  const head = list.slice(0, words).join(' ')
  return cleanName(list.length > words ? `${head}…` : head)
}
