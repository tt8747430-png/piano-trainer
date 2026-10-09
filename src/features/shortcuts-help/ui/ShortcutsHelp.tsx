import { useCallback, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useListedShortcuts, useShortcuts } from '@/shared/lib/shortcuts'
import { Sheet, SheetContent } from '@/shared/ui'
import { Kbd, KbdGroup } from '@/shared/ui/primitives/kbd'
import { OpenShortcutsContext } from './open-shortcuts'

/** The shortcuts on screen, group by group: a name, then its keycaps. */
function ShortcutsList() {
  const groups = useListedShortcuts()
  return (
    <div className="flex flex-col gap-6">
      {groups.map((group) => (
        <section key={group.name} className="flex flex-col">
          <h3 className="pb-1 text-sm text-muted-foreground">{group.name}</h3>
          {group.rows.map((row) => (
            <div
              key={row.label}
              className="flex min-h-11 items-center justify-between gap-4 border-b border-hairline py-2 last:border-b-0"
            >
              <span>{row.label}</span>
              <KbdGroup className="shrink-0">
                {row.keys.map((key, index) => (
                  // A row's caps never reorder, and two may be the same.
                  <Kbd key={`${index}:${key}`} className="h-7 min-w-7 px-2 text-sm">
                    {key}
                  </Kbd>
                ))}
              </KbdGroup>
            </div>
          ))}
        </section>
      ))}
    </div>
  )
}

/**
 * The shortcuts' sheet over the app: `?` opens it anywhere, and `ShortcutsButton` for a hand on the
 * pointer. It lists what the screen binds first, then the piano's keys, then the app's.
 */
export function ShortcutsHelp({ children }: { children: ReactNode }) {
  const { t } = useTranslation('common')
  const [open, setOpen] = useState(false)
  const show = useCallback(() => setOpen(true), [])
  useShortcuts(
    t('shortcuts.app'),
    [{ label: t('shortcuts.show'), combo: { key: '?' }, run: show }],
    { scope: 'app' },
  )
  return (
    <OpenShortcutsContext value={show}>
      {children}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent title={t('shortcuts.title')}>
          <ShortcutsList />
        </SheetContent>
      </Sheet>
    </OpenShortcutsContext>
  )
}
