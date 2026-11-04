import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { PUBLIC_CATEGORIES, type PublicCategory } from '@/shared/api/public-library'
import { ChoiceChips } from '@/shared/ui'

type Chosen = PublicCategory | 'other'

/**
 * A published song's category (B3), chosen on the Publish page: Classical, Folk, Pop, Studies, or
 * Other (none, found under All alone). Every choice in sight, one chosen.
 */
export function CategoryPicker({
  value,
  onChange,
}: {
  value: PublicCategory | null
  onChange: (category: PublicCategory | null) => void
}) {
  const { t } = useTranslation('songs')
  const id = useId()
  return (
    <div role="group" aria-labelledby={id} className="flex flex-col gap-2">
      <span id={id} className="text-sm font-semibold text-muted-foreground">
        {t('explore.categories.label')}
      </span>
      <ChoiceChips<Chosen>
        label={t('explore.categories.label')}
        value={value ?? 'other'}
        options={[...PUBLIC_CATEGORIES, 'other' as const].map((category) => ({
          value: category,
          label: t(`explore.categories.${category}`),
        }))}
        onChange={(chosen) => onChange(chosen === 'other' ? null : chosen)}
      />
    </div>
  )
}
