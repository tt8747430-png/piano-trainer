import { Eye, EyeOff } from 'lucide-react'
import { useId, useState, type ComponentProps, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'
import { InfoTip } from './InfoTip'
import { Problem } from './Problem'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from './primitives/input-group'

/**
 * A form's field (an email, a password, a name), the kit's one field: its caption in the soft caps
 * 16 in, 8 over a 48 field ringed in the hairline line, whose words start 16 in; what it asks for in the ⓘ beside the caption
 * where the caption does not say, a note and what is wrong with it under it on the same 16 edge.
 * A password field has Show beside it. Each kind names its keyboard (the kit's KB): an email opens
 * the email keys with no capitals or correction; a password says whether it is current or new
 * through its `autoComplete`.
 */
export function FormField({
  label,
  info,
  note,
  error,
  type = 'text',
  className,
  ...input
}: {
  label: string
  info?: ReactNode
  /** A line under the field that stays: what can be changed later. */
  note?: string
  error?: string
  className?: string
} & Omit<ComponentProps<typeof InputGroupInput>, 'className' | 'aria-invalid'>) {
  const { t } = useTranslation('common')
  const id = useId()
  const [shown, setShown] = useState(false)
  const password = type === 'password'
  const email = type === 'email'
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="mx-4 flex items-center gap-1.5">
        <label htmlFor={id} className="caps">
          {label}
        </label>
        {info === undefined ? null : <InfoTip name={label}>{info}</InfoTip>}
      </div>
      <InputGroup className="h-12 rounded-control border-border bg-card">
        <InputGroupInput
          id={id}
          type={password && shown ? 'text' : type}
          aria-invalid={error === undefined ? undefined : true}
          aria-describedby={error === undefined ? undefined : `${id}-error`}
          {...(email ? { autoComplete: 'email', autoCapitalize: 'off', spellCheck: false } : {})}
          {...input}
          className="pl-4 text-base md:text-base"
        />
        {password ? (
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              size="icon"
              aria-label={shown ? t('password.hide') : t('password.show')}
              aria-pressed={shown}
              onClick={() => setShown(!shown)}
            >
              {shown ? <EyeOff aria-hidden /> : <Eye aria-hidden />}
            </InputGroupButton>
          </InputGroupAddon>
        ) : null}
      </InputGroup>
      {note ? <p className="mx-4 text-[0.8125rem] text-muted-foreground">{note}</p> : null}
      {error === undefined ? null : (
        <Problem id={`${id}-error`} className="mx-4">
          {error}
        </Problem>
      )}
    </div>
  )
}
