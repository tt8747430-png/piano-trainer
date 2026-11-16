// Linear dataflow trace over Ghidra C of K/N enum initialisers.
// usage: node trace.js file.c startLine endLine globalsJSON
const fs=require('fs');const [,,file,a,b,gfile]=process.argv;
const lines=fs.readFileSync(file,'utf8').split('\n').slice(+a-1,+b);
const G=JSON.parse(fs.readFileSync(gfile)); // { "0x9bb360": ["names sorted"...], ...}
const val=new Map(); // var -> value
const arrays=new Map(); // stackoff -> {n, elems:[]}
let events=[];
function resolveExpr(e){e=e.trim();
 let m=e.match(/^\*\(undefined8 \*\)\(lRam0+([0-9a-f]+) \+ (0x[0-9a-f]+|\d+)\)$/);
 if(m){const g='0x'+m[1].replace(/^0+/,'');const off=parseInt(m[2]);if(G[g]){const i=(off-0x10)/8;return G[g].name+'.'+(G[g].values[i]??('?'+i))}return 'G'+g+'+'+m[2]}
 m=e.match(/^S(".*")$/);if(m)return 'S:'+JSON.parse(m[1]);
 if(val.has(e))return val.get(e);
 return null}
for(const raw of lines){const l=raw.trim();
 let m;
 // array header: puStack_XXXX = &UNK_007e54a3;
 if((m=l.match(/^p\w*Stack_([0-9a-f]+) = &UNK_007e54a3;/))){arrays.set(parseInt(m[1],16),{n:null,elems:[]});continue}
 if((m=l.match(/^uStack_([0-9a-f]+) = (\d+);/))&&arrays.has(parseInt(m[1],16)+8)){arrays.get(parseInt(m[1],16)+8).n=+m[2];}
 if((m=l.match(/^(\w+) = (.+);$/))){const lhs=m[1],rhs=m[2];const v=resolveExpr(rhs);
   if(v!==null){val.set(lhs,v);
     const sm=lhs.match(/^\w*Stack_([0-9a-f]+)$/);if(sm){const off=parseInt(sm[1],16);for(const [base,arr] of arrays){const idx=(base-0x10-off)/8;if(idx>=0&&Number.isInteger(idx)&&arr.n!==null&&idx<arr.n){arr.elems[idx]=v;arr.touched=true}}}
   } else val.delete(lhs);
   const am=rhs.match(/^func_0x0*([0-9a-f]+)\((.*)\)$/);
 }
 if((m=l.match(/^\*\(\w+ \*+\)\((\w+) \+ (0x[0-9a-f]+|\d+)\) = (.+);$/))){const v=resolveExpr(m[3]);events.push({t:'field',obj:m[1],off:m[2],v:v??m[3]})}
 if((m=l.match(/^(\w+)\[(0x[0-9a-f]+|\d+)\] = (.+);$/))){const v=resolveExpr(m[3]);events.push({t:'field',obj:m[1],off:'['+m[2]+']',v:v??m[3]})}
 if((m=l.match(/(func_0x[0-9a-f]+|_kfun_\w+)\(([^;]*)\)/))){const args=m[2].split(',').map(s=>s.trim());
   const out=args.map(x=>{const mm=x.match(/^&p\w*Stack_([0-9a-f]+)$/);if(mm&&arrays.has(parseInt(mm[1],16))){const arr=arrays.get(parseInt(mm[1],16));return '['+arr.elems.join(', ')+']'}const v=resolveExpr(x.replace(/^&/,''));return v??x});
   events.push({t:'call',f:m[1],args:out})}
}
for(const e of events){if(e.t=='call'){if(e.args.some(x=>/^\[|S:/.test(x)))console.log('CALL',e.f,e.args.join(' | '))}else if(/S:|Interval|\.|^0x|^\d/.test(e.v))console.log('FIELD',e.obj,e.off,'=',e.v)}
