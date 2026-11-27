"""The check of a made score against its printed sheet: each system of the sheet above the same system of ours, one
image per system, for reading voice by voice (MATCHING.md, the order). Needs pdftoppm and Pillow."""

import glob
import os
import subprocess
import sys
import tempfile

from PIL import Image

import spec as specs
from common import made_name, songs


def song(name):
    """A song's folder and its made score's path, from its folder name or its number (`2`, `men 1`)."""
    men = name.startswith('men ')
    key = name[4:] if men else name
    for sub, kind, tag, d, path in songs():
        if (kind == 'men') != men:
            continue
        if d == key or (key.isdigit() and d.split('.')[0].lstrip('0') == key.lstrip('0')):
            return path, made_name(path, tag)
    raise SystemExit(f'no song {name}')


def sheet_pdf(song_dir):
    """The song's printed sheet: the PDF named for its folder, else the one its match.txt names, else its only one."""
    own = os.path.join(song_dir, os.path.basename(song_dir) + '.pdf')
    if os.path.exists(own):
        return own
    m = os.path.join(song_dir, 'match.txt')
    if os.path.exists(m):
        first = open(m, encoding='utf-8').readline()
        for f in glob.glob(os.path.join(song_dir, '*.pdf')):
            if os.path.basename(f) in first:
                return f
    pdfs = sorted(glob.glob(os.path.join(song_dir, '*.pdf')))
    if not pdfs:
        raise SystemExit(f'{song_dir} has no PDF')
    return pdfs[0]


def straighten(im):
    """A scan's tilt undone: the angle whose rows are sharpest (the staff lines then run level)."""
    small = im.resize((im.size[0] // 3, im.size[1] // 3)).point(lambda v: 255 if v < 160 else 0)

    def score(a):
        r = small.rotate(a, resample=Image.BILINEAR, fillcolor=0)
        w, h = r.size
        rows = [sum(r.crop((0, y, w, y + 1)).getdata()) for y in range(h)]
        return sum(v * v for v in rows)

    best = max((a / 10 for a in range(-20, 21)), key=score)
    return im.rotate(best, resample=Image.BILINEAR, fillcolor=255) if best else im


def pages(pdf, dpi=170, only=None):
    """The PDF's pages as straightened greyscale images (only: one page, by its number, the others left out)."""
    d = tempfile.mkdtemp()
    span = ['-f', str(only), '-l', str(only)] if only else []
    subprocess.run(['pdftoppm', '-r', str(dpi), '-gray', '-png', *span, pdf, d + '/p'], check=True)
    return [straighten(Image.open(p).convert('L')) for p in sorted(glob.glob(d + '/p-*.png'))]


def staff_lines(im):
    """Each staff of a page as (top line, bottom line) in pixels."""
    w, h = im.size
    px = im.load()
    dark = [sum(1 for x in range(0, w, 3) if px[x, y] < 190) for y in range(h)]
    rows = [y for y in range(h) if dark[y] > (w / 3) * 0.30]
    groups = []
    for y in rows:
        if groups and y - groups[-1][-1] <= 3:
            groups[-1].append(y)
        else:
            groups.append([y])
    c = [sum(g) / len(g) for g in groups]
    out, i = [], 0
    while i + 4 < len(c):
        gaps = [c[i + k + 1] - c[i + k] for k in range(4)]
        if max(gaps) - min(gaps) < 4 and 6 < gaps[0] < 30:
            out.append((c[i], c[i + 4]))
            i += 5
        else:
            i += 1
    return out


def joined(im, upper, lower):
    """Whether two staves are one system: the bracket or the system's barline joins them at the left."""
    w, h = im.size
    px = im.load()
    y0, y1 = int(upper[1]) + 2, int(lower[0]) - 2
    if y1 <= y0:
        return True
    # the staves' left end: the first column dark across the upper staff's lines
    left = next((x for x in range(w // 2) if sum(px[x, int(upper[0]) + k] < 160 for k in range(0, int(upper[1] - upper[0]), 2)) >= 3), 0)
    for x in range(max(left - 40, 0), min(left + 6, w)):
        if sum(px[x, y] < 160 for y in range(y0, y1)) >= 0.9 * (y1 - y0):
            return True
    return False


def systems(im, n):
    """A page's n systems as images: staves joined at the left by a bracket or barline are one system; where that
    finds other than n, the staves are split at the n-1 widest gaps."""
    st = staff_lines(im)
    groups = []
    for a in st:
        if groups and joined(im, groups[-1][-1], a):
            groups[-1].append(a)
        else:
            groups.append([a])
    if len(groups) != n:
        gaps = sorted(range(1, len(st)), key=lambda i: st[i][0] - st[i - 1][1], reverse=True)[:n - 1]
        groups, cur = [], []
        for i, a in enumerate(st):
            if i in gaps:
                groups.append(cur)
                cur = []
            cur.append(a)
        groups.append(cur)
    out = []
    for k, s in enumerate(groups):
        top = s[0][0] - 2.6 * (s[0][1] - s[0][0])
        nxt = groups[k + 1][0][0] - 2.6 * (groups[k + 1][0][1] - groups[k + 1][0][0]) if k + 1 < len(groups) \
            else im.size[1] - 30
        out.append(im.crop((0, int(max(top, 0)), im.size[0], int(nxt))))
    return out


def compare(name, out=None):
    song_dir, made = song(name)
    systems_ = specs.read(song_dir)['systems']
    if not systems_:
        raise SystemExit('the song needs its systems in match.txt (the first bar of each line) to be compared')
    counts = [len(page) for page in systems_]
    out = out or tempfile.mkdtemp(prefix='choir-compare-')
    os.makedirs(out, exist_ok=True)
    for f in glob.glob(os.path.join(out, 'sys-*.png')):
        os.remove(f)
    ours = os.path.join(out, 'ours.pdf')
    subprocess.run(['mscore', made, '-o', ours], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    a_pages, b_pages = pages(sheet_pdf(song_dir)), pages(ours)
    if len(a_pages) != len(b_pages):
        print(f'pages: the sheet has {len(a_pages)}, ours {len(b_pages)}', file=sys.stderr)
    a = [s for p, n in zip(a_pages, counts) for s in systems(p, n)]
    b = [s for p, n in zip(b_pages, counts) for s in systems(p, n)]
    for i, (x, y) in enumerate(zip(a, b)):
        y = y.resize((x.size[0], int(y.size[1] * x.size[0] / y.size[0])))
        im = Image.new('L', (x.size[0], x.size[1] + y.size[1] + 6), 0)
        im.paste(x, (0, 0))
        im.paste(y, (0, x.size[1] + 6))
        im.save(os.path.join(out, f'sys-{i + 1:02d}.png'))
    print(f'{len(a)} systems of the sheet, {len(b)} of ours: {out}/sys-*.png (the sheet above, ours below)')
