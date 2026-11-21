import { beatsPerBar, chordSymbol, keySymbol, parseKey, readChordSymbol } from '@/shared/lib/music'
import {
  CHORD_BEATS,
  isSectionKind,
  isSheetMeter,
  isArrangerNumber,
  isInto,
  isMain,
  isVariation,
  NO_MARKS,
  SECTION_KINDS,
  SECTION_REPEATS,
  type ChordSheet,
  type SectionKind,
  type SheetChord,
  type SheetSection,
} from './chord-sheet'

/**
 * A chord sheet as one line of text (R29 CP5), what a Share link carries and a saved sheet keeps:
 * `Am 3/4; intro v4: Am; verse x2: Am:2 G/B:1 | C`. The key and the time, then each section: its
 * kind, `xN` its repeats and `vN` its variation where not 1, its arranger marks where set (`i1` its
 * Intro, `mAB` its Main each time through, `-` for one unset, `fill` or `break` into the next, `e2` its
 * Ending), and its bars between `|`, `:N` a chord's beats where it does not last a bar.
 */
export function sheetToText(sheet: ChordSheet): string {
  const bar = beatsPerBar(sheet.meter)
  const sections = sheet.sections.map((section) => {
    const head = [
      section.kind,
      ...(section.repeats === 1 ? [] : [`x${section.repeats}`]),
      ...(section.variation === 1 ? [] : [`v${section.variation}`]),
      ...marksText(section.marks),
    ].join(' ')
    const bars = section.bars.map((each) =>
      each.chords
        .map(({ chord, beats }) => chordSymbol(chord) + (beats === bar ? '' : `:${beats}`))
        .join(' '),
    )
    return `${head}: ${bars.join(' | ')}`.trimEnd()
  })
  return [`${keySymbol(sheet.key)} ${sheet.meter}`, ...sections].join('; ')
}

/** Bars on a line of a written chart, as a lead sheet sets them. */
const CHART_BARS = 4

/**
 * A chord sheet as a chart a musician reads and prints: its title, key, time and tempo, then each
 * section under its name (`Verse ×2`), its bars four to a line between bar lines, a chord's beats
 * after it where it does not last the bar (`| Bb:2 C:2 |`).
 */
export function sheetChart(
  sheet: ChordSheet,
  heading: { readonly title: string; readonly tempo: number },
  sectionName: (kind: SectionKind) => string,
): string {
  const bar = beatsPerBar(sheet.meter)
  const sections = sheet.sections.map((section) => {
    const bars = section.bars.map((each) =>
      each.chords
        .map(({ chord, beats }) => chordSymbol(chord) + (beats === bar ? '' : `:${beats}`))
        .join(' '),
    )
    const lines = Array.from(
      { length: Math.ceil(bars.length / CHART_BARS) },
      (_, line) => `| ${bars.slice(line * CHART_BARS, (line + 1) * CHART_BARS).join(' | ')} |`,
    )
    const name = sectionName(section.kind) + (section.repeats === 1 ? '' : ` ×${section.repeats}`)
    return [name, ...lines].join('\n')
  })
  const head = `${keySymbol(sheet.key)} · ${sheet.meter} · ${heading.tempo} BPM`
  return [heading.title, head, ...sections].join('\n\n') + '\n'
}

/** A chart's line of key, time and tempo: `F · 4/4 · 130 BPM`, the tempo optional. */
const CHART_HEAD = /^(\S+)\s*·\s*(\d+\/\d+)(?:\s*·\s*(\d+)\s*BPM)?$/i
/** A section's times through after its name: `×2` or `x2`. */
const CHART_TIMES = /\s*[×x]\s*(\d+)$/i

/** A chart read: its sheet, and the title and tempo it gives where it gives them. */
export interface ReadChart {
  readonly sheet: ChordSheet
  readonly title: string | null
  readonly tempo: number | null
}

/**
 * A chart as text read back (`sheetChart`'s, or the one line `sheetToText` writes): its title, the key,
 * time and tempo, each section under its name (`sectionKind` reads the names in the learner's language;
 * the kinds' own names read too, an unknown name is a Verse), its bars between bar lines. Null where no
 * chord reads.
 */
export function readChart(
  text: string,
  sectionKind: (name: string) => SectionKind | null,
): ReadChart | null {
  // A chart prints ♭ and ♯; a sheet keeps b and #, as typed.
  const plain = text.replaceAll('♭', 'b').replaceAll('♯', '#')
  const line = plain.trim()
  if (!line.includes('\n') && line.includes(';')) {
    const sheet = textToSheet(line)
    return sheet ? { sheet, title: null, tempo: null } : null
  }
  let title: string | null = null
  let head: { key: string; meter: string; tempo: number | null } | null = null
  const sections: { kind: SectionKind; repeats: number; bars: string[] }[] = []
  for (const raw of plain.split(/\r?\n/)) {
    const each = raw.trim()
    if (each === '') continue
    const said = CHART_HEAD.exec(each)
    if (said && !head) {
      head = {
        key: said[1] ?? 'C',
        meter: said[2] ?? '4/4',
        tempo: said[3] ? Number(said[3]) : null,
      }
    } else if (each.startsWith('|')) {
      if (sections.length === 0) sections.push({ kind: 'verse', repeats: 1, bars: [] })
      sections.at(-1)?.bars.push(
        ...each
          .split('|')
          .map((bar) => bar.trim())
          .filter(Boolean),
      )
    } else if (!head && title === null && sections.length === 0) {
      title = each
    } else {
      const times = CHART_TIMES.exec(each)
      const name = times ? each.slice(0, times.index).trim() : each
      sections.push({
        kind:
          sectionKind(name) ?? KINDS.get(name.toLowerCase().replaceAll(/[\s-]/g, '')) ?? 'verse',
        repeats: times ? Number(times[1]) : 1,
        bars: [],
      })
    }
  }
  const written = sections
    .filter((section) => section.bars.length > 0)
    .map(
      (section) =>
        `${section.kind}${section.repeats === 1 ? '' : ` x${section.repeats}`}: ${section.bars.join(' | ')}`,
    )
  if (written.length === 0) return null
  const sheet = textToSheet([`${head?.key ?? 'C'} ${head?.meter ?? '4/4'}`, ...written].join('; '))
  return sheet ? { sheet, title, tempo: head?.tempo ?? null } : null
}

