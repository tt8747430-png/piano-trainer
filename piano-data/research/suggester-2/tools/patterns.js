const fs=require('fs');const c=fs.readFileSync(process.argv[2],'utf8');const parts=c.split(/^\/\/ ===== /m);
const D=['?','I','ii','iii','IV','V','vi','vii','I7','ii7','iii7','IV7','V7','vi7','vii7'];
for(const p of parts){if(!/ClassicPatternGroups\$2\.invoke|ClassicalGroup\$2\.invoke/.test(p.split('\n')[0]))continue;
 console.log('#### '+p.split('\n')[0].slice(0,80));
 for(let l of p.split('\n')){let out=[];
  let m;
  if((m=l.match(/LocalizedString#<init>\}\(\w+,S"([^"]+)"/)))out.push('\n== '+m[1]+':');
  if((m=l.match(/\[2\] = S"([A-Z0-9IJR][^"]*)"/)))out.push('\n== '+m[1]+' (no localisation):');
  if((m=l.match(/puRam0+9bb480\[(0x[0-9a-f]+|\d+)\]/)))out.push(D[+m[1]]);
  if((m=l.match(/<(ScaleDegree|ChordType|ChordRole)\.(\w+)>/)))out.push(m[1][5]=='D'?'deg:'+m[2]:m[1]=='ChordType'?'type:'+m[2]:'role:'+m[2]);
  if((m=l.match(/pattern_(Degree|DegreeOfMajor|Semitones|DiatonicTriad|DiatonicSeventh)_<init>/)))out.push('['+m[1]+']');
  if((m=l.match(/\+ 4\) = 0xffffffff/)))out.push('(oct-1)');
  if((m=l.match(/SemitoneValue.*?(\d+)/))&&false)out.push('semi');
  if(out.length)process.stdout.write(out.join(' ')+' ')}
 console.log()}
