"""
Writes the app's text accidentals, `src/styles/fonts/text-accidentals.woff2`: Noto Music's ♭ ♮ ♯ 𝄪
𝄫, each scaled and raised to stand in a line of text by the capitals, as a book sets a chord's sign
(`C♯m7`, `B♭`), and its thin stems thickened to weigh as the letters beside it. Neither of the app's
faces has them, and the music font draws them for a staff: a sharp centred on its note's line, low,
small and light beside a letter. Both faces take them from this one (`--font-sans`, `--font-display`
in `src/styles/theme.css`).

Run from the repository, with fontTools and brotli installed (`pip install fonttools brotli`):

    python3 scripts/text-accidentals.py

Noto Music is under the SIL Open Font License 1.1 (https://openfontlicense.org), which this font
keeps, with Noto Music's copyright, in its names.
"""

from pathlib import Path

from fontTools.pens.transformPen import TransformPen
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.subset import Options, Subsetter
from fontTools.ttLib import TTFont
from fontTools.ttLib.tables._g_l_y_f import flagOverlapSimple

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / 'node_modules/@fontsource/noto-music/files/noto-music-music-400-normal.woff2'
OUT = ROOT / 'src/styles/fonts/text-accidentals.woff2'
FAMILY = 'Text Accidentals'

# Each sign's scale and how far it is raised, a share of the em. The faces' capitals stand 0.70 high:
# the sharp and the natural centred a little under their middle, the flats' bowls on the baseline and
# their stems by the capitals' tops, the double sharp by the small letters.
SIGNS = {
    0x266D: (1.15, 0.04),  # ♭
    0x266E: (1.2, 0.17),  # ♮
    0x266F: (1.14, 0.2),  # ♯
    0x1D12A: (1.15, 0.12),  # 𝄪
    0x1D12B: (1.15, 0.04),  # 𝄫
}

# How much each sign's stems are thickened, a share of the em: the sign is drawn again this far to its
# right, so its upright strokes (a sharp's are a hairline in the music font) weigh as the semibold
# letters a chord symbol is set in, and not too much beside a regular word.
WEIGHT = 0.024

# The line the signs take, a share of the em: room for each, and no more than the faces' own, so a
# line holding one is no taller than one without.
ASCENT = 0.9
DESCENT = 0.25


def subset(font: TTFont) -> None:
    options = Options()
    options.hinting = False
    options.layout_features = []
    options.name_IDs = ['*']
    options.drop_tables += ['GSUB', 'GPOS', 'GDEF']
    subsetter = Subsetter(options)
    subsetter.populate(unicodes=list(SIGNS))
    subsetter.subset(font)


def set_for_text(font: TTFont) -> None:
    em = font['head'].unitsPerEm
    cmap = font.getBestCmap()
    glyf = font['glyf']
    hmtx = font['hmtx']
    glyphs = font.getGlyphSet()
    weight = round(WEIGHT * em)
    for code, (scale, lift) in SIGNS.items():
        name = cmap[code]
        pen = TTGlyphPen(glyphs)
        for shift in (0, weight):
            glyphs[name].draw(TransformPen(pen, (scale, 0, 0, scale, shift, round(lift * em))))
        glyph = pen.glyph()
        # Its two drawings overlap: every renderer fills them as one, and the flag tells macOS's.
        glyph.flags[0] |= flagOverlapSimple
        glyph.recalcBounds(glyf)
        advance, _ = hmtx[name]
        glyf[name] = glyph
        hmtx[name] = (round(advance * scale) + weight, glyph.xMin)
    ascent, descent = round(ASCENT * em), round(DESCENT * em)
    hhea, os2 = font['hhea'], font['OS/2']
    hhea.ascent, hhea.descent, hhea.lineGap = ascent, -descent, 0
    os2.sTypoAscender, os2.sTypoDescender, os2.sTypoLineGap = ascent, -descent, 0
    os2.usWinAscent, os2.usWinDescent = ascent, descent


def name(font: TTFont) -> None:
    names = font['name']
    copyright = names.getDebugName(0)
    names.names = []
    for id, text in {
        0: copyright,
        1: FAMILY,
        2: 'Regular',
        3: f'1.000;{FAMILY.replace(" ", "")}-Regular',
        4: FAMILY,
        5: 'Version 1.000; Noto Music 2.003 set for text',
        6: f'{FAMILY.replace(" ", "")}-Regular',
        10: "Noto Music's flat, natural, sharp, double sharp and double flat, set for text.",
        13: 'This Font Software is licensed under the SIL Open Font License, Version 1.1.',
        14: 'https://openfontlicense.org',
    }.items():
        names.setName(text, id, 3, 1, 0x409)
    font['head'].fontRevision = 1.0


def main() -> None:
    # Its date Noto Music's: the same font written again is the same file.
    font = TTFont(SOURCE, recalcTimestamp=False)
    subset(font)
    set_for_text(font)
    name(font)
    font.flavor = 'woff2'
    font.save(OUT)
    print(f'Wrote {OUT.relative_to(ROOT)}')


if __name__ == '__main__':
    main()
