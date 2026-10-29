import { Eye, EyeOff } from 'lucide-react'
import { useId, useState, type ComponentProps, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'
import { InfoTip } from './InfoTip'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from './primitives/input-group'

/**
 * A form's field (an email, a password, a name): its label over it, what it asks for in the ⓘ
 * beside the label where the label does not say, and what is wrong with it under it once it is.
 * A password field has Show beside it.
 */
export function FormField({
  label,
  info,
  error,
  type = 'text',
  className,
  ...input
}: {
  label: string
  info?: ReactNode
  error?: string
  className?: string
} & Omit<ComponentProps<typeof InputGroupInput>, 'className' | 'aria-invalid'>) {
  const { t } = useTranslation('common')
  const id = useId()
  const [shown, setShown] = useState(false)
  const password = type === 'password'
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <div className="flex items-center gap-1.5">
        <label htmlFor={id} className="text-sm text-muted-foreground">
          {label}
        </label>
        {info === undefined ? null : <InfoTip name={label}>{info}</InfoTip>}
      </div>
      <InputGroup className="h-12 rounded-2xl bg-card">
        <InputGroupInput
          id={id}
          type={password && shown ? 'text' : type}
          aria-invalid={error === undefined ? undefined : true}
          aria-describedby={error === undefined ? undefined : `${id}-error`}
          {...input}
          className="text-base"
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
      {error === undefined ? null : (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
