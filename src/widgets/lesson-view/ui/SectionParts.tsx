import { useTranslation } from 'react-i18next'
import { localText, useLocale, type LocalText } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import type { BlockStyle } from '@/shared/lib/style'
import { StyledBlock } from './LessonBlock'

/** A section's heading, on a card of its own style where it has one (R29 B9). */
export function SectionHeading({ text, style }: { text: LocalText; style?: BlockStyle }) {
  const locale = useLocale()
  const heading = (
    <h2 className="font-sans text-2xl/[normal] font-bold tracking-[-0.01em] text-balance">
      {localText(text, locale)}
    </h2>
  )
  return style ? <StyledBlock style={style}>{heading}</StyledBlock> : heading
}

/**
 * A section's In short (the canvas's _SHORT), under its example on the column's edge: its one
 * sentence 16 semibold on the honey wash, 12 by 16 inside, 12 corners, sized to its words (65ch at
 * most), its label in the small honey caps; on a card of its own style where it has one (R29 B9).
 */
export function Takeaway({ text, style }: { text: LocalText; style?: BlockStyle }) {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const words = (
    <div className="flex flex-col gap-0.5">
      <span
        aria-hidden
        className={cn(
          'text-xs font-bold tracking-[0.04em] uppercase',
          style ? 'opacity-80' : 'text-honey-ink',
        )}
      >
        {t('takeaway')}
      </span>
      <p className="text-base font-semibold text-pretty">{localText(text, locale)}</p>
    </div>
  )
  return (
    <aside
      aria-label={t('takeaway')}
      className={
        style
          ? undefined
          : 'max-w-[65ch] self-start rounded-[12px] bg-honey-wash px-4 py-3 text-foreground'
      }
    >
      {style ? <StyledBlock style={style}>{words}</StyledBlock> : words}
    </aside>
  )
}
