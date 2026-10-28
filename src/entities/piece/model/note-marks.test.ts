import { describe, expect, it } from 'vitest'
import { midi, note } from '@/shared/lib/music'
import { readMarks, writeMarks } from './note-marks'

describe('readMarks', () => {
  it('reads articulations, which may join, in the order written', () => {
    expect(readMarks('acc,stacc')).toEqual({ articulations: ['accent', 'staccato'] })
    expect(readMarks('ten,marc,ferm,staccatiss')).toEqual({
      articulations: ['tenuto', 'marcato', 'fermata', 'staccatissimo'],
    })
  })

  it('reads an ornament, a roll, slurs, an octave line, a dynamic and a hairpin', () => {
    expect(readMarks('tr,arp,(,8va,mf,cresc')).toEqual({
      ornament: 'trill',
      arpeggio: true,
      slurStart: true,
      octave: '8va',
      dynamic: 'mf',
      hairpin: 'cresc',
    })
    expect(readMarks('),lmord,8vb,/hairpin')).toEqual({
      slurEnd: true,
      ornament: 'lower-mordent',
      octave: '8vb',
      hairpin: 'end',
    })
  })

  it('reads Flat’s other marks: 15ma and 15mb, a glissando, portato, a breath and a caesura, an inverted turn, a tremolo’s strokes', () => {
    expect(readMarks('15ma,gliss')).toEqual({ octave: '15ma', glissando: true })
    expect(readMarks('15mb')).toEqual({ octave: '15mb' })
    expect(readMarks('port,breath')).toEqual({ articulations: ['portato', 'breath'] })
    expect(readMarks('caes,iturn')).toEqual({
      articulations: ['caesura'],
      ornament: 'inverted-turn',
    })
    expect(readMarks('trem1')).toEqual({ ornament: 'tremolo-1' })
    expect(readMarks('trem3')).toEqual({ ornament: 'tremolo-3' })
    expect(readMarks('trem')).toBeNull()
    expect(readMarks('gliss,gliss')).toBeNull()
  })

  it('reads a tempo mark, a swing mark, a Roman numeral and free text', () => {
    expect(readMarks('tempo:96,swing8')).toEqual({ tempo: 96, swing: 'eighths' })
    expect(readMarks('swing16')).toEqual({ swing: 'sixteenths' })
    expect(readMarks('straight')).toEqual({ swing: 'straight' })
    expect(readMarks('rn:V7/ii')).toEqual({ numeral: 'V7/ii' })
    expect(readMarks('txt:con%20brio%2C%20ma')).toEqual({ text: 'con brio, ma' })
    expect(readMarks('tempo:0')).toBeNull()
    expect(readMarks('tempo:x')).toBeNull()
    expect(readMarks('rn:Q')).toBeNull()
    expect(readMarks('txt:')).toBeNull()
  })

  it('reads every dynamic Flat has, from ppp to fff and the accents', () => {
    for (const dynamic of [
      'ppp',
      'fff',
      'sfz',
      'sffz',
      'fp',
      'sfp',
      'sfpp',
      'rfz',
      'rf',
      'fz',
      'sf',
      'pf',
    ])
      expect(readMarks(dynamic)).toEqual({ dynamic })
    expect(readMarks('ppp,fff')).toBeNull()
  })

  it('reads an expression written over the note, and the pedal pressed, let up or changed there', () => {
    expect(readMarks('dolce,ped')).toEqual({ expression: 'dolce', pedal: 'down' })
    expect(readMarks('rit,pedup')).toEqual({ expression: 'rit', pedal: 'up' })
    expect(readMarks('atempo,pedch')).toEqual({ expression: 'a-tempo', pedal: 'change' })
    expect(readMarks('dolce,legato')).toBeNull()
    expect(readMarks('ped,pedup')).toBeNull()
  })

  it('reads grace notes with their pitches as written', () => {
    expect(readMarks('gr:D5+E5')).toEqual({
      grace: [
        { midi: midi(74), spelled: note('D') },
        { midi: midi(76), spelled: note('E') },
      ],
    })
  })

  it('reads an appoggiatura’s grace notes, unslashed, and writes them back so', () => {
    const marks = readMarks('app:D5')
    expect(marks).toEqual({ grace: [{ midi: midi(74), spelled: note('D'), appoggiatura: true }] })
    expect(marks && writeMarks(marks)).toBe('app:D5')
  })

  it.each(['', 'nope', 'tr,mord', 'p,f', '8va,8vb', 'gr:', 'gr:Q5', 'acc,acc', 'cresc,dim'])(
    'reads %j as no marks: unknown, empty or one of a kind twice',
    (text) => {
      expect(readMarks(text)).toBeNull()
    },
  )
})

describe('writeMarks', () => {
  it('writes the new marks as it reads them', () => {
    const text = 'port,caes,iturn,15mb,gliss,sffz'
    expect(writeMarks(readMarks(text) ?? {})).toBe(text)
    const words = 'tempo:72,swing16,rn:ii7,txt:a%20b%5D'
    expect(writeMarks(readMarks(words) ?? {})).toBe(words)
    expect(readMarks(writeMarks({ text: 'a, [b] 100%' }))).toEqual({ text: 'a, [b] 100%' })
  })

  it('writes every kind in one order, which reads back as it was', () => {
    const marks = readMarks('cresc,8va,gr:D5,),tr,acc,stacc,(,p,arp,ped,espress')
    expect(marks && writeMarks(marks)).toBe('acc,stacc,tr,arp,(,),8va,p,cresc,espress,ped,gr:D5')
    expect(readMarks(marks ? writeMarks(marks) : '')).toEqual(marks)
  })
})
