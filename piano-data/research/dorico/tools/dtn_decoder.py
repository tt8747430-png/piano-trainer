"""Decoder for Dorico .dtn files (score.dtn / scorelibrary.dtn inside a .dorico zip).

Format (little-endian):
  u32 version (4) | u32 1
  u32 nKeys, nKeys NUL-terminated UTF-8 key names
  u32 nVals, nVals NUL-terminated UTF-8 values (all scalars stored as strings)
  u32 nNodes, then nNodes nodes; node 0 is the root. Varints are unsigned LEB128.
    type 0 (value):       u8 0, varint key, varint valueIndex
    type 1 (empty array): u8 1, varint key, varint 0
    type 2 (object):      u8 2, varint key, u8 flag, varint count, count x varint childNodeIndex
    type 3 (array):       u8 3, varint key, u8 flag, varint count, count x varint childNodeIndex
  The type byte's high bits (0x40, 0x80) are flags set by Dorico 6; mask with 0x03 for the type.
"""
import struct, sys
from xml.sax.saxutils import escape

def load(path):
    d = open(path, 'rb').read()
    def rd_strs(o):
        n = struct.unpack('<I', d[o:o+4])[0]; o += 4; out = []
        for _ in range(n):
            e = d.index(b'\0', o); out.append(d[o:e].decode('utf-8', 'replace')); o = e + 1
        return out, o
    version = struct.unpack('<I', d[:4])[0]
    keys, o = rd_strs(8)          # d[4:8] = 1 (unknown flag)
    vals, o = rd_strs(o)
    def varint(o):
        r = s = 0
        while True:
            b = d[o]; o += 1; r |= (b & 0x7f) << s; s += 7
            if b < 0x80: return r, o
    n = struct.unpack('<I', d[o:o+4])[0]; o += 4
    nodes = []
    for _ in range(n):
        tb = d[o]; o += 1
        t = tb & 0x03          # low 2 bits = node type; high bits are flags (0x40 seen in Dorico 6 files)
        if tb & 0x3C: raise ValueError(f'unknown node type byte {tb:#x} at {o-1}')
        k, o = varint(o)
        if t in (0, 1):
            v, o = varint(o); nodes.append((t, k, v))
        elif t in (2, 3):
            flag = d[o]; o += 1
            c, o = varint(o); ch = []
            for _ in range(c):
                x, o = varint(o); ch.append(x)
            nodes.append((t, k, flag, ch))
        else:
            raise ValueError(f'unknown node type {t} at {o-1}')
    assert o == len(d), (o, len(d))
    return version, keys, vals, nodes

def to_xml(path, out):
    version, keys, vals, nodes = load(path)
    w = open(out, 'w', encoding='utf-8')
    w.write(f'<?xml version="1.0" encoding="UTF-8"?>\n<!-- decoded from {path.split("/")[-1]} (dtn v{version}) -->\n')
    def emit(i, depth):
        nd = nodes[i]; ind = '  ' * depth; tag = keys[nd[1]]
        if nd[0] == 0:
            w.write(f'{ind}<{tag}>{escape(vals[nd[2]])}</{tag}>\n')
        elif nd[0] == 1:
            w.write(f'{ind}<{tag} array="true"/>\n')
        else:
            attr = ' array="true"' if nd[0] == 3 else ''
            if not nd[3]:
                w.write(f'{ind}<{tag}{attr}/>\n'); return
            w.write(f'{ind}<{tag}{attr}>\n')
            for c in nd[3]: emit(c, depth + 1)
            w.write(f'{ind}</{tag}>\n')
    emit(0, 0); w.close()
    return len(nodes)

if __name__ == '__main__':
    print(to_xml(sys.argv[1], sys.argv[2]), 'nodes')
