import { useTranslation } from 'react-i18next'
import { keySignature, signatureKey, writtenKey, type Key, printedNote } from '@/shared/lib/music'
import { Button } from '../primitives/button'
import { Segmented } from '../Segmented'
import { PickerCell, PickerGrid } from './PickerGrid'
import { SignatureSigns } from './picker-pictures'

/** The signatures of one to seven sharps, and of one to seven flats. */
const SHARPS = [1, 2, 3, 4, 5, 6, 7] as const
const FLATS = [-1, -2, -3, -4, -5, -6, -7] as const

/**
 * A key signature chosen as notation apps choose it (ADR 0114, Flat's and Dorico's key sheets; R29-P2,
 * Decided 22): Major · Minor, then one bordered grid of one to seven sharps over one to seven flats,
 * each cell the signs with its key's tonic under them in the mode chosen (one name per key: D♭ is 5♭,
 * C♯ 7♯), the one in force tinted; No sharps or flats under it. A cell keeps the mode. The score
 * editor's key, a new song's and every Practice page's (`KeyPicker`) are this one. Every tap reports its
 * key, the one in force too (a picker closes on it); the caller skips a key it already has.
 */
export function KeySignaturePicker({
  value,
  onChange,
}: {
  value: Key
  onChange: (key: Key) => void
}) {
  const { t } = useTranslation(['editor', 'music'])
  const full = (key: Key) =>
    t(key.minor ? 'music:key.minor' : 'music:key.major', {
      tonic: printedNote(key.tonic),
    })
  const tonicName = (key: Key) => `${printedNote(key.tonic)}${key.minor ? 'm' : ''}`
  const count = keySignature(value)
  const signature = (each: number) => signatureKey(each, value.minor)
  const cell = (each: number) => (
    <PickerCell
      key={each}
      label={full(signature(each))}
      pressed={each === count}
      onClick={() => onChange(signature(each))}
    >
      <span className="flex flex-col items-center" aria-hidden>
        <SignatureSigns count={each} />
        <span className="text-sm leading-none font-semibold">{tonicName(signature(each))}</span>
      </span>
    </PickerCell>
  )
  const natural = signature(0)
  return (
    <>
      {/* Which key each signature is: the mode, its other one a tap away (C major to C minor). */}
      <Segmented
        label={t('music:key.mode')}
        value={value.minor ? 'minor' : 'major'}
        options={(['major', 'minor'] as const).map((mode) => ({
          value: mode,
          label: t(`music:key.${mode}Mode`),
        }))}
        onChange={(mode) => onChange(writtenKey({ tonic: value.tonic, minor: mode === 'minor' }))}
      />
      <PickerGrid
        label={t('music:key.label')}
        rows={[
          { label: t('editor:signature.sharps'), cells: SHARPS.map(cell) },
          { label: t('editor:signature.flats'), cells: FLATS.map(cell) },
        ]}
      />
      <Button
        variant="link"
        className="h-11 justify-start self-start px-0 text-base text-link"
        aria-pressed={count === 0}
        onClick={() => onChange(natural)}
      >
        {t('editor:signature.natural')} · {full(natural)}
      </Button>
    </>
  )
}
