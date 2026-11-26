import { Plug } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'
import { PanelPopover } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { isMidiConnected, useMidiConnection } from '../use-midi-connection'
import { MidiControl } from './MidiControl'

/**
 * The Player's MIDI button: a dot shows the status and the name says it (when pointed at too, as
 * every round button does); the popover connects. Hidden without Web MIDI. In the score's bar it
 * is a toolbar's button (`variant="tool"`, ADR 0115), elsewhere a screen bar's soft round one.
 */
export function MidiButton({ variant = 'bar' }: { variant?: 'bar' | 'tool' }) {
  const { t } = useTranslation('common')
  const { connection } = useMidiConnection()
  const [open, setOpen] = useState(false)
  if (connection.kind === 'unsupported') return null
  const connected = isMidiConnected(connection)
  const label = connected ? t('midi.labelConnected') : t('midi.label')
  return (
    <PanelPopover
      title={t('midi.label')}
      open={open}
      onOpenChange={setOpen}
      align="end"
      className="w-72"
      trigger={
        <Button variant={variant} size="icon" aria-label={label} title={label} className="relative">
          <Plug aria-hidden />
          <span
            aria-hidden
            className={cn(
              'absolute top-2 right-2 size-2 rounded-pill',
              connected ? 'bg-learned' : 'bg-border',
            )}
          />
        </Button>
      }
    >
      <MidiControl />
    </PanelPopover>
  )
}
