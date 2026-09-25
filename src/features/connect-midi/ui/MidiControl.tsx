import type { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/primitives/button'
import { Spinner } from '@/shared/ui/primitives/spinner'
import { isMidiConnected, useMidiConnection, type MidiConnection } from '../use-midi-connection'

function statusLine(connection: MidiConnection, t: TFunction<'common'>): string | null {
  switch (connection.kind) {
    case 'unsupported':
      return t('midi.unsupported')
    case 'ready':
      return connection.status.state === 'connected'
        ? t('midi.connected', { devices: connection.status.devices.join(', ') })
        : connection.status.state === 'denied'
          ? t('midi.denied')
          : t('midi.noDevice')
    default:
      return null
  }
}

/** The keyboard's status in one line, and the one action it needs (spec §7). */
export function MidiControl() {
  const { t } = useTranslation('common')
  const { connection, connect } = useMidiConnection()
  const line = statusLine(connection, t)
  return (
    <div className="flex flex-col gap-3">
      <p aria-live="polite" className="text-muted-foreground empty:hidden">
        {line}
      </p>
      {connection.kind === 'unsupported' || isMidiConnected(connection) ? null : (
        <Button
          variant="soft"
          onClick={connect}
          disabled={connection.kind === 'connecting'}
          className="self-start"
        >
          {connection.kind === 'connecting' ? <Spinner data-icon="inline-start" /> : null}
          {connection.kind === 'connecting'
            ? t('midi.connecting')
            : connection.kind === 'ready'
              ? t('midi.retry')
              : t('midi.connect')}
        </Button>
      )}
    </div>
  )
}
