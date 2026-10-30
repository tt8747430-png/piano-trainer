import { useId, type ReactNode } from 'react'
import { NameField } from './NameField'
import { Button } from './primitives/button'
import { Sheet, SheetContent } from './Sheet'

/**
 * A part of a New sheet (Flat's new score): its name and a line of what it sets, over its choice, on a
 * soft card.
 */
export function SheetPart({
  title,
  detail,
  children,
}: {
  title: string
  detail?: string
  children: ReactNode
}) {
  const id = useId()
  return (
    <section aria-labelledby={id} className="flex flex-col gap-3 rounded-2xl bg-muted/50 p-4">
      <div className="flex flex-col">
        <h3 id={id} className="font-sans font-semibold">
          {title}
        </h3>
        {detail ? <p className="text-sm text-muted-foreground">{detail}</p> : null}
      </div>
      {children}
    </section>
  )
}

/**
 * Making anything new, one way across the app (round 25, after Flat's new score and Noji's): a sheet
 * titled for what is made; its name first, focused, above the phone's keyboard; its few properties as
 * parts (`children`); one Create at the foot named for the act, greyed until there is a name, saying
 * so while it makes it and why it was not made.
 */
export function NewSheet({
  open,
  onOpenChange,
  title,
  nameLabel,
  name,
  onName,
  maxLength,
  createLabel,
  creatingLabel,
  creating = false,
  failed,
  onCreate,
  hint,
  createIcon,
  children,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  nameLabel: string
  name: string
  onName: (name: string) => void
  maxLength?: number
  /** The foot's button: "Create song", "Create course" … */
  createLabel: string
  creatingLabel?: string
  creating?: boolean
  /** Why it was not made, said under the button. */
  failed?: string | null
  onCreate: () => void
  /** A line under the name: what can be changed later. */
  hint?: string
  /** A picture before the button's name (Record's microphone). */
  createIcon?: ReactNode
  /** Its properties, each a `SheetPart`. */
  children?: ReactNode
}) {
  const named = name.trim() !== ''
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        title={title}
        footer={
          <div className="flex flex-col gap-2">
            <Button size="lg" disabled={!named || creating} onClick={onCreate}>
              {createIcon}
              {creating && creatingLabel ? creatingLabel : createLabel}
            </Button>
            {failed ? (
              <p role="alert" className="text-sm text-destructive">
                {failed}
              </p>
            ) : null}
          </div>
        }
      >
        <form
          className="flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault()
            if (named && !creating) onCreate()
          }}
        >
          <NameField
            label={nameLabel}
            value={name}
            maxLength={maxLength}
            onChange={(event) => onName(event.target.value)}
          />
          {hint ? <p className="-mt-2 text-sm text-muted-foreground">{hint}</p> : null}
          {children}
        </form>
      </SheetContent>
    </Sheet>
  )
}
