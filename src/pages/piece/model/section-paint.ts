import type { Paint } from '@/shared/ui'

/**
 * The words a learner names a song's parts with, in either language, by the paint each part's tile
 * wears (spec §3.4): a word's start, so a verse's plural or a Russian case still reads.
 */
const PARTS: readonly (readonly [Paint, readonly string[]])[] = [
  ['sand', ['intro', 'outro', 'ending', 'coda', 'вступлени', 'окончани', 'концовк', 'кода']],
  ['sky', ['verse', 'куплет']],
  ['grass', ['chorus', 'refrain', 'припев', 'рефрен']],
  ['lilac', ['bridge', 'бридж', 'связк']],
]

const WORDS = PARTS.map(
  ([paint, words]) =>
    [paint, new RegExp(`(?<![\\p{L}\\p{N}])(?:${words.join('|')})`, 'iu')] as const,
)

/**
 * A section's paint by its name (spec §3.4): an intro, outro or ending sand, a verse sky, a chorus or
 * refrain grass, a bridge lilac, anything else (an instrumental, an interlude, a hymn's part) yellow.
 * The part its name says first wins (`Verse 4 and ending` is a verse), so two sections of one kind
 * wear the same paint in either language.
 */
export function sectionPaint(name: string): Paint {
  let found: { paint: Paint; at: number } | null = null
  for (const [paint, words] of WORDS) {
    const at = words.exec(name)?.index
    if (at !== undefined && (found === null || at < found.at)) found = { paint, at }
  }
  return found?.paint ?? 'yellow'
}
