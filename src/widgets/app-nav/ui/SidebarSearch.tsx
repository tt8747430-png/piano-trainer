import { Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'
import { keyHint, useShortcutsPlatform, type Combo } from '@/shared/lib/shortcuts'
import { useSearchPalette } from '@/widgets/search-palette'
import { Tipped } from './Tipped'

/**
 * Search at the sidebar's top (R32, Claude's): a field-like row with its shortcut at its end, opening
 * the palette over the screen; collapsed, its icon alone.
 */
export function SidebarSearch({ collapsed, combo }: { collapsed: boolean; combo: Combo }) {
  const { t } = useTranslation('common')
  const palette = useSearchPalette()
  const mac = useShortcutsPlatform()
  const label = t('nav.search')
  const hint = keyHint('', combo, mac).trim()
  const button = (
    <button
      type="button"
      aria-label={label}
      title={keyHint(label, combo, mac)}
      onClick={() => palette.open()}
      className={cn(
        'flex h-11 items-center gap-3 rounded-control text-muted-foreground transition-colors duration-200 ease-out hover:bg-muted hover:text-foreground focus-visible:-outline-offset-3',
        collapsed
          ? 'w-11 justify-center self-center'
          : 'w-full border border-input bg-background px-3',
      )}
    >
      <Search aria-hidden className="size-5 shrink-0" />
      {collapsed ? null : (
        <>
          <span className="flex-1 text-left">{label}</span>
          <kbd className="rounded-control bg-muted px-1.5 font-sans text-xs text-muted-foreground">
            {hint}
          </kbd>
        </>
      )}
    </button>
  )
  return collapsed ? <Tipped label={label}>{button}</Tipped> : button
}
