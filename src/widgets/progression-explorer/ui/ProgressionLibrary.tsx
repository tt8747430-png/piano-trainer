import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  libraryByStyle,
  libraryParam,
  progressionMode,
  type LibraryProgression,
  type ProgressionStyle,
} from '@/entities/progression-library'
import type { ProgressionNames } from '@/entities/settings'
import { localText, useLocale } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import {
  chordSymbol,
  nashvilleNumber,
  numeralChord,
  numeralText,
  parseNumerals,
  printedSymbol,
  voiceLead,
  writtenKey,
  type ChordSize,
  type Key,
} from '@/shared/lib/music'
import { walkSounds } from '@/shared/lib/schedule'
import { usePlayback, usePlayhead } from '@/shared/lib/services'
import { ChoiceChips, ChordText, PlayButton } from '@/shared/ui'

type Playback = ReturnType<typeof usePlayback<string>>

/** How fast a row plays its progression: a chord each two beats, as the page's row. */
const ROW_TEMPO = 84
const BEATS_A_CHORD = 2

/**
 * The key a progression is shown in on its row: the key chosen, or, for a progression with no line
 * in that key's mode, the key of the same tonic in the mode it has.
 */
const rowKey = (progression: LibraryProgression, key: Key): Key => {
  const minor = progressionMode(progression, key.minor)
  return minor === key.minor ? key : writtenKey({ tonic: key.tonic, minor })
}

/**
 * The library, Progressions' second tab (A23, as musicca lists it): a list, not a wall of cards, its
 * styles as chips (All, Pop, Rock, Jazz …). Each row is the progression's line (numerals, Nashville
 * numbers or chords, as Progressions' Settings write them), its name, and its chords in the key
 * chosen in bar cells (`| C | G | Am | F |`); ▷ plays it in place, its sounding bar lit; a tap
 * anywhere else opens it in the Progression tab. The one shown is marked.
 */
export function ProgressionLibrary({
  musicKey,
  size,
  names,
  style,
  shown,
  onStyle,
  onChoose,
}: {
  musicKey: Key
  size: ChordSize
  names: ProgressionNames
  /** The style shown; every style where none (or one the library doesn't have) is chosen. */
  style: ProgressionStyle | undefined
  /** The library's progression the Progression tab shows, if it shows one. */
  shown: string | undefined
  onStyle: (style: ProgressionStyle | undefined) => void
  onChoose: (progression: LibraryProgression) => void
}) {
  const { t } = useTranslation('practice')
  const playback = usePlayback<string>()
  const styles = libraryByStyle()
  const chosen = styles.some((group) => group.style === style) ? style : undefined
  const listed = chosen ? styles.filter((group) => group.style === chosen) : styles
  return (
    <div className="flex flex-col gap-5">
      <ChoiceChips<ProgressionStyle | 'all'>
        label={t('progressions.library')}
        value={chosen ?? 'all'}
        options={[
          { value: 'all', label: t('progressions.allStyles') },
          ...styles.map((group) => ({
            value: group.style,
            label: t(`progressions.style.${group.style}`),
          })),
        ]}
        onChange={(next) => onStyle(next === 'all' ? undefined : next)}
      />
      {listed.map((group) => (
        <section
          key={group.style}
          aria-label={t(`progressions.style.${group.style}`)}
          className="flex flex-col gap-2"
        >
          {chosen ? null : (
            <h3 className="font-sans text-sm font-semibold text-muted-foreground">
              {t(`progressions.style.${group.style}`)}
            </h3>
          )}
          <ul className="flex flex-col card overflow-hidden divide-y divide-hairline">
            {group.progressions.map((progression) => (
              <li key={progression.id}>
                <ProgressionRow
                  progression={progression}
                  musicKey={rowKey(progression, musicKey)}
                  size={progression.size ?? size}
                  names={names}
                  shown={progression.id === shown}
                  playback={playback}
                  onChoose={() => onChoose(progression)}
                />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

function ProgressionRow({
  progression,
  musicKey,
  size,
  names,
  shown,
  playback,
  onChoose,
}: {
  progression: LibraryProgression
  musicKey: Key
  size: ChordSize
  names: ProgressionNames
  shown: boolean
  playback: Playback
  onChoose: () => void
}) {
  const { t } = useTranslation(['practice', 'music'])
  const locale = useLocale()
  const numerals = useMemo(
    () => parseNumerals(libraryParam(progression, musicKey.minor)) ?? [],
    [progression, musicKey.minor],
  )
  const chords = useMemo(
    () => numerals.map((numeral) => numeralChord(numeral, musicKey, size)),
    [numerals, musicKey, size],
  )
  const symbols = chords.map((chord) => chordSymbol(chord))
  const line = numerals
    .map((numeral, at) => {
      const chord = chords[at]
      if (names === 'numerals') return numeralText(numeral)
      if (names === 'nashville' && chord) return nashvilleNumber(chord, musicKey)
      return printedSymbol(symbols[at] ?? '')
    })
    .join(' – ')
  const onsets = useMemo(
    () => chords.map((_, at) => (at * BEATS_A_CHORD * 60) / ROW_TEMPO),
    [chords],
  )
  const playing = playback.playing === progression.id
  const sounding = usePlayhead(playing ? playback.handle : null, onsets)
  const name = localText(progression.name, locale)
  return (
    <article
      aria-label={name}
      aria-current={shown || undefined}
      className={cn(
        'relative flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted',
        shown && 'bg-muted',
      )}
    >
      <div className="flex min-w-0 flex-1 flex-col items-start gap-1.5">
        <button
          type="button"
          onClick={onChoose}
          className="flex min-w-0 flex-col items-start gap-0.5 text-left after:absolute after:inset-0 after:content-['']"
        >
          <span className="font-semibold wrap-anywhere">{line}</span>
          <span className="text-sm text-muted-foreground">{name}</span>
        </button>
        {/* Its chords in the key, a bar each, as a chart writes them: | C | G | Am | F |. */}
        <ol
          aria-label={t('practice:progressions.chordsIn')}
          className="flex max-w-full flex-wrap border-l border-border text-sm"
        >
          {symbols.map((symbol, at) => (
            <li
              key={at}
              aria-current={sounding === at || undefined}
              className={cn(
                'flex min-w-10 justify-center border-r border-border px-2 transition-colors duration-150',
                sounding === at && 'bg-selected text-selected-foreground',
              )}
            >
              <ChordText symbol={symbol} />
            </li>
          ))}
        </ol>
      </div>
      <PlayButton
        label={t('music:play')}
        playing={playing}
        onClick={() =>
          playback.toggle(progression.id, () =>
            walkSounds(voiceLead(chords), { arpeggio: false, tempo: ROW_TEMPO }),
          )
        }
        className="relative z-10 shrink-0"
      />
    </article>
  )
}
