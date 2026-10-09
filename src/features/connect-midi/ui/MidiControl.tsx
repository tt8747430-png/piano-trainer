import type { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import { selectMidi, useSettings } from '@/entities/settings'
import { Button } from '@/shared/ui/primitives/button'
import { Spinner } from '@/shared/ui/primitives/spinner'
import { isMidiConnected, useMidiConnection, type MidiConnection } from '../use-midi-connection'

/** The connection in a line: the keyboard chosen by its name (connected, or not), else every one connected. */
function statusLine(
  connection: MidiConnection,
  chosen: string | null,
  t: TFunction<'common'>,
): string | null {
  if (connection.kind === 'unsupported') return t('midi.unsupported')
  if (connection.kind !== 'ready') return null
  const { status } = connection
  switch (status.state) {
    case 'connected':
      return t('midi.connected', { devices: chosen ?? status.devices.join(', ') })
    case 'away':
      return t('midi.away', { device: status.device })
    case 'denied':
      return t('midi.denied')
    case 'no-device':
      return t('midi.noDevice')
  }
}

/** The keyboard's status in one line, and the one action it needs (spec §7). */
export function MidiControl() {
  const { t } = useTranslation('common')
  const { connection, connect } = useMidiConnection()
  const { device } = useSettings(selectMidi)
  const line = statusLine(connection, device, t)
  return (
    <div className="flex flex-col gap-3">
      <p aria-live="polite" className="text-muted-foreground empty:sr-only">
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
