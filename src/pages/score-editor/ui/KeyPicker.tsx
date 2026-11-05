import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { sameKey, type Key } from '@/shared/lib/music'
import { SwitchRow } from '@/shared/ui'
import { KeySignaturePicker } from '@/shared/ui/pickers/KeySignaturePicker'
import { usePickerLayout } from '@/shared/ui/pickers/picker-layout'
import { useScoreEditorContext } from '../model/editor-context'
import { useKeyAt } from '../model/use-key-at'
import { useSignatureFrom } from '../model/use-signature-from'

/**
 * The key signature picker (A34, ADR 0114, Flat's key grid): Major · Minor over the fifteen
 * signatures, C/Am first, each on a short staff named by its major and relative minor, the one in
 * force tinted. The mode is the one written to the score: a minor song goes to the signature's minor
 * key. In a section
 * after the first, the key changes from it on (as Flat changes key from a bar) unless "Change the key
 * for the whole song" is on: then the song's own key, its music moved with it, as at its head. In the
 * palette, the first bar chosen's section (else the caret's); over a key signature printed on the
 * sheet, its bar's (`bar`). A tap changes it.
 */
export function KeyPicker({ bar }: { bar?: number | undefined }) {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const { from, song } = useSignatureFrom(bar)
  const [whole, setWhole] = useState(false)
  const key = useKeyAt(bar, song || whole)
  // In the folded palette's row its signatures alone, from the section on (R31-E).
  const row = usePickerLayout() === 'row'
  const choose = (next: Key) =>
    sameKey(next, key) ||
    actions.dispatch(
      song || whole
        ? { type: 'settings', key: next }
        : { type: 'sectionKey', bar: from, key: next },
    )
  return (
    <>
      <KeySignaturePicker value={key} onChange={choose} />
      {song || row ? null : (
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
