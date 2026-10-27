import { useTranslation } from 'react-i18next'
import type { PieceInversionChoice } from '@/features/choose-diagram-inversion'
import type { DiagramChord } from '@/features/practice'
import { isInversion } from '@/shared/lib/music'
import { InversionChoice, Labelled } from '@/shared/ui'

/**
 * The inversion a piece's chord is drawn in, on its sheet (ADR 0108): Root · 1st · 2nd (· 3rd),
 * kept for that chord in that piece; an inversion that does not fit the keys greyed, saying so. A
 * slash chord, which stands over its bass, and a chord of five notes or more, never inverted, have
 * the choice greyed with why, none chosen.
 */
export function DiagramInversionField({
  chord,
  choose,
}: {
  chord: DiagramChord
  choose: PieceInversionChoice['choose']
}) {
  const { t } = useTranslation('music')
  const { inversions } = chord
  const free = inversions.kind === 'free' ? inversions : null
  return (
    <Labelled label={t('inversion.label')} info={t('chordSheet.inversionInfo')}>
      <InversionChoice
        notes={inversions.notes}
        value={free?.drawn ?? null}
        greyed={(inversion) =>
          !free
            ? t(`chordSheet.drawnOneWay.${inversions.kind === 'slash' ? 'slash' : 'large'}`)
            : free.fitting.some((each) => each === inversion)
              ? undefined
              : t('chordSheet.offKeys')
        }
        onChange={(inversion) => {
          if (free && isInversion(inversion))
            choose(chord.symbol, { chosen: inversion, folded: free.folded })
        }}
      />
    </Labelled>
  )
}
