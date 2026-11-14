import { useDraggable } from '@dnd-kit/core'
import { useTranslation } from 'react-i18next'
import { useKeyName } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import { printedChord, type Chord, type Key } from '@/shared/lib/music'
import { keyDragId } from '../model/sheet-dnd'

/** One of the key's chords, picked up to drop into a bar, or tapped to add it after the last. */
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
        title={t('chordPlayer.keyChord', { chord: name })}
        className={cn(
          'h-14 flex-1 cursor-grab touch-none rounded-[12px] bg-card text-xl font-medium shadow-[0_0_0_1px_var(--color-border)] transition-colors duration-150 ease-out hover:bg-muted active:cursor-grabbing',
          isDragging && 'opacity-40',
        )}
        {...attributes}
        {...listeners}
      >
        {name}
      </button>
    </li>
  )
}

/** The key's chords beside the sheet on a laptop (canvas 171): drag one into a bar. */
export function KeyChords({
  musicKey,
  chords,
  onAdd,
}: {
  musicKey: Key
  chords: readonly Chord[]
  onAdd(chord: Chord): void
}) {
  const { t } = useTranslation('practice')
  const keyName = useKeyName()
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 px-1">
        <h2 className="text-xl font-bold text-balance">
          {t('chordPlayer.keyChords', { key: keyName(musicKey) })}
        </h2>
        <p className="text-sm text-muted-foreground">{t('chordPlayer.keyChordsHint')}</p>
      </div>
      <ul className="grid grid-cols-4 gap-2">
        {chords.map((chord, at) => (
          <KeyTile key={at} chord={chord} at={at} onAdd={() => onAdd(chord)} />
        ))}
      </ul>
    </section>
  )
}
