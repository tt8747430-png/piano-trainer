import { useTranslation } from 'react-i18next'
import type { BookPattern } from '@/entities/pattern'
import { PublishScreen } from '@/features/publish'
import { localText, useLocale } from '@/shared/i18n'
import type { SettingsWindowOpen } from '@/shared/lib'
import { SettingsWindow } from '@/shared/ui'
import { usePatternPublish } from '../model/use-pattern-publish'

/**
 * Publish in library for a pattern of the learner's own (its ··· › Publish…): a window over the
 * pattern, never a page with an address (the Pattern boards' THINGWIN), as a song's and a
 * progression's Publish. The window says so in the history entry's state.
 */
export function PatternPublishWindow({
  pattern,
  open,
  onOpenChange,
}: SettingsWindowOpen & { pattern: BookPattern }) {
  const { t } = useTranslation(['editor', 'practice'])
  const locale = useLocale()
  const { item, publishing } = usePatternPublish(pattern, localText(pattern.name, locale))
  return (
    <SettingsWindow open={open} onOpenChange={onOpenChange} title={t('editor:publishPage.title')}>
      {item ? (
        <PublishScreen
          item={{
            id: item.sourceId,
            kind: item.kind,
            title: item.title,
            meta: item.meta,
            line: t('practice:patterns.yours'),
          }}
          publishing={publishing}
        />
      ) : null}
    </SettingsWindow>
  )
}
