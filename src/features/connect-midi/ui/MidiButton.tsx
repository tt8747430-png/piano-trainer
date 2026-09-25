import { Cable } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/primitives/popover'
import { Button } from '@/shared/ui/primitives/button'
import { useMidiConnection } from '../use-midi-connection'
import { MidiControl } from './MidiControl'

/** The Player's MIDI button: a dot shows the status; the popover connects. Hidden without Web MIDI. */
export function MidiButton() {
  const { t } = useTranslation('common')
  const { connection } = useMidiConnection()
  if (connection.kind === 'unsupported') return null
  const connected = connection.kind === 'ready' && connection.status.state === 'connected'
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="surface" size="icon" aria-label={t('midi.label')} className="relative" />
        }
      >
        <Cable aria-hidden />
        <span
          aria-hidden
          className={cn(
            'absolute top-2 right-2 size-2 rounded-full',
            connected ? 'bg-primary' : 'bg-border',
          )}
        />
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 rounded-3xl p-4">
        <p className="mb-2 font-semibold">{t('midi.label')}</p>
        <MidiControl />
      </PopoverContent>
    </Popover>
  )
}
