import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'
import { CREDITS_GAP, type SheetCreditLines } from './sheet-credits'

/**
 * A score's credits printed under its title, as the canvas prints them (the Player's and the
 * editor's title block): its subtitle centred where it has one, then one quiet line naming who wrote
 * it, "Words: John Newton · Music: New Britain", centred over lines down the screen and at the right
 * over a page; nothing the learner did not write.
 */
export function SheetCredits({
  credits,
  align = 'end',
  className,
}: {
  credits: SheetCreditLines
  align?: 'center' | 'end'
  className?: string
}): ReactNode {
  const { subtitle } = credits
  const line = useCreditLine(credits)
  return (
    <div
      data-slot="sheet-credits"
      style={{ paddingTop: CREDITS_GAP }}
      className={cn('flex flex-col gap-0.5', className)}
    >
      {subtitle ? (
        <p className="text-center font-display text-lg leading-6 text-balance wrap-break-word">
          {subtitle}
        </p>
      ) : null}
      {line ? (
        <p
          className={cn(
            'font-sans text-[0.8125rem] leading-6 text-pretty wrap-break-word text-muted-foreground',
            align === 'center' ? 'text-center' : 'text-end',
          )}
        >
          {line}
        </p>
      ) : null}
    </div>
  )
}

/** Who wrote it, in one line, as a score prints it: "Words: John Newton · Music: New Britain"; none
 * without a name. The sheet's credits print it; the Player's bar carries it under the title. */
export function useCreditLine(credits: SheetCreditLines | undefined): string {
  const { t } = useTranslation('common')
  if (credits === undefined) return ''
  const { composer, lyricist, arranger, translator, tune } = credits
  const both = lyricist !== undefined && lyricist === composer
  return [
    both ? t('sheetCredits.wordsAndMusic', { names: lyricist }) : null,
    !both && lyricist ? t('sheetCredits.words', { names: lyricist }) : null,
    translator ? t('sheetCredits.translator', { names: translator }) : null,
    !both && composer ? t('sheetCredits.music', { names: composer }) : null,
    tune ? t('sheetCredits.tune', { names: tune }) : null,
    arranger ? t('sheetCredits.arranger', { names: arranger }) : null,
  ]
    .filter((part) => part !== null)
    .join(' · ')
}
