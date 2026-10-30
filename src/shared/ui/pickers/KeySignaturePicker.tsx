import { useTranslation } from 'react-i18next'
import {
  keySignature,
  noteName,
  printedSymbol,
  signatureKey,
  writtenKey,
  type Key,
} from '@/shared/lib/music'
import { Button } from '../primitives/button'
import { Segmented } from '../Segmented'
import { PickerCell, PickerGrid } from './PickerGrid'
import { SignatureSigns } from './picker-pictures'

/** The signatures of one to seven sharps, and of one to seven flats. */
const SHARPS = [1, 2, 3, 4, 5, 6, 7] as const
const FLATS = [-1, -2, -3, -4, -5, -6, -7] as const

/**
 * A key signature chosen as notation apps choose it (ADR 0114, Flat's and Dorico's key sheets): Major ·
 * Minor, then one bordered grid of one to seven sharps over one to seven flats, each cell the signs
 * alone, named by its major and relative minor in its tooltip and to a screen reader, the one in force
 * tinted; Switch to natural under it. A cell keeps the mode. The score editor's key picker and a new
 * song's both are this one.
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
      tonic: printedSymbol(noteName(key.tonic)),
    })
  const count = keySignature(value)
  const signature = (each: number) => signatureKey(each, value.minor)
  const cell = (each: number) => (
    <PickerCell
      key={each}
      label={`${full(signatureKey(each, false))} / ${full(signatureKey(each, true))}`}
      pressed={each === count}
      onClick={() => (each === count ? undefined : onChange(signature(each)))}
    >
      <SignatureSigns count={each} />
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
        title={full(natural)}
        onClick={() => (count === 0 ? undefined : onChange(natural))}
      >
        {t('editor:signature.natural')}
      </Button>
    </>
  )
}
