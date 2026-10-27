import { ChevronLeft } from 'lucide-react'
import { useEffect, useRef, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Listbox } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'

/** A choice on a list page: its name, and under it what it is or why it is closed. */
interface SheetChoice {
  readonly key: string
  readonly label: string
  readonly note?: string | undefined
  /** What it plays, drawn at the row's end: a hand's part's bar. */
  readonly picture?: ReactNode
  readonly selected: boolean
  readonly disabled?: boolean
  onChoose(): void
}

/** Choices under a name, or none. */
interface SheetChoiceGroup {
  readonly label?: string
  readonly choices: readonly SheetChoice[]
}

/**
 * One of the sheet's lists, as a page of it, with the way back to the first page: it opens on the
 * choice it holds, so a keyboard user starts where they are, Back kept at its top. `children` follow the list (a way out).
 */
export function ListPage({
  label,
  groups,
  onBack,
  children,
}: {
  label: string
  groups: readonly SheetChoiceGroup[]
  onBack: () => void
  children?: ReactNode
}) {
  const { t } = useTranslation('player')
  const list = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const chosen = list.current?.querySelector<HTMLElement>('[role="option"][tabindex="0"]')
    chosen?.focus({ preventScroll: true })
    chosen?.scrollIntoView?.({ block: 'center' })
  }, [])
  return (
    <div ref={list} className="flex flex-col gap-4">
      {/* Back stays at the top of the sheet however far down the list it opened. */}
      <div className="sticky top-0 z-10 -mx-5 border-b border-hairline bg-card px-5 py-1">
        <Button variant="ghost" className="-ml-3" onClick={onBack}>
          <ChevronLeft data-icon="inline-start" />
          {t('back')}
        </Button>
      </div>
      <Listbox
        label={label}
        className="gap-4"
        optionClassName="min-h-14 border-b border-border py-2"
        groups={groups.map((group) => ({
          ...(group.label ? { label: group.label } : {}),
          options: group.choices.map((choice) => ({
            key: choice.key,
            selected: choice.selected,
            ...(choice.disabled ? { disabled: true } : {}),
            onChoose: choice.onChoose,
            content: (
              <>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">{choice.label}</span>
                  {choice.note ? (
                    <>
                      {' '}
                      <span className="block text-sm text-muted-foreground">{choice.note}</span>
                    </>
                  ) : null}
                </span>
                {choice.picture}
              </>
            ),
          })),
        }))}
      />
      {children}
    </div>
  )
}
