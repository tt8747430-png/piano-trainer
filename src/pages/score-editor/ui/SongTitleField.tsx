import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TITLE_MAX } from '@/entities/piece'
import { NameField } from '@/shared/ui'
import { useScoreEditorContext } from '../model/editor-context'

/** An own song's title, saved as it leaves the field; an empty one keeps the title it had. */
export function SongTitleField() {
  const { t } = useTranslation('editor')
  const { actions, meta } = useScoreEditorContext()
  const [title, setTitle] = useState(meta.title)
  return (
    <NameField
      label={t('song.title')}
      value={title}
      maxLength={TITLE_MAX}
      onChange={(event) => setTitle(event.target.value)}
      onBlur={() => actions.rename(title)}
    />
  )
}
