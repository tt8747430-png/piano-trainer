import { useTranslation } from 'react-i18next'
import {
  changesOf,
  LAYOUT_PAGES,
  panelsOf,
  selectLayouts,
  usePageLayouts,
  usePageLayoutsStoreApi,
  type PanelChange,
} from '@/entities/page-layout'
import { resetEveryLayout, resetPageLayout, restoreLayouts } from '@/features/arrange-page-layout'
import { isOneOf } from '@/shared/lib'
import { GroupAction, GroupRow, say, SettingsGroup } from '@/shared/ui'
import { SettingsScreen } from '@/widgets/settings-screen'

/** How many changes a row names before "+ n more". */
const NAMED = 2
const isPanel = isOneOf(panelsOf('chord-player'))

/**
 * Settings › General › Page layouts (canvas R76's P_LAYOUTS): Changed by you, a row for each page
 * whose panels can be arranged, its name, what the learner changed of it ("Keys at the top, Genos
 * hidden", or "As it came") and, while changed, its Reset; then Reset every page. Each reset happens
 * at once, with Undo in its toast (a loss that can be undone, CLAUDE.md).
 */
export function PageLayoutsPage() {
  const { t } = useTranslation(['settings', 'practice'])
  const store = usePageLayoutsStoreApi()
  const pages = usePageLayouts(selectLayouts)
  const panel = (name: string) =>
    isPanel(name) ? t(`practice:chordPlayer.layout.panels.${name}`) : name
  const said = (change: PanelChange) =>
    change.kind === 'hidden'
      ? t('layouts.hidden', { panel: panel(change.panel) })
      : change.kind === 'place'
        ? t(`layouts.place.${change.place}`, { panel: panel(change.panel) })
        : t('layouts.size', {
            panel: panel(change.panel),
            size: t(`practice:chordPlayer.layout.sizes.${change.size}`).toLowerCase(),
          })
  const undo = (before: typeof pages) => ({
    label: t('layouts.undo'),
    onClick: () => restoreLayouts(store, before),
  })
  const anyChanged = LAYOUT_PAGES.some((page) => pages[page] !== undefined)
  return (
    <SettingsScreen title={t('pages.pageLayouts')}>
      <SettingsGroup flush title={t('layouts.changed')}>
        {LAYOUT_PAGES.map((page) => {
          const changes = changesOf(pages, page)
          const name = t(`layouts.pages.${page}`)
          const shown = changes.slice(0, NAMED).map(said).join(', ')
          const more = changes.length - NAMED
          return (
            <GroupRow key={page} label={name}>
              <span className="min-w-0 truncate text-[15px] text-muted-foreground">
                {changes.length === 0
                  ? t('layouts.asCame')
                  : more > 0
                    ? `${shown} ${t('layouts.more', { count: more })}`
                    : shown}
              </span>
              {changes.length > 0 ? (
                <button
                  type="button"
                  aria-label={t('layouts.resetName', { page: name })}
                  onClick={() =>
                    say(t('layouts.pageReset', { page: name }), undo(resetPageLayout(store, page)))
                  }
                  className="-my-1 -mr-2 h-11 shrink-0 rounded-control px-3 font-semibold text-link transition-colors duration-150 ease-out hover:bg-muted"
                >
                  {t('layouts.reset')}
                </button>
              ) : null}
            </GroupRow>
          )
        })}
      </SettingsGroup>
      {anyChanged ? (
        <SettingsGroup flush>
          <GroupAction
            label={t('layouts.resetAll')}
            onClick={() => say(t('layouts.allReset'), undo(resetEveryLayout(store)))}
          />
        </SettingsGroup>
      ) : null}
    </SettingsScreen>
  )
}
