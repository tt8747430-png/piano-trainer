import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { keySignature, signatureKey, writtenKey, type Key } from '@/shared/lib/music'
import { Segmented, SwitchRow } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { useScoreEditorContext } from '../model/editor-context'
import { useKeyAt, useKeyNames } from '../model/use-key-at'
import { useSignatureFrom } from '../model/use-signature-from'
import { PickerCell, PickerGrid } from './PickerGrid'
import { SignatureSigns } from './picker-pictures'

/** The signatures of one to seven sharps, and of one to seven flats. */
const SHARPS = [1, 2, 3, 4, 5, 6, 7] as const
const FLATS = [-1, -2, -3, -4, -5, -6, -7] as const

/**
 * The key signature picker (ADR 0089, 0094, 0114, after notation apps' key sheets): one bordered grid
 * of one to seven sharps over one to seven flats, each cell the signs alone, named by its major and
 * relative minor in its tooltip and to a screen reader, the one in force tinted; Switch to natural
 * under it (no key signature, C major or A minor). A cell keeps the key's mode, so Major · Minor over
 * the grid says which key each one is: a minor song goes to the signature's minor key. In a section
 * after the first, the key changes from it on (as Flat changes key from a bar) unless "Change the key
 * for the whole song" is on: then the song's own key, its music moved with it, as at its head. In the
 * palette, the first bar chosen's section (else the caret's); over a key signature printed on the
 * sheet, its bar's (`bar`). A tap changes it.
 */
export function KeyPicker({ bar }: { bar?: number | undefined }) {
  const { t } = useTranslation(['editor', 'music'])
  const { actions } = useScoreEditorContext()
  const { from, song } = useSignatureFrom(bar)
  const [whole, setWhole] = useState(false)
  const names = useKeyNames()
  const key = useKeyAt(bar, song || whole)
  const count = keySignature(key)
  const choose = (next: Key) =>
    actions.dispatch(
      song || whole
        ? { type: 'settings', key: next }
        : { type: 'sectionKey', bar: from, key: next },
    )
  const signature = (each: number) =>
    key.minor ? signatureKey(each, true) : signatureKey(each, false)
  const cell = (each: number) => {
    const major = signatureKey(each, false)
    const minor = signatureKey(each, true)
    const label = `${names.full(major)} / ${names.full(minor)}`
    return (
      <PickerCell
        key={each}
        label={label}
        pressed={each === count}
        onClick={() => (each === count ? undefined : choose(signature(each)))}
      >
        <SignatureSigns count={each} />
      </PickerCell>
    )
  }
  const natural = signature(0)
  return (
    <>
      {/* Which key each signature is: the song's mode, its other one a tap away (C major to C minor). */}
      <Segmented
        label={t('music:key.mode')}
        value={key.minor ? 'minor' : 'major'}
        options={(['major', 'minor'] as const).map((mode) => ({
          value: mode,
          label: t(`music:key.${mode}Mode`),
        }))}
        onChange={(mode) => choose(writtenKey({ tonic: key.tonic, minor: mode === 'minor' }))}
      />
      <PickerGrid
        label={t('music:key.label')}
        rows={[
          { label: t('signature.sharps'), cells: SHARPS.map(cell) },
          { label: t('signature.flats'), cells: FLATS.map(cell) },
        ]}
      />
      <Button
        variant="link"
        className="h-11 justify-start self-start px-0 text-base text-link"
        aria-pressed={count === 0}
        title={names.full(natural)}
        onClick={() => (count === 0 ? undefined : choose(natural))}
      >
        {t('signature.natural')}
      </Button>
      {song ? null : (
        <SwitchRow
          label={t('signature.wholeSong')}
          info={t('signature.wholeSongInfo')}
          checked={whole}
          onCheckedChange={setWhole}
          className="min-h-12 border-b-0 py-0 text-base"
        />
      )}
    </>
  )
}
