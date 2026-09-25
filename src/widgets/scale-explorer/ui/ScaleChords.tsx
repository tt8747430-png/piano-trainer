import { useTranslation } from 'react-i18next'
import { chordSymbol, diatonicChords, type Tone } from '@/shared/lib/music'
import { usePlayChord } from '@/shared/lib/services'
import { Segmented } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'

/** Triads or 7th chords, with the name each has on screen. */
const SIZES = [
  { value: 3, name: 'triads' },
  { value: 4, name: 'sevenths' },
] as const

/** The triads or 7th chords on each degree, with Roman numerals; a tap sounds one. */
export function ScaleChords({
  scale,
  size,
  onSize,
}: {
  scale: readonly Tone[]
  size: 3 | 4
  onSize: (size: 3 | 4) => void
}) {
  const { t } = useTranslation('theory')
  const playChord = usePlayChord()
  const chords = diatonicChords(scale, size)
  if (chords.length === 0) return null
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-xl font-bold">{t('chordsIn')}</h3>
      <Segmented
        label={t('chordsIn')}
        value={size}
        options={SIZES.map(({ value, name }) => ({ value, label: t(`chordSize.${name}`) }))}
        onChange={onSize}
      />
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
        {chords.map(({ roman, chord }) => (
          <Button
            key={roman}
            variant="outline"
            className="h-16 flex-col gap-0"
            onClick={() => playChord(chord)}
          >
            <span className="text-lg font-bold">{chordSymbol(chord)}</span>
            <span className="text-sm text-muted-foreground">{roman}</span>
          </Button>
        ))}
      </div>
    </section>
  )
}
