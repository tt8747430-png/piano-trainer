import { Square } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { lastInversion, type PlacedScaleChord } from '@/shared/lib/music'
import { chordSounds, walkSounds } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'
import { ChordButton, Segmented } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import type { KeyView } from '../model/key-view'

const SIZES = [
  { value: 3, name: 'triads' },
  { value: 4, name: 'sevenths' },
] as const
const INVERSION_NAMES = ['root', 'first', 'second', 'third'] as const
/** Play walks the key's chords at the Scales reference's own tempo. */
const WALK_TEMPO = 80

/** Chords to tap in a grid, each pressed while it sounds. */
function ChordGrid({
  chords,
  id,
  playing,
  onTap,
}: {
  chords: readonly PlacedScaleChord[]
  id: string
  playing: string | null
  onTap: (id: string, chord: PlacedScaleChord) => void
}) {
  return (
    <div className="grid grid-cols-4 gap-2 sm:grid-cols-7 lg:grid-cols-4">
      {chords.map((placed, i) => (
        <ChordButton
          key={`${id}${i}`}
          symbol={placed.symbol}
          numeral={placed.numeral}
          playing={playing === `${id}${i}`}
          onClick={() => onTap(`${id}${i}`, placed)}
        />
      ))}
    </div>
  )
}

/** A key's chords to tap in a size and an inversion, the ones it borrows most, and Play, which walks its seven up and down. */
export function KeyChordsSection({
  view,
  chords,
  borrowed,
  walk,
  onChange,
}: {
  view: KeyView
  chords: readonly PlacedScaleChord[]
  borrowed: readonly PlacedScaleChord[]
  walk: readonly PlacedScaleChord[]
  onChange: (change: Partial<KeyView>) => void
}) {
  const { t } = useTranslation(['learn', 'music', 'common'])
  const playback = usePlayback<string>()
  const tap = (id: string, placed: PlacedScaleChord) =>
    playback.toggle(
      id,
      chordSounds(
        placed.tones.map((tone) => tone.midi),
        { arpeggio: false },
      ),
    )
  const walkThem = () =>
    playback.toggle(
      'walk',
      walkSounds(
        walk.map((placed) => placed.tones.map((tone) => tone.midi)),
        { arpeggio: false, tempo: WALK_TEMPO },
      ),
    )
  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-4">
        <h3 className="text-2xl">{t('learn:keys.chords')}</h3>
        <Segmented
          label={t('learn:chordSize.label')}
          value={view.chords}
          options={SIZES.map(({ value, name }) => ({ value, label: t(`learn:chordSize.${name}`) }))}
          onChange={(chords) =>
            onChange({ chords, inversion: Math.min(view.inversion, lastInversion(chords)) })
          }
        />
        <Segmented
          label={t('learn:inversionLabel')}
          value={view.inversion}
          options={INVERSION_NAMES.slice(0, lastInversion(view.chords) + 1).map((name, value) => ({
            value,
            label: t(`music:inversion.${name}`),
          }))}
          onChange={(inversion) => onChange({ inversion })}
        />
        <ChordGrid chords={chords} id="d" playing={playback.playing} onTap={tap} />
      </section>
      <section className="flex flex-col gap-4">
        <h3 className="text-2xl">{t('learn:keys.borrowed')}</h3>
        <ChordGrid chords={borrowed} id="b" playing={playback.playing} onTap={tap} />
      </section>
      <Button size="pill" onClick={walkThem}>
        {playback.playing === 'walk' ? (
          <>
            <Square data-icon="inline-start" />
            {t('common:stop')}
          </>
        ) : (
          t('learn:keys.play')
        )}
      </Button>
    </div>
  )
}
