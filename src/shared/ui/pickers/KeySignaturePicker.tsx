import { useTranslation } from 'react-i18next'
import { keySignature, signatureKey, writtenKey, type Key, printedNote } from '@/shared/lib/music'
import { Segmented } from '../Segmented'
import { PickerCell } from './PickerGrid'
import { SignatureSigns } from './picker-pictures'

/**
 * The fifteen key signatures in Flat's reading order (A34): none first (C major, A minor), then one to
 * seven sharps, then one to seven flats.
 */
const SIGNATURES = [0, 1, 2, 3, 4, 5, 6, 7, -1, -2, -3, -4, -5, -6, -7] as const

/**
 * A key signature chosen as Flat and Dorico choose it (A34, ADR 0114): Major · Minor, then one grid of
 * the fifteen signatures, each drawn on a short staff and named under it by its major and its
 * relative minor (E♭ / Cm), the one in force tinted. Fifteen cells end their rows cleanly at three
 * across on the narrowest phone and five from 380px. The mode is the one written to the score: a cell
 * takes its signature's key in it, and Major · Minor changes the mode on the same tonic (C major to C minor). The
 * score editor's key, a new song's and every Practice page's (`KeyPicker`) are this one. Every tap
 * reports its key, the one in force too (a picker closes on it); the caller skips a key it already has.
 */
export function KeySignaturePicker({
  value,
  onChange,
}: {
  value: Key
  onChange: (key: Key) => void
}) {
  const { t } = useTranslation(['editor', 'music'])
  const count = keySignature(value)
  const cell = (each: number) => {
    const major = signatureKey(each, false)
    const minor = signatureKey(each, true)
    const label = `${t('music:key.major', { tonic: printedNote(major.tonic) })} / ${t(
      'music:key.minor',
      { tonic: printedNote(minor.tonic) },
    )}`
    return (
      <PickerCell
        key={each}
        label={label}
        pressed={each === count}
        onClick={() => onChange(value.minor ? minor : major)}
      >
        <span className="flex flex-col items-center gap-0.5 py-1" aria-hidden>
          <SignatureSigns count={each} />
          <span className="text-sm leading-none whitespace-nowrap">
            <span className={value.minor ? undefined : 'font-semibold'}>
              {printedNote(major.tonic)}
            </span>
            <span className="text-muted-foreground"> / </span>
            <span className={value.minor ? 'font-semibold' : undefined}>
              {printedNote(minor.tonic)}m
            </span>
          </span>
        </span>
      </PickerCell>
    )
  }
  return (
    <>
      {/* The mode written to the score, on the same tonic: C major to C minor. */}
      <Segmented
        label={t('music:key.mode')}
        value={value.minor ? 'minor' : 'major'}
        options={(['major', 'minor'] as const).map((mode) => ({
          value: mode,
          label: t(`music:key.${mode}Mode`),
        }))}
        onChange={(mode) => onChange(writtenKey({ tonic: value.tonic, minor: mode === 'minor' }))}
      />
      <div
        role="group"
        aria-label={t('music:key.label')}
        className="grid grid-cols-3 gap-px overflow-hidden rounded-control border border-hairline bg-hairline min-[380px]:grid-cols-5"
      >
        {SIGNATURES.map(cell)}
      </div>
    </>
  )
}
