import { Link, useSearch } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useKeyName } from '@/shared/i18n'
import { useSetSearch } from '@/shared/lib'
import {
  keyFromParam,
  keyParam,
  keyScale,
  keySignature,
  midi,
  noteName,
  noteParam,
  pitchClassOf,
  relativeKey,
  scaleChords,
  type Key,
  type KeyParam,
} from '@/shared/lib/music'
import { chordSounds } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'
import { ButtonLink, ChordButton, InfoTip, SettingsGroup } from '@/shared/ui'
import { KeyCircle } from '@/widgets/scale-explorer'
import { ToolPage } from '@/widgets/tool-page'

/** What the Circle of fifths shows: the key tapped, none at first. */
export interface CircleView {
  readonly key?: KeyParam
}

/** A key's seven triads, each to play: its symbol, its numeral, and its keys from the root up near middle C. */
function keyChords(key: Key) {
  return scaleChords(key.tonic, keyScale(key), 3).map((chord) => {
    const root = 48 + pitchClassOf(chord.root)
    return {
      symbol: `${noteName(chord.root)}${chord.suffix}`,
      numeral: chord.roman,
      keys: chord.tones.map((tone) => midi(root + tone.semitones)),
    }
  })
}

/**
 * The Circle of fifths (R29 B11), a tool of its own and never a key picker (D21–D22): the wheel large,
 * majors outside and their relative minors inside, each sector its key's signature. A sector tapped
 * names its key, its signature and its relative key, and lays out its seven chords as chips that
 * play; Open in Scales and keys opens that key there. The key tapped is the page's link (`?key=`).
 */
export function CircleOfFifthsPage() {
  const { t } = useTranslation(['practice', 'music'])
  const name = useKeyName()
  const view = useSearch({ from: '/shell/practice/circle-of-fifths' })
  const change = useSetSearch<CircleView>()
  const playback = usePlayback<string>()
  const key = view.key ? keyFromParam(view.key) : null
  const title = t('practice:pages.circleOfFifths')
  const count = key ? keySignature(key) : 0
  const signature =
    count === 0
      ? t('practice:tools.circle.noAccidentals')
      : count > 0
        ? t('practice:tools.circle.sharps', { count })
        : t('practice:tools.circle.flats', { count: -count })
  return (
    <ToolPage
      title={title}
      actions={
        <InfoTip name={title} bar>
          {t('practice:tools.circle.info')}
        </InfoTip>
      }
      controls={
        key ? (
          <SettingsGroup title={name(key)}>
            <div className="flex flex-col gap-4 p-4">
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-left">
                <dt className="text-muted-foreground">{t('practice:tools.circle.signature')}</dt>
                <dd className="font-semibold">{signature}</dd>
                <dt className="text-muted-foreground">{t('practice:tools.circle.relative')}</dt>
                <dd>
                  <button
                    type="button"
                    className="font-semibold text-primary underline-offset-4 hover:underline"
                    onClick={() => change({ key: keyParam(relativeKey(key)) })}
                  >
                    {name(relativeKey(key))}
                  </button>
                </dd>
              </dl>
              <section
                aria-label={t('practice:tools.circle.chords')}
                className="flex flex-col gap-2"
              >
                <h3 className="text-sm font-semibold text-muted-foreground">
                  {t('practice:tools.circle.chords')}
                </h3>
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
                  {keyChords(key).map((chord) => (
                    <ChordButton
                      key={chord.symbol}
                      symbol={chord.symbol}
                      numeral={chord.numeral}
                      playing={playback.playing === chord.symbol}
                      onClick={() =>
                        playback.toggle(chord.symbol, () =>
                          chordSounds(chord.keys, { arpeggio: false }),
                        )
                      }
                    />
                  ))}
                </div>
              </section>
              <ButtonLink
                variant="soft"
                className="self-start"
                render={
                  <Link
                    to="/practice/scales"
                    search={{
                      root: noteParam(key.tonic),
                      kind: key.minor ? 'natural' : 'major',
                      show: 'key',
                    }}
                  />
                }
              >
                {t('practice:tools.circle.open')}
              </ButtonLink>
            </div>
          </SettingsGroup>
        ) : (
          <p className="text-center text-muted-foreground">{t('practice:tools.circle.pick')}</p>
        )
      }
    >
      <KeyCircle
        label={t('practice:tools.circle.label')}
        value={key}
        onChoose={(chosen) => change({ key: keyParam(chosen) })}
        className="max-w-[min(32rem,calc(100dvh-14rem))]"
      />
      <p className="sr-only">{t('practice:tools.circle.majors')}</p>
    </ToolPage>
  )
}
