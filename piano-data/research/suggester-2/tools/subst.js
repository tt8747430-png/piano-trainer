const fs=require('fs');const S=process.env.S;const en=JSON.parse(fs.readFileSync(S+'/enums.json'));
const G={"0x9bb348":["GenericInterval",["Number1","Number10","Number11","Number12","Number13","Number2","Number3","Number4","Number5","Number6","Number7","Number8","Number9"]]};
for(const k in en){let e=en[k].entries;if(k=='music2.note.NoteEx')e=e.filter(x=>!['Good','Acceptable','Bad','VeryBad'].includes(x));G[en[k].globals[0]]=[k.split('.').slice(-1)[0]=='Category'?'Category':k.split('.').pop(),[...e].sort()]}
G["0x9bb480"]=["Diatonic",["Triad2","Triad3","Triad4","Triad5","Triad6","Triad7","Seventh1","Seventh2","Seventh3","Seventh4","Seventh5","Seventh6","Seventh7"]];
fs.writeFileSync(S+'/globals_all.json',JSON.stringify(G));
for(const f of process.argv.slice(2)){let c=fs.readFileSync(f,'utf8');
 c=c.replace(/\*\((?:undefined8|long) \*\)\(lRam0+(9b[0-9a-f]+) \+ (0x[0-9a-f]+|\d+)\)/g,(m,g,o)=>{const e=G['0x'+g];if(!e)return m;const i=(parseInt(o)-0x10)/8;return '<'+e[0]+'.'+(i==-1&&e[0]=='Diatonic'?'Triad1':(e[1][i]??'?'+i))+'>'});
 fs.writeFileSync(f.replace(/r\.c$/,'s.c'),c)}
// second pass: aliases
for(const f of process.argv.slice(2)){const fo=f.replace(/r\.c$/,'s.c');let lines=fs.readFileSync(fo,'utf8').split('\n');const alias={};
 for(let i=0;i<lines.length;i++){let l=lines[i];if(l.startsWith('// ====='))for(const k in alias)delete alias[k];
  let m=l.match(/^\s*(\w+) = lRam0+(9b[0-9a-f]+);/);
  l=l.replace(/\*\((?:undefined8|long) \*\)\((\w+) \+ (0x[0-9a-f]+|\d+)\)/g,(mm,v,o)=>{const g=alias[v];if(!g)return mm;const e=G[g];const idx=(parseInt(o)-0x10)/8;return '<'+e[0]+'.'+(idx==-1&&e[0]=='Diatonic'?'Triad1':(e[1][idx]??'?'+idx))+'>'});
  if(m&&G['0x'+m[2]])alias[m[1]]='0x'+m[2];else{const a=l.match(/^\s*(\w+) = /);if(a&&alias[a[1]])delete alias[a[1]]}
  lines[i]=l}
 fs.writeFileSync(fo,lines.join('\n'))}
