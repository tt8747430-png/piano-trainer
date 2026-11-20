import { ChevronDown } from 'lucide-react'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'
import type { GuidePart } from '../model/guide'

/**
 * A part of the User guide (the board's GUIDEB): a card whose head, its title in 17 semibold with the
 * chevron at the far edge, opens or closes it; open, its steps as plain paragraphs.
 */
export function GuideSection({
  part,
  open,
  onToggle,
}: {
  part: GuidePart
  open: boolean
  onToggle: () => void
}) {
  const { t } = useTranslation('settings')
  const body = useId()
  return (
    <section className="card overflow-hidden">
      <h2 className="font-sans text-lg/6 font-semibold">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={body}
          onClick={onToggle}
          className="flex min-h-14 w-full items-center gap-2.5 px-4 py-2 text-start transition-colors hover:bg-foreground/[0.04]"
        >
          <span className="flex-1 text-balance">{t(`howToUse.${part.id}.title`)}</span>
          <ChevronDown
            aria-hidden
            className={cn(
              'size-5 shrink-0 text-muted-foreground transition-transform duration-200 motion-reduce:transition-none',
              open && 'rotate-180',
            )}
          />
        </button>
      </h2>
      {open ? (
        <div id={body} className="flex flex-col gap-2 px-4 pb-4">
          {part.steps.map(({ key }) => (
            <p key={key} className="max-w-[65ch] text-base/normal text-pretty">
              {t(key)}
            </p>
          ))}
        </div>
      ) : null}
    </section>
  )
}
