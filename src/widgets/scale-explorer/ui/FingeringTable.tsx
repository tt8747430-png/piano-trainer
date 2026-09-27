import { useTranslation } from 'react-i18next'
import type { Finger } from '@/shared/lib/music'

/** Note, RH and LH fingers for the run's octave. */
export function FingeringTable({
  notes,
  rh,
  lh,
}: {
  notes: readonly string[]
  rh: readonly Finger[]
  lh: readonly Finger[]
}) {
  const { t } = useTranslation('learn')
  const row = (label: string, cells: readonly (string | number)[]) => (
    <tr>
      <th scope="row" className="pr-3 text-left text-sm font-semibold text-muted-foreground">
        {label}
      </th>
      {cells.map((cell, i) => (
        <td key={i} className="py-1 text-center font-semibold tabular-nums">
          {cell}
        </td>
      ))}
    </tr>
  )
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <tbody>
          {row(t('fingering.note'), notes)}
          {row(t('fingering.rh'), rh)}
          {row(t('fingering.lh'), lh)}
        </tbody>
      </table>
    </div>
  )
}
