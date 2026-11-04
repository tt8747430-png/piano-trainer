import { useTranslation } from 'react-i18next'
import { useFold } from '@/features/fold-section'
import {
  fingerCrossings,
  handPositions,
  type Finger,
  type Hand,
  type PlacedTone,
  printedNote,
} from '@/shared/lib/music'
import { FoldSection, HandCard } from '@/shared/ui'

/** The run's notes going up, each hand's fingers on them. */
interface FingeredRun {
  readonly placed: readonly PlacedTone[]
  readonly fingers: Readonly<Record<Hand, readonly Finger[]>>
}

/** The hands as the reference app shows them, the left first. */
const HANDS = ['lh', 'rh'] as const satisfies readonly Hand[]

/**
 * The run's fingering hand by hand, as the reference app shows a scale's: each hand drawn with its
 * fingers numbered, beside the run's notes going up with that hand's finger under each, a crossing's
 * (`fingerCrossings`) in the link's sky and underlined. A scale the books leave unfingered says so in
 * its ⓘ.
 */
export function ScaleFingering({ run, standard }: { run: FingeredRun; standard: boolean }) {
  const { t } = useTranslation('practice')
  const fold = useFold('scales.fingering')
  const keys = run.placed.map((placed) => placed.midi)
  const crossings = {
    lh: fingerCrossings(keys, run.fingers.lh, 'lh'),
    rh: fingerCrossings(keys, run.fingers.rh, 'rh'),
  }
  return (
    <FoldSection
      title={t('scales.byHand.title')}
      fold={fold}
      info={
        <>
          <p>{t('scales.byHand.crossings')}</p>
          {standard ? null : <p className="mt-2">{t('scales.byHand.noStandard')}</p>}
        </>
      }
    >
      <ul className="grid-cards gap-2">
        {HANDS.map((hand) => (
          <li key={hand} className="flex flex-col gap-3 card p-4">
            <h3 className="text-lg">{t(`scales.byHand.${hand}`)}</h3>
            {/* The hand drawn over each of its positions in turn (R29-P5): a new one where it crosses. */}
            <div className="flex gap-3 overflow-x-auto overscroll-x-contain scrollbar-none">
              {handPositions(keys, run.fingers[hand], hand).map((position, at) => (
                <HandCard
                  key={at}
                  hand={hand}
                  notes={position}
                  className="h-28 w-auto shrink-0"
                  label={t('chords.fingering.drawn', {
                    hand: t(`scales.byHand.${hand}`),
                    notes: position
                      .map(({ key, finger }) => {
                        const tone = run.placed.find((placed) => placed.midi === key)?.tone
                        return `${tone ? printedNote(tone.note) : ''} ${finger}`
                      })
                      .join(', '),
                  })}
                />
              ))}
            </div>
            <div className="flex max-w-full min-w-0 flex-col gap-2">
              {/* Two octaves run wider than a narrow phone: the notes scroll, the card stays put. */}
              <div className="overflow-x-auto overscroll-x-contain scrollbar-none">
                <table className="w-max border-separate border-spacing-x-0.5 text-center tabular-nums">
                  <caption className="sr-only">{t(`scales.byHand.${hand}`)}</caption>
                  <tbody>
                    <tr className="text-sm text-muted-foreground">
                      <th scope="row" className="sr-only">
                        {t('scales.byHand.notes')}
                      </th>
                      {run.placed.map((placed, at) => (
                        <td key={at} className="min-w-4.5">
                          {printedNote(placed.tone.note)}
                        </td>
                      ))}
                    </tr>
                    <tr className="text-lg font-semibold">
                      <th scope="row" className="sr-only">
                        {t('scales.byHand.fingers')}
                      </th>
                      {run.fingers[hand].map((finger, at) => (
                        <td
                          key={at}
                          className={
                            crossings[hand][at]
                              ? 'text-link underline decoration-2 underline-offset-4'
                              : undefined
                          }
                        >
                          {finger}
                          {crossings[hand][at] ? (
                            <span className="sr-only"> ({t('scales.byHand.crossing')})</span>
                          ) : null}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </FoldSection>
  )
}
