import { Copy, Ellipsis, PencilLine, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  CHORD_SHEET_SONGS,
  selectMine,
  SHEET_NAME_MAX,
  useChordSheets,
  useChordSheetsStoreApi,
  type ChordSheetSong,
  type SavedChordSheet,
} from '@/entities/chord-sheet'
import {
  libraryByStyle,
  libraryLine,
  progressionMode,
  type LibraryProgression,
  type ProgressionStyle,
} from '@/entities/progression-library'
import { deleteSheet, duplicateSheet, renameSheet } from '@/features/manage-chord-sheets'
import { localText, useLocale } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import {
  ActionMenu,
  ChoiceChips,
  MenuSection,
  NewSheet,
  Sheet,
  SheetContent,
  sayUndo,
} from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'

/**
 * The Library (R29 CP4, P13), opened from the sheet's name: My chord sheets first (each row's menu
 * Rename, Duplicate, Delete), then the songs the app holds as sheets, then its progressions by style; a tap opens one in place of the
 * sheet in hand.
 */
export function LibrarySheet({
  open,
  onOpenChange,
  current,
  minor,
  onOpenSaved,
  onOpenSong,
  onOpenProgression,
}: {
  open: boolean
  onOpenChange(open: boolean): void
  /** The saved sheet open, where one is. */
  current: string | undefined
  /** The key's mode a progression opens in. */
  minor: boolean
  onOpenSaved(sheet: SavedChordSheet): void
  onOpenSong(song: ChordSheetSong): void
  onOpenProgression(progression: LibraryProgression): void
}) {
  const { t } = useTranslation('practice')
  const locale = useLocale()
  const store = useChordSheetsStoreApi()
  const mine = useChordSheets(selectMine)
  const groups = libraryByStyle().filter((group) => group.progressions.length > 0)
  const [style, setStyle] = useState<ProgressionStyle>(groups[0]?.style ?? 'pop')
  const [renaming, setRenaming] = useState<{ id: string; name: string } | null>(null)
  const shown = groups.find((group) => group.style === style)?.progressions ?? []
  const remove = (sheet: SavedChordSheet) => {
    const undo = deleteSheet(store, sheet.id)
    if (undo) sayUndo(t('chordPlayer.row.deleted', { name: sheet.name }), undo)
  }
  return (
    <>
      <Sheet at={{ width: 'w-80' }} open={open} onOpenChange={onOpenChange}>
        <SheetContent title={t('chordPlayer.library')} tall>
          <div className="flex flex-col gap-6">
            <MenuSection title={t('chordPlayer.mine')} inset className="gap-1">
              {mine.length === 0 ? (
                <p className="px-1 text-muted-foreground">{t('chordPlayer.noneMine')}</p>
              ) : (
                <ul className="flex flex-col">
                  {mine.map((sheet) => {
                    const label = t('chordPlayer.row.menu', { name: sheet.name })
                    return (
                      <li key={sheet.id} className="flex min-h-12 items-center gap-1">
                        <button
                          type="button"
                          aria-current={sheet.id === current ? 'true' : undefined}
                          onClick={() => onOpenSaved(sheet)}
                          className={cn(
                            'flex min-h-12 min-w-0 flex-1 items-center rounded-control px-2 text-left font-semibold text-pretty hover:bg-muted focus-visible:outline-3 focus-visible:outline-ring',
                            sheet.id === current && 'text-link',
                          )}
                        >
                          {sheet.name}
                        </button>
                        <ActionMenu
                          label={label}
                          align="end"
                          trigger={<Ellipsis aria-hidden />}
                          render={
                            <Button variant="ghost" size="icon" aria-label={label} title={label} />
                          }
                          actions={[
                            {
                              key: 'rename',
                              label: t('chordPlayer.row.rename'),
                              icon: PencilLine,
                              onSelect: () => setRenaming({ id: sheet.id, name: sheet.name }),
                            },
                            {
                              key: 'duplicate',
                              label: t('chordPlayer.row.duplicate'),
                              icon: Copy,
                              onSelect: () =>
                                duplicateSheet(
                                  store,
                                  sheet.id,
                                  t('chordPlayer.row.copy', { name: sheet.name }).slice(
                                    0,
                                    SHEET_NAME_MAX,
                                  ),
                                ),
                            },
                            {
                              key: 'delete',
                              label: t('chordPlayer.row.delete'),
                              icon: Trash2,
                              destructive: true,
                              onSelect: () => remove(sheet),
                            },
                          ]}
                        />
                      </li>
                    )
                  })}
                </ul>
              )}
            </MenuSection>
            <MenuSection title={t('chordPlayer.songs')} inset className="gap-1">
              <ul className="flex flex-col">
                {CHORD_SHEET_SONGS.map((song) => (
                  <li key={song.id}>
                    <button
                      type="button"
                      onClick={() => onOpenSong(song)}
                      className="flex min-h-12 w-full min-w-0 flex-col justify-center rounded-control px-2 py-1 text-left hover:bg-muted focus-visible:outline-3 focus-visible:outline-ring"
                    >
                      <span className="font-semibold text-pretty">{song.name}</span>
                      <span className="text-muted-foreground">{song.by}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </MenuSection>
            <MenuSection title={t('chordPlayer.progressions')} inset className="gap-3">
              <ChoiceChips
                label={t('chordPlayer.progressions')}
                value={style}
                options={groups.map((group) => ({
                  value: group.style,
                  label: t(`progressions.style.${group.style}`),
                }))}
                onChange={setStyle}
              />
              <ul className="flex flex-col">
                {shown.map((progression) => {
                  const inMinor = progressionMode(progression, minor)
                  return (
                    <li key={progression.id}>
                      <button
                        type="button"
                        onClick={() => onOpenProgression(progression)}
                        className="flex min-h-12 w-full min-w-0 flex-col justify-center rounded-control px-2 py-1 text-left hover:bg-muted focus-visible:outline-3 focus-visible:outline-ring"
                      >
                        <span className="font-semibold text-pretty">
                          {localText(progression.name, locale)}
                        </span>
                        <span className="text-muted-foreground">
                          {libraryLine(progression, inMinor)}
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </MenuSection>
          </div>
        </SheetContent>
      </Sheet>
      <NewSheet
        open={renaming !== null}
        onOpenChange={(next) => (next ? null : setRenaming(null))}
        title={t('chordPlayer.row.renameTitle')}
        nameLabel={t('chordPlayer.save.name')}
        name={renaming?.name ?? ''}
        maxLength={SHEET_NAME_MAX}
        onName={(name) => setRenaming((was) => (was ? { ...was, name } : was))}
        createLabel={t('chordPlayer.row.rename')}
        onCreate={() => {
          if (renaming && renameSheet(store, renaming.id, renaming.name)) setRenaming(null)
        }}
      />
    </>
  )
}
