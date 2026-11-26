"""The house style (template/house.mss) put into a made score's style and each part's, with what the song's sheet
asks of it in match.txt."""

import os
import re
import xml.etree.ElementTree as ET

from common import TEMPLATE

HOUSE_MSS = os.path.join(TEMPLATE, 'house.mss')


def house():
    """The template's values, by name."""
    return {el.tag: el.text or '' for el in ET.parse(HOUSE_MSS).getroot().find('Style')}


def values(spec=None):
    """The house values, with the song's own: its staff space and words' size where the house size cannot keep its
    pages, every bar numbered, a footer, empty staves hidden."""
    v = house()
    if not spec:
        return v
    if spec.get('spatium'):
        v['spatium'] = spec['spatium']
    if spec.get('lyrics_size'):
        v['lyricsOddFontSize'] = v['lyricsEvenFontSize'] = spec['lyrics_size']
    if spec.get('bar_numbers') == 'every':
        v['measureNumberSystem'] = '0'
        v['measureNumberInterval'] = '1'
    if spec.get('footer'):
        v['showFooter'] = '1'
        for side in ('odd', 'even'):
            v[f'{side}FooterC'] = spec['footer']
            v[f'{side}FooterL'] = ''
            v[f'{side}FooterR'] = ''
    if spec.get('hide_empty'):
        v['hideEmptyStaves'] = '1'
        v['dontHideStavesInFirstSystem'] = '1'
    return v


def apply(data, spec=None):
    """A style file (.mss) made the house's."""
    text = data.decode('utf-8')
    for k, v in values(spec).items():
        text, n = re.subn(rf'<{k}>[^<]*</{k}>', f'<{k}>{v}</{k}>', text)
        if not n:
            text = text.replace('</Style>', f'  <{k}>{v}</{k}>\n    </Style>')
    return text.encode('utf-8')
