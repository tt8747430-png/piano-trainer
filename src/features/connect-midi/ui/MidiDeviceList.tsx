import { Piano, Unplug, Usb } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { selectMidi, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setMidi } from '@/features/set-preference'
import type { MidiDevice } from '@/shared/api/midi'
import { cn } from '@/shared/lib'
import { Listbox } from '@/shared/ui'
import { useMidiDevices } from '../use-midi-devices'
import { useMidiInput } from '../use-midi-input'

/** A device's line in the list: its name, then its maker and what it does, or that it is away. */
function DeviceFace({
  icon: Icon,
  name,
  detail,
  away = false,
}: {
  icon: typeof Piano
  name: string
  detail: string
  away?: boolean
}) {
  return (
    <span className={cn('flex min-w-0 flex-1 items-center gap-3', away && 'text-muted-foreground')}>
      <span
        aria-hidden
        className="grid size-9 shrink-0 place-items-center rounded-xl bg-muted text-muted-foreground"
      >
        <Icon className="size-5" />
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="truncate font-semibold">{name}</span>
        <span className="truncate text-sm text-muted-foreground">{detail}</span>
      </span>
    </span>
  )
}

/**
 * The MIDI devices connected, as the MIDI screen lists them: Any keyboard (every one heard), then
 * each device by its name with its maker and what it has (keys, a speaker), the one heard checked;
 * choosing one hears it alone. A device chosen that is unplugged stays in the list, away. With none,
 * an empty state: an unplugged cable and one line.
 */
export function MidiDeviceList() {
  const { t } = useTranslation('common')
  const store = useSettingsStoreApi()
  const chosen = useSettings((state) => selectMidi(state).device)
  const devices = useMidiDevices()
  const { on } = useMidiInput()
  const keyboards = devices.filter((device) => device.input)
  const away = chosen !== null && !keyboards.some((device) => device.name === chosen)
  if (keyboards.length === 0 && !away)
    return (
      <p className="flex min-h-14 items-center gap-3 px-3.5 text-muted-foreground">
        <Unplug aria-hidden className="size-5 shrink-0" />
        <span className="min-w-0 text-pretty">
          {on ? t('midiSettings.devices.none') : t('midiSettings.devices.inputOff')}
        </span>
      </p>
    )
  const has = (device: MidiDevice) =>
    [
      device.manufacturer,
      device.input ? t('midiSettings.devices.keys') : '',
      device.output ? t('midiSettings.devices.speaker') : '',
    ]
      .filter(Boolean)
      .join(' · ')
  return (
    <Listbox
      label={t('midiSettings.devices.label')}
      optionClassName="min-h-16 rounded-2xl px-2 pr-3"
      groups={[
        {
          options: [
            {
              key: '',
              selected: chosen === null,
              content: (
                <DeviceFace
                  icon={Usb}
                  name={t('midiSettings.devices.any')}
                  detail={t('midiSettings.devices.anyDetail')}
                />
              ),
              onChoose: () => setMidi(store, { device: null }),
            },
            ...keyboards.map((device) => ({
              key: device.name,
              selected: device.name === chosen,
              content: <DeviceFace icon={Piano} name={device.name} detail={has(device)} />,
              onChoose: () => setMidi(store, { device: device.name }),
            })),
            ...(away && chosen !== null
              ? [
                  {
                    key: chosen,
                    selected: true,
                    content: (
                      <DeviceFace
                        icon={Piano}
                        name={chosen}
                        detail={t('midiSettings.devices.away')}
                        away
                      />
                    ),
                    onChoose: () => {},
                  },
                ]
              : []),
          ],
        },
      ]}
    />
  )
}
