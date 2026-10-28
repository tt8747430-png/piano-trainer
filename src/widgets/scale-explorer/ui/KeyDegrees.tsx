import { useTranslation } from 'react-i18next'
import { circleFunctions, degreeNames, noteName, printedSymbol, type Key } from '@/shared/lib/music'
import { ChordText } from '@/shared/ui'

/**
 * A key's seven degrees as a table, as the reference's circle lists a key's chords: each numeral, the
 * degree's name (tonic … leading tone, a minor key's subtonic), its note and the triad on it.
 */
export function KeyDegrees({ value }: { value: Key }) {
  const { t } = useTranslation('music')
  const names = degreeNames(value.minor)
  const label = t('degree.label')
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-2xl">{label}</h3>
      <table aria-label={label} className="w-full max-w-md text-left">
        <tbody>
          {circleFunctions(value).map((chord, degree) => (
            <tr key={chord.numeral} className="border-b border-border last:border-b-0">
              <td className="w-14 py-1.5 font-semibold text-muted-foreground">{chord.numeral}</td>
              <td className="py-1.5">{t(`degree.${names[degree] ?? 'tonic'}`)}</td>
              <td className="w-12 py-1.5 font-semibold">{printedSymbol(noteName(chord.root))}</td>
              <td className="w-16 py-1.5">
                <ChordText symbol={chord.symbol} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
