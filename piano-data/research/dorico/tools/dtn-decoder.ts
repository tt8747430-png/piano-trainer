/**
 * Decoder for Dorico .dtn files (score.dtn / scorelibrary.dtn inside a .dorico zip).
 * Produces a plain JS tree. Format: see dtn_decoder.py docstring.
 *   type 0 value | 1 empty array | 2 object | 3 array ; varints = unsigned LEB128
 *   Dorico 6 sets flag bits 0x40/0x80 on the type byte: mask with 0x03.
 */
export type DtnNode = { key: string; value?: string; array?: boolean; children?: DtnNode[] };

export function decodeDtn(buf: ArrayBuffer): DtnNode {
  const u8 = new Uint8Array(buf);
  const dv = new DataView(buf);
  const dec = new TextDecoder("utf-8");
  let o = 0;
  const u32 = () => { const v = dv.getUint32(o, true); o += 4; return v; };
  const strs = (): string[] => {
    const n = u32(); const out: string[] = [];
    for (let i = 0; i < n; i++) { const e = u8.indexOf(0, o); out.push(dec.decode(u8.subarray(o, e))); o = e + 1; }
    return out;
  };
  const varint = () => { let r = 0, s = 0, b: number; do { b = u8[o++]; r += (b & 0x7f) * 2 ** s; s += 7; } while (b >= 0x80); return r; };

  u32(); u32();                       // version (4), flag (1)
  const keys = strs(); const vals = strs();
  const n = u32();
  type Raw = { t: number; k: number; v?: number; ch?: number[] };
  const raw: Raw[] = new Array(n);
  for (let i = 0; i < n; i++) {
    const tb = u8[o++]; const t = tb & 0x03;      // high bits (0x40/0x80) are flags in Dorico 6 files
    if (tb & 0x3c) throw new Error(`unknown node type byte ${tb} at ${o - 1}`);
    const k = varint();
    if (t === 0 || t === 1) raw[i] = { t, k, v: varint() };
    else if (t === 2 || t === 3) { o++; const c = varint(); const ch: number[] = []; for (let j = 0; j < c; j++) ch.push(varint()); raw[i] = { t, k, ch }; }
    else throw new Error(`unknown node type ${t} at ${o - 1}`);
  }
  const build = (i: number): DtnNode => {
    const r = raw[i]; const key = keys[r.k];
    if (r.t === 0) return { key, value: vals[r.v!] };
    if (r.t === 1) return { key, array: true, children: [] };
    return { key, array: r.t === 3, children: r.ch!.map(build) };
  };
  return build(0);
}

/** Convert to plain JSON (objects; arrays where flagged; repeated keys -> arrays). */
export function toJson(node: DtnNode): unknown {
  if (node.children === undefined) return node.value;
  if (node.array) return node.children.map(c => ({ [c.key]: toJson(c) }));
  const obj: Record<string, unknown> = {};
  for (const c of node.children) {
    const v = toJson(c);
    if (c.key in obj) obj[c.key] = ([] as unknown[]).concat(obj[c.key], v); else obj[c.key] = v;
  }
  return obj;
}
