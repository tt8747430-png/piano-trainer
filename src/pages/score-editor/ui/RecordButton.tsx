import { Circle } from 'lucide-react'
import { useEffect, useEffectEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { selectRoomLeft, useTakes } from '@/entities/take'
import { isMidiConnected, MidiControl, useMidiConnection } from '@/features/connect-midi'
import { FloatingBarButton } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/primitives/popover'
import { useScoreEditorContext } from '../model/editor-context'

/** A recorder's red dot, as every recorder's Record wears. */
const DOT = 'fill-current text-destructive'

/**
 * Record, the transport's last (ADR 0094, 0096, Dorico's): with a MIDI keyboard connected and room
 * in the takes, a tap counts in and records at once, no sheet first; else its popover says what it
 * needs: a MIDI keyboard, with the way to connect one (and Record there once one is), or room in
 * the takes. New song's Record arrives with it pressed (`asked`).
 */
export function RecordButton({ className }: { className?: string }) {
  const { t } = useTranslation('editor')
  const { takes } = useScoreEditorContext()
  const room = useTakes(selectRoomLeft)
  const { connection } = useMidiConnection()
  const connected = isMidiConnected(connection)
  const ready = connected && room > 0
  // Pressed as the editor opens (New song's Record), once: it records, or its popover says why not.
  const [open, setOpen] = useState(() => takes.asked && !ready)
  const press = () => {
    if (ready) takes.record()
    else setOpen(true)
  }
  const answer = useEffectEvent(() => {
    takes.answered()
    if (ready) takes.record()
  })
  useEffect(() => {
    if (takes.asked) answer()
  }, [takes.asked])
  return (
    <Popover open={open} onOpenChange={(opened) => (opened ? press() : setOpen(false))}>
      <PopoverTrigger
        render={
          <FloatingBarButton label={t('recorder.record')} className={className}>
            <Circle aria-hidden className={DOT} />
          </FloatingBarButton>
        }
      />
      <PopoverContent
        aria-label={t('recorder.record')}
        side="top"
        className="w-72 max-w-[calc(100vw-2rem)] gap-3 p-4 text-base"
      >
        {room === 0 ? (
          <p>{t('recorder.full')}</p>
        ) : (
          <>
            {connected ? null : <p>{t('recorder.needsMidi')}</p>}
            <MidiControl />
            {connected ? (
              <Button
                className="self-start"
                onClick={() => {
                  setOpen(false)
                  takes.record()
                }}
              >
                <Circle data-icon="inline-start" aria-hidden className={DOT} />
                {t('recorder.record')}
              </Button>
            ) : null}
          </>
        )}
      </PopoverContent>
    </Popover>
  )
}
