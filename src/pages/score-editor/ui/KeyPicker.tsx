import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Key } from '@/shared/lib/music'
import { SwitchRow } from '@/shared/ui'
import { KeySignaturePicker } from '@/shared/ui/pickers/KeySignaturePicker'
import { useScoreEditorContext } from '../model/editor-context'
import { useKeyAt } from '../model/use-key-at'
import { useSignatureFrom } from '../model/use-signature-from'

/**
 * The key signature picker (ADR 0114, after notation apps' key sheets): one bordered grid
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
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const { from, song } = useSignatureFrom(bar)
  const [whole, setWhole] = useState(false)
  const key = useKeyAt(bar, song || whole)
  const choose = (next: Key) =>
    actions.dispatch(
      song || whole
        ? { type: 'settings', key: next }
        : { type: 'sectionKey', bar: from, key: next },
    )
  return (
    <>
      <KeySignaturePicker value={key} onChange={choose} />
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
