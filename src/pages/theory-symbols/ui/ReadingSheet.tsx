import { BookOpenText, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Sheet, SheetContent, SheetTrigger } from '@/shared/ui'

const READING = ['triad', 'numbers', 'sevenths', 'sixth', 'sus', 'slash', 'alterations'] as const
const NUMBERS = ['twoNames', 'addOnly', 'upTo', 'thirteenth'] as const
const STEPS = [
  'order',
  'core',
  'quality',
  'sixthOrSeventh',
  'ninth',
  'eleventh',
  'thirteenth',
] as const

/**
 * The legacy Guide's chord-symbol reading notes, behind one row (master spec §5): the app's one
 * reference text, recorded as the exception in CODE_STYLE §10.
 */
export function ReadingSheet() {
  const { t } = useTranslation('theory')
  return (
    <Sheet>
      <SheetTrigger className="flex min-h-14 w-full items-center gap-3 rounded-3xl bg-card px-4 text-left font-semibold ring-1 ring-border transition-colors duration-200 ease-out outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring">
        <BookOpenText aria-hidden className="size-5 text-primary" />
        <span className="flex-1">{t('symbols.howToRead')}</span>
        <ChevronRight aria-hidden className="size-5 text-muted-foreground" />
      </SheetTrigger>
      <SheetContent title={t('symbols.howToRead')}>
        <article className="flex flex-col gap-6 pb-4 text-base leading-relaxed">
          <section className="flex flex-col gap-2">
            <h3 className="text-lg font-bold">{t('symbols.reading.title')}</h3>
            {READING.map((key) => (
              <p key={key}>
                <strong>{t(`symbols.reading.items.${key}.lead`)}</strong>{' '}
                {t(`symbols.reading.items.${key}.rest`)}
              </p>
            ))}
          </section>
          <section className="flex flex-col gap-2">
            <h3 className="text-lg font-bold">{t('symbols.numbers.title')}</h3>
            {NUMBERS.map((key) => (
              <p key={key}>
                <strong>{t(`symbols.numbers.items.${key}.lead`)}</strong>{' '}
                {t(`symbols.numbers.items.${key}.rest`)}
              </p>
            ))}
          </section>
          <section className="flex flex-col gap-2">
            <h3 className="text-lg font-bold">{t('symbols.naming.title')}</h3>
            <ol className="flex list-decimal flex-col gap-1 pl-5">
              {STEPS.map((step) => (
                <li key={step}>{t(`symbols.naming.steps.${step}`)}</li>
              ))}
            </ol>
            <p className="text-muted-foreground">{t('symbols.naming.careful')}</p>
          </section>
        </article>
      </SheetContent>
    </Sheet>
  )
}
