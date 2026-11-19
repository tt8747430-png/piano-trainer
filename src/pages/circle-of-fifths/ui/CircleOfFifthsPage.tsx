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
  scaleChords,
  type Key,
  type KeyParam,
} from '@/shared/lib/music'
import { walkSounds } from '@/shared/lib/schedule'
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
 * The Circle of fifths (canvas 182, its board r67), a tool of its own and never a key picker: the
 * wheel large and the page's one focus, majors outside and their relative minors inside, a tap
 * choosing the key, its name and signature in the wheel's centre. The wheel lights the relative minor
 * and the key's chords, so no line or tiles say them again; Play the chords walks them, and Scales
 * opens the key in Scales and keys, which holds the chords with their keys drawn. The key chosen is
 * the page's link (`?key=`).
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
    >
      <KeyWheel
        label={t('practice:tools.circle.label')}
        value={key}
        onChoose={(chosen) => change({ key: keyParam(chosen) })}
      >
        <h2
          aria-live="polite"
          className="max-w-[27cqw] font-display text-[1.375rem] leading-[1.05] font-bold tracking-[-0.01em] text-balance lg:text-[2.25rem]"
        >
          {name(key)}
        </h2>
        <p className="text-[0.8125rem] leading-[normal] text-muted-foreground lg:text-[0.9375rem]">
          {signature}
        </p>
      </KeyWheel>
      <p className="sr-only">{t('practice:tools.circle.majors')}</p>
    </ToolPage>
  )
}
