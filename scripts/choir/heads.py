"""Measures a printed sheet's noteheads, for writing a voice in from the sheet (`[Voice notes]` in match.txt): the
staff's lines are found on the straightened page and each head's pitch is named from where it sits between them.
`ruler` saves each staff with an x ruler, to find a note's x; `scan` walks a staff and prints each column of heads
with the barlines (stems and flags add noise: read it beside the sheet); given x values, it names the heads there.
The key's flats and sharps and the lengths are read from the sheet."""

import os

from PIL import ImageDraw

from compare import pages, sheet_pdf, song, staff_lines

LETTERS = 'CDEFGAB'


class Staff:
    def __init__(self, im, k):
        self.im, self.px = im, im.load()
        self.top, self.bot = staff_lines(im)[k - 1]
        self.sp = (self.bot - self.top) / 4
        self.lines = [self.top + i * self.sp for i in range(5)]
        # the choir's sheets: treble staves odd, bass staves even; (letter, octave) of the bottom line
        self.bottom = (2, 4) if k % 2 == 1 else (4, 2)

    def heads_at(self, x):
        px, sp, top, bot = self.px, self.sp, self.top, self.bot
        best = None
        for dx in range(-8, 9, 2):
            xx = x + dx
            dark = [y for y in range(int(top - 6 * sp), int(bot + 6 * sp))
                    if sum(px[a, y] < 140 for a in range(xx - 4, xx + 5)) >= 8
                    and all(abs(y - l) > 1.2 for l in self.lines)]
            # a head on a line is cut by it: pieces closer than a line's width are one
            runs = []
            for y in dark:
                if runs and y - runs[-1][-1] <= 5:
                    runs[-1].append(y)
                else:
                    runs.append([y])
            heads = [r for r in runs if sp * 0.6 <= r[-1] - r[0] + 1 <= sp * 3.2]
            if best is None or len(heads) > len(best):
                best = heads
        out = []
        for r in best:
            n_heads = max(1, round((r[-1] - r[0] + 1) / sp))
            for j in range(n_heads):
                cy = r[0] + (j + 0.5) * (r[-1] - r[0] + 1) / n_heads
                n = self.bottom[0] + round((bot - cy) / (sp / 2))
                if top - 5 * sp < cy < bot + 5 * sp:
                    out.append(f'{LETTERS[n % 7]}{self.bottom[1] + n // 7}')
        return out

    def barline(self, x):
        px, top, bot, sp = self.px, self.top, self.bot, self.sp
        return all(px[x, y] < 150 or px[x + 1, y] < 150 for y in range(int(top) + 2, int(bot) - 1)) and \
            px[x + 6, int(top + sp * 1.5)] > 150 and px[x - 6, int(top + sp * 1.5)] > 150

    def scan(self, start=150):
        seq, prev = [], None
        for x in range(start, self.im.size[0] - 20, 3):
            if self.barline(x):
                if not seq or seq[-1] != '|':
                    seq.append('|')
                prev = None
                continue
            hs = self.heads_at(x)
            if hs and hs != prev:
                seq.append(f"{'/'.join(hs)}@{x}")
            prev = hs or None
        return ' '.join(seq)

    def ruler(self, path):
        w = self.im.size[0]
        c = self.im.crop((0, int(self.top - 5 * self.sp), w, int(self.bot + 5 * self.sp))).convert('RGB')
        d = ImageDraw.Draw(c)
        for x in range(0, w, 50):
            d.line([(x, 0), (x, 12 if x % 100 else 24)], fill=(255, 0, 0), width=2)
            if x % 100 == 0:
                d.text((x + 3, 12), str(x), fill=(255, 0, 0))
        c.save(path)


def heads(name, page, staff, args, out=None):
    song_dir, _ = song(name)
    im = pages(sheet_pdf(song_dir), dpi=260, only=int(page))[0]
    st = Staff(im, int(staff))
    if args and args[0] == 'ruler':
        path = os.path.join(out or '.', f'staff-{page}-{staff}.png')
        st.ruler(path)
        print(path)
    elif args and args[0] != 'scan':
        for x in map(int, args):
            print(x, ' '.join(st.heads_at(x)))
    else:
        print(st.scan())

