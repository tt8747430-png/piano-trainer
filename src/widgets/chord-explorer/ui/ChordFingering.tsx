import { useTranslation } from 'react-i18next'
import { useFold } from '@/features/fold-section'
import { cn } from '@/shared/lib'
import { noteName, printedSymbol, type Hand } from '@/shared/lib/music'
import { FoldSection, HandDiagram, INVERSION_NAMES } from '@/shared/ui'
import type { FingeringRow } from '../model/chord-view'

/** The hands as the scale's fingering shows them, the left first. */
const HANDS = ['lh', 'rh'] as const satisfies readonly Hand[]

/**
 * The chord's fingering hand by hand, as Scales shows a scale's: each hand drawn with its fingers
 * numbered beside a table, a row an inversion (the one on the keys marked), or one row of the keys
 * as voiced, named for a screen reader only, each note over the finger on it. A hand that plays
 * nothing in a voicing has no card.
 */
export function ChordFingering({ rows }: { rows: readonly FingeringRow[] }) {
  const { t } = useTranslation(['practice', 'music'])
  const fold = useFold('chords.fingering')
  const hands = HANDS.filter((hand) => rows.some((row) => row.hands[hand].notes.length > 0))
  const rowName = (inversion: FingeringRow['inversion']) =>
    inversion === 'voiced'
      ? t('practice:chords.fingering.voiced')
      : t(`music:inversion.${INVERSION_NAMES[inversion] ?? 'root'}`)
  return (
    <FoldSection title={t('practice:chords.fingering.title')} fold={fold}>
      <ul className="grid-cards gap-2">
        {hands.map((hand) => (
          <li key={hand} className="flex flex-wrap items-center gap-x-4 gap-y-2 card p-4">
            <HandDiagram
              hand={hand}
              label={t('practice:scales.byHand.drawing', {
                hand: t(`practice:scales.byHand.${hand}`),
              })}
              className="h-24 w-auto shrink-0"
            />
            <div className="flex min-w-0 flex-col gap-2">
              <h3 className="text-lg">{t(`practice:scales.byHand.${hand}`)}</h3>
              <table className="w-max border-separate border-spacing-x-0.5 border-spacing-y-1 text-center tabular-nums">
                <caption className="sr-only">{t(`practice:scales.byHand.${hand}`)}</caption>
                <tbody>
                  {rows.map((row) => (
                    <tr
                      key={String(row.inversion)}
                      aria-current={row.current && rows.length > 1 ? 'true' : undefined}
                      className={cn(
                        row.current || rows.length === 1
                          ? 'text-foreground'
                          : 'text-muted-foreground',
                      )}
                    >
                      <th
                        scope="row"
                        className={cn(
                          'pr-3 text-left text-sm font-normal whitespace-nowrap',
                          rows.length === 1 && 'sr-only',
                          row.current && rows.length > 1 && 'font-semibold',
                        )}
                      >
                        {rowName(row.inversion)}
                      </th>
                      {row.hands[hand].notes.map((spelled, at) => (
                        <td key={at} className="min-w-6 align-bottom">
                          <span className="block text-sm text-muted-foreground">
                            {printedSymbol(noteName(spelled))}
                          </span>
                          <span className="block text-lg font-semibold">
                            {row.hands[hand].fingers[at]}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </li>
        ))}
      </ul>
    </FoldSection>
  )
}
