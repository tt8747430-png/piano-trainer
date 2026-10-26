import { useTranslation } from 'react-i18next'
import { Notice } from '@/shared/ui'
import { useScoreEditorContext } from '../model/editor-context'

/**
 * Says a change could not be saved (an edit the song's music cannot be written with), as the app says
 * a save that failed: the song keeps the music last saved. A change that saves, or Close, ends it.
 */
export function UnsavedNotice() {
  const { t } = useTranslation('editor')
  const { meta, actions } = useScoreEditorContext()
  return meta.unsaved ? <Notice line={t('unsaved')} onClose={actions.dismissUnsaved} /> : null
}