/** A section's arranger marks as head words: none for what is unset. */
function marksText(marks: SheetSection['marks']): string[] {
  const mains = marks.mains.map((main) => main ?? '-').join('')
  return [
    ...(marks.intro === null ? [] : [`i${marks.intro}`]),
    ...(mains.replaceAll('-', '') === '' ? [] : [`m${mains}`]),
    ...(marks.into === null ? [] : [marks.into]),
    ...(marks.ending === null ? [] : [`e${marks.ending}`]),
  ]
}

/** A section's arranger marks read from its head words, what does not read left unset. */
function readMarks(head: readonly string[]): SheetSection['marks'] {
  const numbered = (letter: string) => {
    const value = Number(
      head.find((word) => new RegExp(`^${letter}\\d$`, 'i').test(word))?.slice(1),
    )
    return isArrangerNumber(value) ? value : null
  }
  const mains = head.find((word) => /^m[a-d-]+$/i.test(word))
  const into = head.map((word) => word.toLowerCase()).find(isInto)
  return {
    ...NO_MARKS,
    intro: numbered('i'),
    mains: mains
      ? [...mains.slice(1).toUpperCase()].map((letter) => (isMain(letter) ? letter : null))
      : [],
    into: into ?? null,
    ending: numbered('e'),
  }
}

const KINDS = new Map<string, SectionKind>(SECTION_KINDS.map((kind) => [kind.toLowerCase(), kind]))

const bounded = (text: string | undefined, min: number, max: number, otherwise: number) => {
  const value = Number(text)
  return Number.isInteger(value) ? Math.min(max, Math.max(min, value)) : otherwise
}

/** Chords laid end to end into bars of `perBar` beats, a new bar once one is full. */
function layIntoBars(chords: readonly SheetChord[], perBar: number): { chords: SheetChord[] }[] {
  const bars: { chords: SheetChord[] }[] = []
  let filled = perBar
  for (const chord of chords) {
    if (filled >= perBar) {
      bars.push({ chords: [] })
      filled = 0
    }
    bars[bars.length - 1]?.chords.push(chord)
    filled += chord.beats
  }
  return bars
}

/** A section's text read: its head's words in any case and order, its chords that read. */
function readSection(text: string, bar: number): SheetSection | null {
  const colon = text.indexOf(':')
  const head = (colon < 0 ? text : text.slice(0, colon)).trim().split(/\s+/)
  const kind = KINDS.get(head[0]?.toLowerCase() ?? '')
  if (!kind || !isSectionKind(kind)) return null
  const repeats = head.find((word) => /^x\d+$/i.test(word))?.slice(1)
  const variation = head.find((word) => /^v\d+$/i.test(word))?.slice(1)
  const bars = (colon < 0 ? '' : text.slice(colon + 1))
    .split('|')
    .map((part) => ({
      chords: part
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .flatMap((word): SheetChord[] => {
          const [symbol = '', beats] = word.split(':')
          const chord = readChordSymbol(symbol)
          return chord
            ? [{ chord, beats: bounded(beats, CHORD_BEATS.min, CHORD_BEATS.max, bar) }]
            : []
        }),
    }))
    .filter((each) => each.chords.length > 0)
  // A sheet saved before bars were written (no `|`): its chords laid into bars of the meter, as they
  // played; a chord that crossed a bar line stays whole in the bar it starts in, which is then marked.
  const laid =
    !text.includes('|') && bars.length === 1 ? layIntoBars(bars[0]?.chords ?? [], bar) : bars
  const v = Number(variation)
  return {
    kind,
    repeats: bounded(repeats, SECTION_REPEATS.min, SECTION_REPEATS.max, 1),
    variation: isVariation(v) ? v : 1,
    marks: readMarks(head),
    bars: laid,
  }
}

/**
 * A sheet's text read back, as leniently as it can be (Postel's law): a section or a chord that
 * does not read is left out, numbers kept in their range, a time no sheet has read as 4/4. Null
 * without a key or a section.
 */
export function textToSheet(text: string): ChordSheet | null {
  const [first = '', ...rest] = text.split(';')
  const [keyText = '', meterText = ''] = first.trim().split(/\s+/)
  const key = parseKey(keyText.charAt(0).toUpperCase() + keyText.slice(1))
  if (!key) return null
  const meter = isSheetMeter(meterText) ? meterText : '4/4'
  const bar = beatsPerBar(meter)
  const sections = rest.flatMap((part) => readSection(part, bar) ?? [])
  return sections.length > 0 ? { key, meter, sections } : null
}
