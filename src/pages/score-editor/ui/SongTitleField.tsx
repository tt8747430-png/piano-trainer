import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TITLE_MAX } from '@/entities/piece'
import { Input } from '@/shared/ui/primitives/input'
import { useScoreEditorContext } from '../model/editor-context'

/** An own song's title, saved as it leaves the field; an empty one keeps the title it had. */
export function SongTitleField() {
  const { t } = useTranslation('editor')
  const { actions, meta } = useScoreEditorContext()
  const [title, setTitle] = useState(meta.title)
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm text-muted-foreground">{t('song.title')}</span>
      <Input
        value={title}
        maxLength={TITLE_MAX}
        onChange={(event) => setTitle(event.target.value)}
        onBlur={() => actions.rename(title)}
        className="h-12"
      />
    </label>
  )
}
