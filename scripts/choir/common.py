"""What every step of the choir builder shares: where the songs are, the choirs and their voices, note values,
MuseScore and its files."""

import json
import os
import re
import subprocess
import tempfile
import unicodedata
import xml.etree.ElementTree as ET
import zipfile
from fractions import Fraction

ROOT = 'piano-data/scores/hymns/choir/musescore'
TEMPLATE = os.path.join(ROOT, 'template')
# Each choir's folder, its kind and the tag its made score carries in its name.
CHOIRS = [('Cântări corul mixt', 'mixed', 'SATB'), ('Cântări corul bărbătesc', 'men', 'TTBB')]

# Each choir's voices top to bottom: name, abbreviation, the clef of its own part (sign, line, octave change), and
# the middle of its range as it sounds (MIDI): a part whose notes average an octave away is moved there.
VOICES = {
    'mixed': [('Soprano', 'S.', ('G', 2, 0), 69), ('Alto', 'A.', ('G', 2, 0), 63), ('Tenor', 'T.', ('G', 2, -1), 58),
              ('Bass', 'B.', ('F', 4, 0), 50)],
    'men': [('Tenor 1', 'T. 1', ('G', 2, -1), 61), ('Tenor 2', 'T. 2', ('G', 2, -1), 57),
            ('Baritone', 'Bar.', ('F', 4, 0), 52), ('Bass', 'B.', ('F', 4, 0), 47)],
}
ORDER = {kind: [v[0] for v in vs] for kind, vs in VOICES.items()}
SHORT = {v[0]: v[1] for vs in VOICES.values() for v in vs}
VOICE_NAMES = list(dict.fromkeys(n for names in ORDER.values() for n in names))

STEPS = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}
# MuseScore's note values as fractions of a whole note, and MusicXML's names for 1/n.
DURATIONS = {'whole': Fraction(1), 'half': Fraction(1, 2), 'quarter': Fraction(1, 4), 'eighth': Fraction(1, 8),
             '16th': Fraction(1, 16), '32nd': Fraction(1, 32), 'breve': Fraction(2)}
TYPES = {1: 'whole', 2: 'half', 4: 'quarter', 8: 'eighth', 16: '16th', 32: '32nd'}

# A voice named in a file's name (the choir's own spellings, in Romanian or English).
FILE_VOICES = [('Soprano', r'sopran'), ('Alto', r'\balt'), ('Tenor 1', r'tenor ?_?1'), ('Tenor 2', r'tenor ?_?2'),
               ('Tenor', r'tenor(?! ?_?[12])'), ('Baritone', r'bariton'), ('Bass', r'\bbas\b|\bbass\b|\bbasul\b'),
               ('All voices', r'toate vocile|all voices|toate')]


def plain(s):
    return ''.join(c for c in unicodedata.normalize('NFD', s.lower()) if unicodedata.category(c) != 'Mn')


def voices_of(name):
    """The voices a file's name says it holds."""
    p = plain(name)
    return [v for v, rx in FILE_VOICES if re.search(rx, p)]


def midi(note):
    """A MusicXML note's pitch as MIDI, or None for a rest."""
    p = note.find('pitch')
    if p is None:
        return None
    return 12 * (int(p.findtext('octave')) + 1) + STEPS[p.findtext('step')] + int(float(p.findtext('alter') or 0))


def songs(wanted=()):
    """Every song folder: (choir folder, kind, tag, folder name, path), in order; only the wanted ones if named."""
    for sub, kind, tag in CHOIRS:
        base = os.path.join(ROOT, sub)
        for d in sorted(os.listdir(base)):
            path = os.path.join(base, d)
            if os.path.isdir(path) and (not wanted or d in wanted):
                yield sub, kind, tag, d, path


def made_name(song_dir, tag):
    """The made score's path in a song's folder: `<folder name> (SATB).mscz`."""
    return os.path.join(song_dir, f'{os.path.basename(song_dir)} ({tag}).mscz')


def song_files(song_dir):
    """A song's MuseScore files, its backups left out."""
    out = []
    for dp, dn, fn in os.walk(song_dir):
        dn[:] = [d for d in dn if d != '.mscbackup']
        out += [os.path.join(dp, f) for f in fn if f.endswith(('.mscz', '.mscx'))]
    return sorted(out)


def mscore_job(pairs):
    """Converts many files in one MuseScore run; returns the outputs that were written."""
    if not pairs:
        return []
    with tempfile.NamedTemporaryFile('w', suffix='.json', delete=False) as f:
        json.dump([{'in': a, 'out': b} for a, b in pairs], f)
    subprocess.run(['mscore', '-j', f.name], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=3600)
    os.unlink(f.name)
    # A file MuseScore cannot read ends the whole job: what it left undone is converted one file at a time.
    for a, b in pairs:
        if not (os.path.exists(b) and os.path.getsize(b) > 0):
            subprocess.run(['mscore', a, '-o', b], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=600)
    return [b for a, b in pairs if os.path.exists(b) and os.path.getsize(b) > 0]


def read_mscz(path):
    with zipfile.ZipFile(path) as z:
        return {n: z.read(n) for n in z.namelist()}


def write_mscz(path, files, order):
    """A MuseScore file from its members, written in `order` (the container last)."""
    tmp = path + '.tmp'
    with zipfile.ZipFile(tmp, 'w', zipfile.ZIP_DEFLATED) as z:
        for n in order:
            z.writestr(n, files[n])
    os.replace(tmp, path)


def main_name(files):
    """The main score's member in a MuseScore file."""
    return next(n for n in files if n.endswith('.mscx') and '/' not in n)


def xml_bytes(root):
    return b'<?xml version="1.0" encoding="UTF-8"?>\n' + ET.tostring(root, encoding='utf-8')


def write_xml(root, path):
    ET.indent(root)
    with open(path, 'wb') as fh:
        fh.write(xml_bytes(root))


def set_text(parent, tag, text):
    el = parent.find(tag)
    if el is None:
        el = ET.SubElement(parent, tag)
    el.text = text


def hide(el):
    """An element of the score left unprinted (it still plays)."""
    v = el.find('visible')
    if v is None:
        v = ET.Element('visible')
        el.insert(0, v)
    v.text = '0'


def staves(score):
    """The main score's staves that hold music (not their definitions inside each Part)."""
    return [s for s in score.findall('Staff') if s.find('Measure') is not None]


def voice_of(p):
    """A voice's index in its MuseScore staff, from its MusicXML voice number."""
    return (int(p['voice']) - 1) % 4


def find_voice(info, name):
    """A voice's place in the score, by name."""
    return next(x for x in info if x['name'] == name.strip())
