import { FileUp, Music } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Sheet, SheetContent } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { LEFT_KINDS, type LeftCounts } from '../model/draft-of-score'
import type { SongFileProblem } from '../model/read-song-file'

/** Where an import stands: reading a file, done with what it left out, or failed and why. */
export type ImportState =
  | { readonly kind: 'idle' }
  | { readonly kind: 'reading'; readonly name: string }
  | { readonly kind: 'done'; readonly title: string; readonly leftOut: LeftCounts }
  | { readonly kind: 'failed'; readonly name: string; readonly problem: SongFileProblem }

/**
 * An import's sheet (ADR 0107): the file being read; the song made, what the file held that the song
 * leaves out, each with how many, and Open the song; or why the file did not open, said plainly, and
 * Choose another file.
 */
export function ImportSheet({
  state,
  onClose,
  onOpen,
  onAgain,
}: {
  state: ImportState
  onClose: () => void
  onOpen: () => void
  onAgain: () => void
}) {
  const { t } = useTranslation('songs')
  const open = state.kind !== 'idle'
  return (
    <Sheet open={open} onOpenChange={(next) => (next ? null : onClose())}>
      {state.kind === 'reading' ? (
        <SheetContent
          title={t('import.action')}
          description={t('import.reading', { name: state.name })}
        >
          <div role="status" aria-busy className="h-1 overflow-hidden rounded-full bg-muted">
            <div className="h-full w-1/3 animate-pulse rounded-full bg-primary" />
          </div>
        </SheetContent>
      ) : state.kind === 'done' ? (
        <SheetContent
          title={t('import.done')}
          description={state.title}
          footer={
            <Button size="lg" onClick={onOpen}>
              <Music data-icon="inline-start" aria-hidden />
              {t('import.open')}
            </Button>
          }
        >
          <h3 className="pt-1 pb-2 text-sm font-semibold text-muted-foreground">
            {t('import.leftOut')}
          </h3>
          <ul className="card divide-y divide-hairline">
            {LEFT_KINDS.flatMap((kind) => {
              const count = state.leftOut[kind]
              return count ? (
                <li key={kind} className="flex items-baseline gap-4 px-4 py-3">
                  <span className="min-w-0 flex-1 text-pretty">{t(`import.left.${kind}`)}</span>
                  <span className="shrink-0 font-semibold tabular-nums">{count}</span>
                </li>
              ) : (
                []
              )
            })}
          </ul>
        </SheetContent>
      ) : state.kind === 'failed' ? (
        <SheetContent
          title={t('import.failed', { name: state.name })}
          footer={
            <Button size="lg" variant="soft" onClick={onAgain}>
              <FileUp data-icon="inline-start" aria-hidden />
              {t('import.again')}
            </Button>
          }
        >
          <p role="alert" className="text-pretty">
            {t(`import.problem.${state.problem}`)}
          </p>
        </SheetContent>
      ) : null}
    </Sheet>
  )
}
