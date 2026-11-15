import type { ParseKeys } from 'i18next'

/** A step of the guide: its words. */
export interface GuideStep {
  readonly key: ParseKeys<'settings'>
}

/**
 * How to use (ADR 0052): its parts in the order a learner meets them, each a few plain steps, its
 * words under `settings:howToUse.<part>`.
 */
export const GUIDE = [
  {
    id: 'songs',
    steps: [
      { key: 'howToUse.songs.library' },
      { key: 'howToUse.songs.folder' },
      { key: 'howToUse.songs.select' },
      { key: 'howToUse.songs.move' },
      { key: 'howToUse.songs.archive' },
      { key: 'howToUse.songs.favourite' },
    ],
  },
  {
    id: 'player',
    steps: [
      { key: 'howToUse.player.view' },
      { key: 'howToUse.player.transpose' },
      { key: 'howToUse.player.simplify' },
      { key: 'howToUse.player.sound' },
      { key: 'howToUse.player.loop' },
      { key: 'howToUse.player.wait' },
    ],
  },
  {
    id: 'learn',
    steps: [
      { key: 'howToUse.learn.sections' },
      { key: 'howToUse.learn.lessons' },
      { key: 'howToUse.learn.pass' },
      { key: 'howToUse.learn.learned' },
    ],
  },
  {
    id: 'editor',
    steps: [
      { key: 'howToUse.editor.open' },
      { key: 'howToUse.editor.modes' },
      { key: 'howToUse.editor.palette' },
      { key: 'howToUse.editor.transpose' },
    ],
  },
  {
    id: 'midi',
    steps: [
      { key: 'howToUse.midi.connect' },
      { key: 'howToUse.midi.settings' },
      { key: 'howToUse.midi.play' },
    ],
  },
  {
    id: 'metronome',
    steps: [
      { key: 'howToUse.metronome.open' },
      { key: 'howToUse.metronome.choose' },
      { key: 'howToUse.metronome.keys' },
    ],
  },
] as const satisfies readonly { id: string; steps: readonly GuideStep[] }[]

export type GuidePart = (typeof GUIDE)[number]
