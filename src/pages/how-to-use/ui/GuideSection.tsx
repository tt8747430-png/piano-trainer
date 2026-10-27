import { useTranslation } from 'react-i18next'
import { useFold } from '@/features/fold-section'
import { FoldSection } from '@/shared/ui'
import type { GuidePart } from '../model/guide'

/**
 * A part of How to use: its title, the button that folds it (as the learner left it), and its steps
 * as a numbered list, each beside the icon its control wears in the app.
 */
export function GuideSection({ part }: { part: GuidePart }) {
  const { t } = useTranslation('settings')
  const fold = useFold(`howToUse.${part.id}`)
  return (
    <FoldSection
      title={t(`howToUse.${part.id}.title`)}
      fold={fold}
      headingClassName="text-xl"
      className="card px-5 py-4"
    >
      <ol className="flex flex-col divide-y divide-hairline">
        {part.steps.map(({ key, icon: Icon }) => (
          <li key={key} className="flex items-start gap-3 py-3 first:pt-1 last:pb-1">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted text-foreground">
              <Icon aria-hidden className="size-5" />
            </span>
            <span className="min-w-0 pt-1.5 text-pretty">{t(key)}</span>
          </li>
        ))}
      </ol>
    </FoldSection>
  )
}
