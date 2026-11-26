import createVerovioModule from 'verovio/wasm';
import { VerovioToolkit } from 'verovio/esm';
import { writeFileSync } from 'fs';
const tk = new VerovioToolkit(await createVerovioModule());
console.log('verovio', tk.getVersion());
tk.setOptions({ font: 'Bravura', pageWidth: 1200, adjustPageHeight: true, scale: 50 });
const mei = `<?xml version="1.0" encoding="UTF-8"?>
<mei xmlns="http://www.music-encoding.org/ns/mei" meiversion="5.0"><music><body><mdiv><score>
<scoreDef><staffGrp><staffDef n="1" lines="5" clef.shape="G" clef.line="2" meter.count="4" meter.unit="4" key.sig="0"/></staffGrp></scoreDef>
<section><measure n="1"><staff n="1"><layer n="1">
<chord xml:id="c1" dur="2"><note pname="c" oct="4"/><note pname="e" oct="4"/><note pname="g" oct="4"/></chord>
<chord xml:id="c2" dur="2"><note pname="e" oct="4"/><note pname="g" oct="4"/><note pname="c" oct="5"/></chord>
</layer></staff></measure></section></score></mdiv></body></music></mei>`;
if (!tk.loadData(mei)) throw new Error(tk.getLog());
const svg = tk.renderToSVG(1); writeFileSync('chord.svg', svg);
const midi = Buffer.from(tk.renderToMIDI(), 'base64'); writeFileSync('chord.mid', midi);
console.log('svg', svg.length, 'midi', midi.length, 'at 0ms', JSON.stringify(tk.getElementsAtTime(0)));
