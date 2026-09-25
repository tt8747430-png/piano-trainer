import { definePiece } from '../../model/types'

export default definePiece({
  id: 'flow',
  kind: 'progression',
  title: 'I–vi–IV–V',
  key: 'F',
  meter: '4/4',
  tempo: 72,
  pattern: 'flow',
  voicing: { default: 'triads', choosable: true },
  progression: 'I:maj:4 vi:min:4 IV:maj:4 V:dom:4',
  note: {
    en: 'From the Chord Flow sheet: the left hand stays on the bass while the right hand moves through the key’s primary triads (I, IV, V) over every chord.',
    ru: 'Из листа Chord Flow: левая рука остаётся на басу, а правая над каждым аккордом движется по главным трезвучиям тональности (I, IV, V).',
  },
})
