import { Eraser, ListMusic, Pause, Play } from 'lucide-react'
import { Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import { describeMidiData, type MidiLogEntry, type MidiLogMessage } from '@/shared/api/midi'
import { Button } from '@/shared/ui/primitives/button'
import { logClock, logKeyName, pedalDown } from '../model/log-words'
import { useMidiLog } from '../use-midi-devices'

/**
 * What the MIDI log says of a message: a key on or off by its name, a pedal down or up, another
 * controller, a program, a pitch bend, or its bytes; then its velocity or value and its channel.
 */
function wordsOf(message: MidiLogMessage, t: TFunction<'common'>): [string, string[]] {
  const channel =
    'channel' in message ? [t('midiSettings.log.channel', { channel: message.channel })] : []
  switch (message.kind) {
    case 'note-on':
    case 'note-off': {
      const note = logKeyName(message.key)
      return [
        message.kind === 'note-on'
          ? t('midiSettings.log.noteOn', { note })
          : t('midiSettings.log.noteOff', { note }),
        [t('midiSettings.log.velocity', { velocity: message.velocity }), ...channel],
      ]
    }
    case 'pedal': {
      const pedal = t(`midiSettings.log.pedals.${message.pedal}`)
      return [
        pedalDown(message.value)
          ? t('midiSettings.log.pedalDown', { pedal })
          : t('midiSettings.log.pedalUp', { pedal }),
        [t('midiSettings.log.value', { value: message.value }), ...channel],
      ]
    }
    case 'control':
      return [
        t('midiSettings.log.control', { controller: message.controller }),
        [t('midiSettings.log.value', { value: message.value }), ...channel],
      ]
    case 'program':
      return [t('midiSettings.log.program', { program: message.program }), channel]
    case 'pitch-bend':
      return [t('midiSettings.log.pitchBend', { value: message.value }), channel]
    case 'other':
      return [t('midiSettings.log.other', { bytes: message.bytes }), []]
  }
}

/** A message's row: what it is, then its velocity or value, channel and keyboard; its time at its end. */
function LogRow({ entry }: { entry: MidiLogEntry }) {
  const { t } = useTranslation('common')
  const [main, details] = wordsOf(describeMidiData(entry.data), t)
  const said = [...details, entry.device].filter(Boolean)
  return (
    <li className="flex items-start gap-3 py-2.5">
      <span className="min-w-0 flex-1">
        <span className="block font-semibold">{main}</span>
        {/* Each part whole on its line: a long line breaks between them, after their dot. */}
        <span className="block text-sm text-muted-foreground">
          {said.map((part, index) => (
            <Fragment key={index}>
              <span className="whitespace-nowrap">
                {part}
                {index < said.length - 1 ? ' ·' : null}
              </span>{' '}
            </Fragment>
          ))}
        </span>
      </span>
      <time className="shrink-0 pt-0.5 text-sm text-muted-foreground tabular-nums">
        {logClock(performance.timeOrigin + entry.time)}
      </time>
    </li>
  )
}

/**
 * The MIDI log: the last 200 messages the MIDI devices sent, newest first, live as they come, each
 * its words, its keyboard and its time. Pause holds the list still (the messages are still kept);
 * Clear empties it. With none yet, an empty state says to play.
 */
export function MidiLog() {
  const { t } = useTranslation('common')
  const { entries, clear } = useMidiLog()
  const [held, setHeld] = useState<readonly MidiLogEntry[] | null>(null)
  const shown = held ?? entries
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="soft"
          aria-pressed={held !== null}
          onClick={() => setHeld(held ? null : entries)}
        >
          {held ? <Play data-icon="inline-start" /> : <Pause data-icon="inline-start" />}
          {held ? t('midiSettings.log.resume') : t('midiSettings.log.pause')}
        </Button>
        <Button
          variant="soft"
          disabled={entries.length === 0}
          onClick={() => {
            clear()
            if (held) setHeld([])
          }}
        >
          <Eraser data-icon="inline-start" />
          {t('midiSettings.log.clear')}
        </Button>
      </div>
      <p aria-live="polite" className="-mb-1 text-sm text-pretty text-muted-foreground">
        {held ? t('midiSettings.log.paused') : t('midiSettings.log.count', { count: shown.length })}
      </p>
      <div className="card px-4 py-1.5">
        {shown.length === 0 ? (
          <p className="flex min-h-14 items-center gap-3 text-muted-foreground">
            <ListMusic aria-hidden className="size-5 shrink-0" />
            <span className="min-w-0 text-pretty">{t('midiSettings.log.empty')}</span>
          </p>
        ) : (
          <ol
            aria-label={t('midiSettings.log.label')}
            className="flex flex-col divide-y divide-hairline"
          >
            {[...shown].reverse().map((entry) => (
              <LogRow key={entry.id} entry={entry} />
            ))}
          </ol>
        )}
      </div>
    </div>
  )
}
