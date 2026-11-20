import { FileUp, Music } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { MakeSheet } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { LEFT_KINDS, type LeftCounts } from '../model/draft-of-score'
import type { SongFileProblem } from '../model/read-song-file'

/** Where an import stands: choosing a file, reading it, done with what it left out, or failed and why. */
export type ImportState =
  | { readonly kind: 'idle' }
  | { readonly kind: 'choosing' }
  | { readonly kind: 'reading'; readonly name: string }
  | { readonly kind: 'done'; readonly title: string; readonly leftOut: LeftCounts }
  | { readonly kind: 'failed'; readonly name: string; readonly problem: SongFileProblem }

/**
 * Import, one sheet that reports (R72's IMPFORM, ADR 0107; a centred dialog on a laptop): Choose a
 * file, its kinds under it; the file being read; the song made, with what the file held that the
 * song leaves out, each with how many, on the honey of a note (or that everything came in), and
 * Open song; or why the file did not open, said plainly, and Choose another file.
 */
export function ImportSheet({
  state,
  onChoose,
  onClose,
  onOpen,
}: {
  state: ImportState
  onChoose: () => void
  onClose: () => void
  onOpen: () => void
}) {
  const { t } = useTranslation('songs')
  const left = state.kind === 'done' ? LEFT_KINDS.filter((kind) => state.leftOut[kind]) : []
  return (
    <MakeSheet
      open={state.kind !== 'idle'}
      onOpenChange={(next) => (next ? null : onClose())}
      title={t('import.action')}
      dismiss={state.kind === 'choosing' ? 'cancel' : 'close'}
      footer={
        state.kind === 'done' ? (
          <Button size="lg" className="w-full" onClick={onOpen}>
            {t('import.open')}
          </Button>
        ) : state.kind === 'failed' ? (
          <Button size="lg" variant="soft" className="w-full" onClick={onChoose}>
            <FileUp data-icon="inline-start" aria-hidden />
            {t('import.again')}
          </Button>
        ) : undefined
      }
    >
      {state.kind === 'choosing' ? (
        <button
          type="button"
          onClick={onChoose}
          className="flex flex-col items-center gap-2 rounded-2xl bg-card px-4 py-7 text-foreground ring-[1.5px] ring-border ring-inset transition-colors hover:bg-foreground/[0.03]"
        >
          <span className="flex size-12 items-center justify-center rounded-full bg-muted">
            <FileUp aria-hidden className="size-5" />
          </span>
          <span className="text-base font-bold">{t('import.choose')}</span>
          <span className="text-sm text-muted-foreground">{t('import.kinds')}</span>
        </button>
      ) : state.kind === 'reading' ? (
        <div className="flex flex-col gap-3 py-2">
          <p className="text-pretty text-muted-foreground">
            {t('import.reading', { name: state.name })}
          </p>
          <div role="status" aria-busy className="h-1 overflow-hidden rounded-pill bg-muted">
            <div className="h-full w-1/3 rounded-pill bg-primary motion-safe:animate-pulse" />
          </div>
        </div>
      ) : state.kind === 'done' ? (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-paint-yellow text-foreground">
              <Music aria-hidden className="size-6" />
            </span>
            <span className="min-w-0 text-[1.0625rem] font-bold text-balance break-words">
              {state.title}
            </span>
          </div>
          {left.length === 0 ? (
            <p role="status" className="text-pretty text-muted-foreground">
              {t('import.whole')}
            </p>
          ) : (
            <div className="flex flex-col gap-2 rounded-card bg-paint-yellow px-4 py-3 text-[0.9375rem]/[1.45]">
              <p className="font-bold">{t('import.leftOut')}</p>
              <ul className="flex flex-col gap-1">
                {left.map((kind) => (
                  <li key={kind} className="flex items-baseline gap-4">
                    <span className="min-w-0 flex-1 text-pretty">{t(`import.left.${kind}`)}</span>
                    <span className="shrink-0 font-semibold tabular-nums">
                      {state.leftOut[kind]}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : state.kind === 'failed' ? (
        <div className="flex flex-col gap-2">
          <p className="font-bold text-balance">{t('import.failed', { name: state.name })}</p>
          <p role="alert" className="text-pretty">
            {t(`import.problem.${state.problem}`)}
          </p>
        </div>
      ) : null}
    </MakeSheet>
  )
}
