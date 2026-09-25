import { useCanGoBack, useRouter } from '@tanstack/react-router'
import { ChevronDown, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { entryTitles, type Piece } from '@/entities/piece'
import { MidiButton } from '@/features/connect-midi'
import { useLocale } from '@/shared/i18n'
import { RoundButton } from '@/shared/ui'

/**
 * Close, the title with the setup summary that opens the Setup sheet, and the MIDI button. Close
 * goes back where the learner came from, or to the piece when the Player was opened directly.
 */
export function PlayerTopBar({
  piece,
  summary,
  onSetup,
}: {
  piece: Piece
  summary: string
  onSetup: () => void
}) {
  const { t } = useTranslation(['player', 'common'])
  const locale = useLocale()
  const router = useRouter()
  const canGoBack = useCanGoBack()
  const close = () =>
    canGoBack
      ? router.history.back()
      : void router.navigate({ to: '/songs/$pieceId', params: { pieceId: piece.id } })
  return (
    <header className="flex items-center gap-3">
      <RoundButton label={t('common:close')} icon={X} onClick={close} />
      <div className="flex min-w-0 flex-1 flex-col items-center">
        <h1 className="max-w-full truncate text-lg font-bold">
          {entryTitles(piece, locale).primary}
        </h1>
        <button
          type="button"
          onClick={onSetup}
          className="inline-flex min-h-11 items-center gap-1 rounded-full px-3 text-muted-foreground transition-colors duration-200 ease-out outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring"
        >
          {summary}
          <ChevronDown aria-hidden className="size-4" />
        </button>
      </div>
      {/* The MIDI button, or its empty place where the browser has no Web MIDI, so the title stays centred. */}
      <div className="flex size-11 shrink-0 items-center justify-center">
        <MidiButton />
      </div>
    </header>
  )
}
