import { cn } from '@/shared/lib'

/**
 * Text drawn for the eye alone (CSS `content`): a key's letter, a chip's `T`, a counter's `1/12`, where
 * the control's name already says it in words. It is no text to a screen reader or a voice command,
 * so a control's name (WCAG 2.5.3, label in name) holds every word it shows.
 */
export function Glyph({ text, className }: { text: string; className?: string }) {
  return (
    <span
      aria-hidden
      data-glyph={text}
      className={cn('before:content-[attr(data-glyph)]', className)}
    />
  )
}
