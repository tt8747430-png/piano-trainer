import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useFold } from '@/features/fold-section'
import {
  libraryByStyle,
  libraryParam,
  progressionMode,
  type LibraryProgression,
} from '@/entities/progression-library'
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
import { ChordText, FoldSection, PlayButton } from '@/shared/ui'
import type { ProgressionNames } from '../model/progressions-view'

type Playback = ReturnType<typeof usePlayback<string>>

/** How fast a card plays its progression: a chord each two beats, as the page's row. */
const CARD_TEMPO = 84
const BEATS_A_CHORD = 2

/** A card's chords in the key shown: each numeral (or Nashville number) over the chord it is there. */
interface CardChord {
  readonly numeral: string | undefined
  readonly symbol: string
}

/**
 * The key a progression is shown in on its card: the key chosen, or, for a progression with no line
 * in that key's mode, the key of the same tonic in the mode it has.
 */
const cardKey = (progression: LibraryProgression, key: Key): Key => {
  const minor = progressionMode(progression, key.minor)
  return minor === key.minor ? key : writtenKey({ tonic: key.tonic, minor })
}

/**
 * The library as cards (ADR 0112), style by style, as the reference app lists its progressions: each
 * card titled by its numerals, its name and chord count, how it sounds in a line, and a chip a chord
 * (the numeral over the chord in the key chosen), so the key and Major · Minor above re-spell every
 * card. Its Play plays it there and then, the sounding chord's chip lit; a tap anywhere else opens it
 * at the top of the page. The one shown is marked. Its chords are named as the page's row names them:
 * by numerals, Nashville numbers, or the chords alone.
 */
export function ProgressionLibrary({
  musicKey,
  size,
  names,
  shown,
  onChoose,
}: {
  musicKey: Key
  size: ChordSize
  names: ProgressionNames
  /** The library's progression the page shows, if it shows one. */
  shown: string | undefined
  onChoose: (progression: LibraryProgression) => void
}) {
  const { t } = useTranslation('practice')
  const fold = useFold('progressions.library')
  const playback = usePlayback<string>()
  return (
    <FoldSection title={t('progressions.library')} fold={fold} className="flex flex-col gap-6">
      {libraryByStyle().map(({ style, progressions }) => (
        <section
          key={style}
          aria-label={t(`progressions.style.${style}`)}
          className="flex flex-col gap-3"
        >
          <h3 className="text-xl">{t(`progressions.style.${style}`)}</h3>
          <ul className="grid-cards gap-2">
            {progressions.map((progression) => (
              <li key={progression.id}>
                <ProgressionCard
                  progression={progression}
                  musicKey={cardKey(progression, musicKey)}
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
    </FoldSection>
  )
}

function ProgressionCard({
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
  const row: readonly CardChord[] = numerals.map((numeral, at) => {
    const chord = chords[at]
    return {
      numeral:
        names === 'numerals'
          ? numeralText(numeral)
          : names === 'nashville' && chord
            ? nashvilleNumber(chord, musicKey)
            : undefined,
      symbol: chord ? chordSymbol(chord) : '',
    }
  })
  const onsets = useMemo(
    () => chords.map((_, at) => (at * BEATS_A_CHORD * 60) / CARD_TEMPO),
    [chords],
  )
  const playing = playback.playing === progression.id
  const sounding = usePlayhead(playing ? playback.handle : null, onsets)
  const name = localText(progression.name, locale)
  const line = row.map((chord) => chord.numeral ?? printedSymbol(chord.symbol)).join(' – ')
  return (
    <article
      aria-label={name}
      aria-current={shown || undefined}
      className={cn(
        'card relative flex h-full flex-col gap-3 p-4 transition-colors',
        shown && 'border-foreground/40',
        playing && 'border-primary',
      )}
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={onChoose}
          className="flex min-w-0 flex-1 flex-col items-start gap-0.5 text-left after:absolute after:inset-0 after:rounded-3xl after:content-['']"
        >
          <span className="text-lg font-semibold wrap-anywhere">{line}</span>
          <span className="text-sm text-muted-foreground">
            {[name, t('practice:progressions.chordCount', { count: row.length })].join(' · ')}
          </span>
        </button>
        <PlayButton
          label={t('music:play')}
          playing={playing}
          onClick={() =>
            playback.toggle(progression.id, () =>
              walkSounds(voiceLead(chords), { arpeggio: false, tempo: CARD_TEMPO }),
            )
          }
          className="relative z-10 size-12"
        />
      </div>
      <p className="text-muted-foreground">{localText(progression.character, locale)}</p>
      <ol className="flex flex-wrap gap-1.5" aria-label={t('practice:progressions.chordsIn')}>
        {row.map((chord, at) => (
          <li
            key={at}
            aria-current={sounding === at || undefined}
            className={cn(
              'flex min-w-11 flex-col items-center rounded-xl bg-muted px-2 py-1 leading-tight transition-colors duration-150',
              sounding === at && 'bg-selected text-selected-foreground',
            )}
          >
            {chord.numeral === undefined ? null : (
              <span className="text-xs text-muted-foreground">{chord.numeral}</span>
            )}
            <ChordText symbol={chord.symbol} />
          </li>
        ))}
      </ol>
    </article>
  )
}
