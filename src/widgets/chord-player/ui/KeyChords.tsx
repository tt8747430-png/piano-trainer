import { useDraggable } from '@dnd-kit/core'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'
import { printedChord, type Chord } from '@/shared/lib/music'
import { LeadSymbol } from '@/shared/ui'
import { keyDragId } from '../model/sheet-dnd'

/**
 * One of the key's chords, a button (canvas 2026-11-18, no gesture alone): a tap puts it in the chosen
 * chord's place (after the last where none is chosen); dragging it into a bar is the shortcut.
 */
function KeyTile({ chord, at, onAdd }: { chord: Chord; at: number; onAdd(): void }) {
  const { t } = useTranslation('practice')
  const name = printedChord(chord)
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: keyDragId(at) })
  return (
    <li className="flex">
      <button
        ref={setNodeRef}
        type="button"
        onClick={onAdd}
        aria-label={t('chordPlayer.keyChord', { chord: name })}
        title={t('chordPlayer.keyChordTip')}
        className={cn(
          'h-14 flex-1 cursor-grab touch-none rounded-control bg-card text-xl font-semibold shadow-[0_0_0_1px_var(--color-border)] transition-colors duration-150 ease-out hover:bg-muted active:cursor-grabbing',
          isDragging && 'opacity-40',
        )}
        {...attributes}
        {...listeners}
      >
        <LeadSymbol text={name} />
      </button>
    </li>
  )
}

/**
 * The key's chords (canvas R77, the Chords panel's `_DRAGB`): four across, each tapped into the chosen
 * chord's place or dragged into a bar; the panel's or the page's head names the key.
 */
export function KeyChords({
  chords,
  onAdd,
}: {
  chords: readonly Chord[]
  onAdd(chord: Chord): void
}) {
  return (
    <ul className="grid grid-cols-4 gap-2">
      {chords.map((chord, at) => (
        <KeyTile key={at} chord={chord} at={at} onAdd={() => onAdd(chord)} />
      ))}
    </ul>
  )
}
