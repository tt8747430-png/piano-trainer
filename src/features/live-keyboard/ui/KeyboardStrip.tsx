import { Maximize2, Piano } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'

/**
 * The keys folded away (R34, Songscription's "Piano roll ↗" strip): a thin labelled strip where they
 * stood, the screen's width, that brings them back at a tap, so the keyboard is never lost behind a
 * menu. `edge`: the side facing the music, where its hairline is.
 */
export function KeyboardStrip({ edge, onShow }: { edge: 'above' | 'below'; onShow: () => void }) {
  const { t } = useTranslation('common')
  return (
    <button
      type="button"
      data-slot="keyboard-strip"
      aria-label={t('keyboardTools.show')}
      onClick={onShow}
      className={cn(
        'flex min-h-11 w-full shrink-0 items-center justify-center gap-2 border-hairline bg-muted text-sm font-medium text-muted-foreground transition-colors duration-200 ease-out select-none hover:text-foreground focus-visible:-outline-offset-3',
        edge === 'above' ? 'border-t' : 'border-b',
      )}
    >
      <Piano aria-hidden className="size-4" />
      {t('keyboardTools.keyboard')}
      <Maximize2 aria-hidden className="size-3.5" />
    </button>
  )
}
