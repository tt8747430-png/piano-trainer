import { Plus } from 'lucide-react'
import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import {
  selectRoomForSetlist,
  SETLIST_NAME_MAX,
  useLibrary,
  useLibraryStoreApi,
  type SetlistId,
} from '@/entities/library'
import { RowButton, TileMark } from '@/shared/ui'
import { createSetlist } from '../create-setlist'

/**
 * New setlist, as the last row of a list of them: a tap names it where the row stands (Chordify's
 * Create new setlist), Enter or leaving the field makes it and hands its id on (`onMade`), Escape or
 * an empty name makes none; greyed, saying why, once the library holds as many as it keeps.
 */
export function NewSetlistRow({ onMade }: { onMade: (id: SetlistId) => void }) {
  const { t } = useTranslation('songs')
  const store = useLibraryStoreApi()
  const room = useLibrary(selectRoomForSetlist)
  // What the field holds while it is open; null while the row stands.
  const [name, setName] = useState<string | null>(null)
  const row = useRef<HTMLButtonElement>(null)
  const field = useRef<HTMLInputElement>(null)
  // Closed by Enter or Escape: the row takes the focus back, and the field's blur makes nothing.
  const settled = useRef(false)
  const naming = name !== null
  useEffect(() => {
    if (naming) field.current?.focus()
    else if (settled.current) {
      settled.current = false
      row.current?.focus()
    }
  }, [naming])

  const close = (make: boolean) => {
    if (name === null) return
    const id = make ? createSetlist(store, name) : null
    setName(null)
    if (id) onMade(id)
  }
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter' && event.key !== 'Escape') return
    event.preventDefault()
    // Escape closes the field, not the sheet it may stand in.
    event.stopPropagation()
    settled.current = true
    close(event.key === 'Enter')
  }

  if (!naming)
    return (
      <RowButton
        ref={row}
        title={t('library.newSetlist')}
        icon={Plus}
        paint="sand"
        disabled={!room}
        reason={t('library.full')}
        onClick={() => setName('')}
      />
    )
  return (
    <div className="flex min-h-16 items-center gap-3 py-2 pr-3 pl-2">
      <TileMark icon={Plus} paint="sand" />
      <input
        ref={field}
        aria-label={t('library.setlistName')}
        placeholder={t('library.newSetlist')}
        value={name}
        maxLength={SETLIST_NAME_MAX}
        autoComplete="off"
        enterKeyHint="done"
        onChange={(event) => setName(event.target.value)}
        onKeyDown={onKeyDown}
        onBlur={() => {
          if (!settled.current) close(true)
        }}
        className="h-11 min-w-0 flex-1 rounded-xl border border-input bg-card px-3 text-lg font-semibold"
      />
    </div>
  )
}
