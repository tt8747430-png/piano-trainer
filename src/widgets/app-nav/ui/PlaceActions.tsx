import { Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { RoundButton } from '@/shared/ui'
import { useSearchPalette } from '@/widgets/search-palette'

/**
 * A place's bar's action on a phone and a tablet: Search, opening the palette over the place (rule 27;
 * the Profile is a tab of its own, Settings in it). A laptop's sidebar has Search at its foot, so the
 * bar leaves it out there.
 */
export function PlaceActions() {
  const { t } = useTranslation('common')
  const palette = useSearchPalette()
  return (
    <div className="flex gap-1.5 lg:hidden">
      <RoundButton label={t('nav.search')} icon={Search} onClick={() => palette.open()} />
    </div>
  )
}
