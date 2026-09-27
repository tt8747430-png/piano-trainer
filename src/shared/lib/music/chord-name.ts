/** A triad's suffix and its numeral's mark. */
export interface TriadName {
  readonly suffix: string
  readonly mark: string
}

/** A 7th chord's name around its highest number (`m` 9, `m` 7 `♭5`, `Maj` 13 `sus4`), and its numeral's mark. */
export interface SeventhName {
  readonly lead: string
  readonly trail: string
  readonly mark: string
}

/** The triads, by the semitones of their 3rd (or the tone suspended in its place) and 5th. */
const TRIADS = new Map<string, TriadName>([
  ['4 7', { suffix: '', mark: '' }],
  ['3 7', { suffix: 'm', mark: '' }],
  ['3 6', { suffix: '°', mark: '°' }],
  ['4 8', { suffix: '+', mark: '+' }],
  ['2 7', { suffix: 'sus2', mark: '' }],
  ['5 7', { suffix: 'sus4', mark: '' }],
])

/** The 7th chords, by the semitones of their 3rd (or suspended tone), 5th and 7th. */
const SEVENTHS = new Map<string, SeventhName>([
  ['4 7 11', { lead: 'Maj', trail: '', mark: '' }],
  ['3 7 10', { lead: 'm', trail: '', mark: '' }],
  ['4 7 10', { lead: '', trail: '', mark: '' }],
  ['3 6 10', { lead: 'm', trail: '♭5', mark: 'ø' }],
  ['3 6 9', { lead: '°', trail: '', mark: '°' }],
  ['3 7 11', { lead: 'm(maj', trail: ')', mark: '' }],
  ['4 8 11', { lead: '+Maj', trail: '', mark: '+' }],
  ['4 8 10', { lead: '', trail: '#5', mark: '+' }],
  ['2 7 10', { lead: '', trail: 'sus2', mark: '' }],
  ['2 7 11', { lead: 'Maj', trail: 'sus2', mark: '' }],
  ['5 7 10', { lead: '', trail: 'sus4', mark: '' }],
  ['5 7 11', { lead: 'Maj', trail: 'sus4', mark: '' }],
])

function named<V>(table: ReadonlyMap<string, V>, semitones: readonly number[]): V {
  const name = table.get(semitones.join(' '))
  if (!name) throw new RangeError(`No chord is named by ${semitones.join(' ')}`)
  return name
}

/** A triad's name from the semitones of its 3rd and 5th: `m`, `°`, `sus4`. */
export const triadName = (semitones: readonly number[]): TriadName => named(TRIADS, semitones)

/** A 7th chord's name from the semitones of its 3rd, 5th and 7th. */
export const seventhName = (semitones: readonly number[]): SeventhName => named(SEVENTHS, semitones)
