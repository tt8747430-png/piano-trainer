import { useTranslation } from 'react-i18next'
import { ScaleChordGrid } from '@/features/play-example'
import { fitInversion, STACK_SIZES, type PlacedScaleChord } from '@/shared/lib/music'
import { walkSounds } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'
import { InversionChoice, PlayLabel, Segmented } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import type { KeyView } from '../model/key-view'

/** A key's chords are its triads or its 7th chords. */
const SIZES = [3, 4] as const
/** Play walks the key's chords at the Scales reference's own tempo. */
const WALK_TEMPO = 80

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
  const { t } = useTranslation(['learn', 'music'])
  const playback = usePlayback<string>()
  const walkThem = () =>
    playback.toggle('walk', () =>
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
          label={t('music:chordSize.label')}
          value={view.chords}
          options={SIZES.map((notes) => ({
            value: notes,
            label: t(`music:chordSize.${STACK_SIZES[notes]}`),
          }))}
          onChange={(chords) =>
            onChange({ chords, inversion: fitInversion(view.inversion, chords) })
          }
        />
        <InversionChoice
          notes={view.chords}
          value={view.inversion}
          onChange={(inversion) => onChange({ inversion })}
        />
        <ScaleChordGrid chords={chords} />
      </section>
      <section className="flex flex-col gap-4">
        <h3 className="text-2xl">{t('learn:keys.borrowed')}</h3>
        <ScaleChordGrid chords={borrowed} />
      </section>
      <Button size="pill" onClick={walkThem}>
        <PlayLabel playing={playback.playing === 'walk'}>{t('learn:keys.play')}</PlayLabel>
      </Button>
    </div>
  )
}
