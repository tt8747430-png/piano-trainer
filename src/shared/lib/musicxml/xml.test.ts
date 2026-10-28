import { describe, expect, it } from 'vitest'
import { childAt, childrenOf, numberAt, parseXml, tag, textAt, textOf, XmlError } from './xml'

describe('parseXml', () => {
  it('reads elements, attributes and text, past the declaration, the doctype and comments', () => {
    const root = parseXml(
      `\uFEFF<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 4.0 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd" [ <!ENTITY x "y"> ]>
<!-- made by hand -->
<score-partwise version='4.0'>
  <work><work-title>Tom &amp; Jerry &#233;&#x41;</work-title></work>
  <part id="P1"><measure number="1"/><measure number="2"><![CDATA[<raw>]]></measure></part>
</score-partwise>`,
    )
    expect(root.name).toBe('score-partwise')
    expect(root.attrs).toEqual({ version: '4.0' })
    expect(textAt(root, 'work', 'work-title')).toBe('Tom & Jerry éA')
    const measures = childrenOf(childAt(root, 'part')!, 'measure')
    expect(measures.map((m) => m.attrs.number)).toEqual(['1', '2'])
    expect(textOf(measures[1])).toBe('<raw>')
  })

  it('reads numbers, none where there is none', () => {
    const root = parseXml('<a><b>480</b><c>x</c></a>')
    expect(numberAt(root, 'b')).toBe(480)
    expect(numberAt(root, 'c')).toBeUndefined()
    expect(numberAt(root, 'd')).toBeUndefined()
  })

  it('refuses what is not well formed', () => {
    expect(() => parseXml('not xml')).toThrow(XmlError)
    expect(() => parseXml('<a><b></a>')).toThrow(XmlError)
    expect(() => parseXml('<a>')).toThrow(XmlError)
  })
})

describe('tag', () => {
  it('writes an element, its text escaped, empty as one tag', () => {
    expect(tag('a', { x: 'say "hi"', y: undefined }, 'R&B')).toBe(
      '<a x="say &quot;hi&quot;">R&B</a>',
    )
    expect(tag('b')).toBe('<b/>')
  })
})
