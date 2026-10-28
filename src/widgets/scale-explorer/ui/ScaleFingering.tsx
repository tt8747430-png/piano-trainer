import { useTranslation } from 'react-i18next'
import { useFold } from '@/features/fold-section'
import { noteName, type Finger, type Hand, type PlacedTone } from '@/shared/lib/music'
import { FoldSection, HandDiagram } from '@/shared/ui'

/** The run's notes going up, each hand's fingers on them. */
interface FingeredRun {
  readonly placed: readonly PlacedTone[]
  readonly fingers: Readonly<Record<Hand, readonly Finger[]>>
}

/** The hands as the reference app shows them, the left first. */
const HANDS = ['lh', 'rh'] as const satisfies readonly Hand[]

/**
 * The run's fingering hand by hand, as the reference app shows a scale's: each hand drawn with its
 * fingers numbered, beside the run's notes going up with that hand's finger under each.
 */
export function ScaleFingering({ run }: { run: FingeredRun }) {
  const { t } = useTranslation('practice')
  const fold = useFold('scales.fingering')
  return (
    <FoldSection title={t('scales.byHand.title')} fold={fold}>
      <ul className="grid-cards gap-2">
        {HANDS.map((hand) => (
          <li key={hand} className="flex flex-wrap items-center gap-x-4 gap-y-2 card p-4">
            <HandDiagram
              hand={hand}
              label={t('scales.byHand.drawing', { hand: t(`scales.byHand.${hand}`) })}
              className="h-24 w-auto shrink-0"
            />
            <div className="flex min-w-0 flex-col gap-2">
              <h3 className="text-lg">{t(`scales.byHand.${hand}`)}</h3>
              <table className="w-max border-separate border-spacing-x-0.5 text-center tabular-nums">
                <caption className="sr-only">{t(`scales.byHand.${hand}`)}</caption>
                <tbody>
                  <tr className="text-sm text-muted-foreground">
                    <th scope="row" className="sr-only">
                      {t('scales.byHand.notes')}
                    </th>
                    {run.placed.map((placed, at) => (
                      <td key={at} className="min-w-4.5">
                        {noteName(placed.tone.note)}
                      </td>
                    ))}
                  </tr>
                  <tr className="text-lg font-semibold">
                    <th scope="row" className="sr-only">
                      {t('scales.byHand.fingers')}
                    </th>
                    {run.fingers[hand].map((finger, at) => (
                      <td key={at}>{finger}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </li>
        ))}
      </ul>
    </FoldSection>
  )
}
