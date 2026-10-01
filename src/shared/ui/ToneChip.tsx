import { cn } from '@/shared/lib'
import type { ChordRole } from '@/shared/lib/music'
import { ROLE_BG } from './role-classes'

/** A chip's face: a chord tone's role, or a scale's tonic or other note (the keys' own colours). */
export type ToneFace = ChordRole | 'tonic' | 'scale'

const ROLE_INK = 'text-on-role'

/** Each face's fill and ink: a role's full paint (as a key down), the scale's tonic and other notes. */
const FACE: Readonly<Record<ToneFace, string>> = {
  root: cn(ROLE_BG.root, ROLE_INK),
  '3rd': cn(ROLE_BG['3rd'], ROLE_INK),
  '5th': cn(ROLE_BG['5th'], ROLE_INK),
  '7th': cn(ROLE_BG['7th'], ROLE_INK),
  '9th': cn(ROLE_BG['9th'], ROLE_INK),
  '11th': cn(ROLE_BG['11th'], ROLE_INK),
  '13th': cn(ROLE_BG['13th'], ROLE_INK),
  tonic: 'bg-key-tonic text-on-key-tonic',
  scale: 'bg-key-scale text-on-key-scale',
}

/** A chord's or a scale's tone: its degree in its colour, then its note. */
export function ToneChip({ face, degree, note }: { face: ToneFace; degree: string; note: string }) {
  return (
    <span className="flex items-center gap-2 rounded-xl border border-border bg-card py-1 pr-3 pl-1">
      <span
        className={cn('grid size-7 place-items-center rounded-lg text-sm font-bold', FACE[face])}
      >
        {degree}
      </span>
      <span className="font-semibold">{note}</span>
    </span>
  )
}
