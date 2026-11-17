import { Link, useSearch } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useKeyName } from '@/shared/i18n'
import { useSetSearch } from '@/shared/lib'
import {
  keyFromParam,
  keyParam,
  keyScale,
  keySignature,
  midi,
  note,
  noteName,
  noteParam,
  pitchClassOf,
  printedSymbol,
  relativeKey,
  scaleChords,
  type Key,
  type KeyParam,
} from '@/shared/lib/music'
import { chordSounds, walkSounds } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'
import { FloatingPieceLink, ScaleIcon } from '@/shared/ui'
import { ToolPage } from '@/widgets/tool-page'
import { KeyWheel } from './KeyWheel'

/** What the Circle of fifths shows: the key tapped, C major until one is. */
export interface CircleView {
  readonly key?: KeyParam
}

const C_MAJOR: Key = { tonic: note('C'), minor: false }
/** The key's chords walked through at a calm pace, two beats each. */
const WALK_TEMPO = 96
const WALK = 'walk'

/** A key's seven triads, each to play: its symbol, its numeral, and its keys from the root up near middle C. */
function keyChords(key: Key) {
  return scaleChords(key.tonic, keyScale(key), 3).map((chord) => {
    const root = 48 + pitchClassOf(chord.root)
    return {
      symbol: `${noteName(chord.root)}${chord.suffix}`,
      numeral: chord.roman,
      keys: chord.tones.map((tone) => midi(root + tone.semitones)),
    }
  })
}

/**
 * The Circle of fifths (canvas 182), a tool of its own and never a key picker: the wheel large,
 * majors outside and their relative minors inside, a tap choosing the key. Under it on a phone and
 * beside it on a laptop, the key's name, its signature and relative key, and its seven chords as
 * tiles that play; at the foot Play the chords walks them, and Scales opens the key in Scales and
 * keys. The key chosen is the page's link (`?key=`).
 */
export function CircleOfFifthsPage() {
  const { t } = useTranslation(['practice', 'music'])
  const name = useKeyName()
  const view = useSearch({ from: '/shell/practice/circle-of-fifths' })
  const change = useSetSearch<CircleView>()
  const playback = usePlayback<string>()
  const key = view.key ? keyFromParam(view.key) : C_MAJOR
  const title = t('practice:pages.circleOfFifths')
  const count = keySignature(key)
  const signature =
    count === 0
      ? t('practice:tools.circle.noAccidentals')
      : count > 0
        ? t('practice:tools.circle.sharps', { count })
        : t('practice:tools.circle.flats', { count: -count })
  const chords = keyChords(key)
  return (
    <ToolPage
      title={title}
      centred
      play={{
        label: t('practice:tools.circle.playAll'),
        playing: playback.playing === WALK,
        onToggle: () =>
          playback.toggle(WALK, () =>
            walkSounds(
              chords.map((chord) => chord.keys),
              { arpeggio: false, tempo: WALK_TEMPO },
            ),
          ),
      }}
      after={
        <FloatingPieceLink
          label={t('practice:tools.circle.open')}
          caption={t('practice:tools.circle.openShort')}
          render={
            <Link
              to="/practice/scales"
              search={{
                root: noteParam(key.tonic),
                kind: key.minor ? 'natural' : 'major',
              }}
            />
          }
        >
          <ScaleIcon aria-hidden />
        </FloatingPieceLink>
      }
      side={
        <section aria-label={name(key)} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <h2 className="font-display text-[2.25rem] leading-[1.1] font-bold tracking-[-0.02em] text-balance">
              {name(key)}
            </h2>
            <p className="ms-0.5 text-[0.9375rem] text-pretty text-muted-foreground">
              {t('practice:tools.circle.about', { signature, key: name(relativeKey(key)) })}
            </p>
          </div>
          <section aria-labelledby="key-chords" className="flex flex-col gap-2">
            <h3 id="key-chords" className="ms-1 font-sans text-sm font-semibold">
              {t('practice:tools.circle.chords')}
            </h3>
            <div className="grid grid-cols-7 gap-1">
              {chords.map((chord) => (
                <button
                  key={chord.symbol}
                  type="button"
                  aria-pressed={playback.playing === chord.symbol}
                  aria-label={t('practice:tools.circle.play', {
                    chord: printedSymbol(chord.symbol),
                  })}
                  onClick={() =>
                    playback.toggle(chord.symbol, () =>
                      chordSounds(chord.keys, { arpeggio: false }),
                    )
                  }
                  className="flex h-16 min-w-0 flex-col items-center justify-center gap-px rounded-[10px] bg-card ring-1 ring-border transition-colors hover:bg-muted aria-pressed:bg-foreground aria-pressed:text-background focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  <span className="max-w-full truncate text-base font-bold">
                    {printedSymbol(chord.symbol)}
                  </span>
                  <span className="font-display text-[0.8125rem] text-muted-foreground in-aria-pressed:text-background/70">
                    {printedSymbol(chord.numeral)}
                  </span>
                </button>
              ))}
            </div>
          </section>
        </section>
      }
    >
      <KeyWheel
        label={t('practice:tools.circle.label')}
        value={key}
        onChoose={(chosen) => change({ key: keyParam(chosen) })}
      />
      <p className="sr-only">{t('practice:tools.circle.majors')}</p>
    </ToolPage>
  )
}
