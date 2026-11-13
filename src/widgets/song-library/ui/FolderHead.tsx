import { FolderTile, useFolderName } from '@/entities/library'
import type { ShelvedFolder } from '@/entities/library'
import { useHoldsLine, type FolderHolds } from './FolderFace'

/**
 * A folder's page's head (canvas 133, Apple Music's playlist): its tile, its name large, and what it
 * holds, "12 songs · 4 learned". The bar keeps the name for a screen reader (`titleOnPage`).
 */
export function FolderHead({ folder, holds }: { folder: ShelvedFolder; holds: FolderHolds }) {
  const nameOf = useFolderName()
  return (
    <div className="flex min-w-0 items-center gap-4" aria-hidden>
      <FolderTile look={folder} large className="size-16 rounded-card [&_svg]:size-8" />
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="font-sans text-[1.75rem]/tight font-bold tracking-[-0.02em] text-balance break-words">
          {nameOf(folder)}
        </span>
        <span className="text-[0.9375rem] text-muted-foreground">{useHoldsLine(holds)}</span>
      </div>
    </div>
  )
}
