import type { Editor } from '@tiptap/core'
import { Plus, SearchX } from 'lucide-react'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Locale } from '@/shared/i18n'
import { LAPTOP, matchesQuery, useMediaQuery } from '@/shared/lib'
import { KindTile, Said, SearchField, Sheet, SheetContent, type MenuAction } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { insertActions } from './menus'

/**
 * Insert (the board's INSLIST, Notion's / menu and Craft's +): the toolbar's accent opens a sheet
 * titled Insert, on a laptop a popover 420 wide over the Insert button of the floating toolbar. At
 * its head a search that keeps the kinds whose name holds what is typed; then each group, its name
 * small over a card of rows, each kind's glyph on its tile and its name. A tap adds the block and
 * closes the sheet; a search that keeps nothing says so.
 */
export function InsertSheet({ editor, locale }: { editor: Editor; locale: Locale }) {
  const { t } = useTranslation('learn')
  const laptop = useMediaQuery(LAPTOP)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const search = useRef<HTMLDivElement>(null)
  const groups: { name: string; actions: MenuAction[] }[] = []
  for (const action of insertActions(editor, locale, t)) {
    if (!matchesQuery([action.label], query)) continue
    const name = action.group ?? ''
    const last = groups.at(-1)
    if (last?.name === name) last.actions.push(action)
    else groups.push({ name, actions: [action] })
  }
  return (
    <>
      <Button
        className="shrink-0 bg-foreground px-4 text-[0.9375rem] text-background hover:brightness-110"
        // The caret stays in the document: the block goes in where it stood.
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => setOpen(true)}
      >
        <Plus data-icon="inline-start" aria-hidden />
        {t('edit.doc.insert')}
      </Button>
      <Sheet
        at={{ side: 'top', width: 'w-105' }}
        open={open}
        onOpenChange={(next) => {
          setOpen(next)
          if (!next) setQuery('')
        }}
      >
        <SheetContent
          title={t('edit.doc.insert')}
          wide
          // On a laptop the cursor starts in the search; a phone's keyboard waits for a tap.
          {...(laptop
            ? { initialFocus: () => search.current?.querySelector('input') ?? true }
            : {})}
        >
          <div className="flex flex-col gap-4">
            <div ref={search}>
              <SearchField label={t('edit.doc.insertSearch')} value={query} onChange={setQuery} />
            </div>
            {groups.length === 0 ? (
              <Said icon={SearchX} title={t('edit.doc.noInsert', { query: query.trim() })} />
            ) : (
              groups.map((group) => (
                <section key={group.name} aria-label={group.name} className="flex flex-col gap-2">
                  <h3 className="caps ms-4">{group.name}</h3>
                  <ul className="overflow-hidden rounded-card bg-card">
                    {group.actions.map((action) => (
                      <li
                        key={action.key}
                        className="[&+&]:shadow-[inset_0_1px_0_var(--color-muted)]"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setOpen(false)
                            setQuery('')
                            action.onSelect()
                          }}
                          className="flex min-h-13 w-full items-center gap-3 px-4 py-1 text-left text-base transition-colors duration-200 ease-out hover:bg-muted focus-visible:-outline-offset-3"
                        >
                          {action.icon ? <KindTile icon={action.icon} /> : null}
                          <span className="min-w-0 flex-1">{action.label}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              ))
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
