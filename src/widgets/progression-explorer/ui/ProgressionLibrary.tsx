import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useFold } from '@/features/fold-section'
import {
  LIBRARY_BY_STYLE,
  libraryParam,
  progressionMode,
  type LibraryProgression,
} from '@/entities/progression-library'
import { localText, useLocale } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import {
  chordSymbol,
  numeralChord,
  numeralText,
  parseNumerals,
  voiceLead,
  writtenKey,
  type ChordSize,
  type Key,
} from '@/shared/lib/music'
import { walkSounds } from '@/shared/lib/schedule'
import { usePlayback, usePlayhead } from '@/shared/lib/services'
import { ChordText, FoldSection, PlayButton } from '@/shared/ui'

type Playback = ReturnType<typeof usePlayback<string>>

/** How fast a card plays its progression: a chord each two beats, as the page's row. */
const CARD_TEMPO = 84
const BEATS_A_CHORD = 2

/** A card's chords in the key shown: each numeral over the chord it is there. */
interface CardChord {
  readonly numeral: string
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
 * at the top of the page. The one shown is marked.
 */
export function ProgressionLibrary({
  musicKey,
  size,
  shown,
  onChoose,
}: {
  musicKey: Key
  size: ChordSize
  /** The library's progression the page shows, if it shows one. */
  shown: string | undefined
  onChoose: (progression: LibraryProgression) => void
}) {
  const { t } = useTranslation('practice')
  const fold = useFold('progressions.library')
  const playback = usePlayback<string>()
  return (
    <FoldSection title={t('progressions.library')} fold={fold} className="flex flex-col gap-6">
      {LIBRARY_BY_STYLE.map(({ style, progressions }) => (
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
  shown,
  playback,
  onChoose,
}: {
  progression: LibraryProgression
  musicKey: Key
  size: ChordSize
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
  const row: readonly CardChord[] = numerals.map((numeral, at) => ({
    numeral: numeralText(numeral),
    symbol: chords[at] ? chordSymbol(chords[at]) : '',
  }))
  const onsets = useMemo(
    () => chords.map((_, at) => (at * BEATS_A_CHORD * 60) / CARD_TEMPO),
    [chords],
  )
  const playing = playback.playing === progression.id
  const sounding = usePlayhead(playing ? playback.handle : null, onsets)
  const name = localText(progression.name, locale)
  const line = row.map((chord) => chord.numeral).join(' – ')
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
            <span className="text-xs text-muted-foreground">{chord.numeral}</span>
            <ChordText symbol={chord.symbol} />
          </li>
        ))}
      </ol>
    </article>
  )
}
