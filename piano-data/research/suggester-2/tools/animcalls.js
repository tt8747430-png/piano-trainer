const fs=require('fs');const {execFileSync}=require('child_process');
for(const f of process.argv.slice(2)){const L=fs.readFileSync(f,'utf8').split('\n');const res={};
 for(let i=0;i<L.length;i++){const m=L[i].match(/bl\s+0x[0-9a-f]+\s*;\s*_?(\$s7SwiftUI\S*(Animation|Spring|Transition|scale|withAnimation)\S*)/);if(!m)continue;
  // collect float immediates in previous 12 instrs
  const vals=[];const regs={};
  for(let j=Math.max(0,i-14);j<i;j++){let a=L[j].match(/fmov\s+(d\d+), #(-?[0-9.e+-]+)/);if(a)regs[a[1]]=a[2];a=L[j].match(/mov\s+(x\d+), #(0x[0-9a-f]+)/);if(a)regs[a[1]]=a[2];a=L[j].match(/movk\s+(x\d+), #(0x[0-9a-f]+), lsl #48/);if(a&&regs[a[1]]!==undefined){const v=BigInt(regs[a[1]])|(BigInt(a[2])<<48n);regs[a[1]]=v.toString()}a=L[j].match(/fmov\s+(d\d+), (x\d+)/);if(a&&regs[a[2]]){const b=Buffer.alloc(8);b.writeBigUInt64LE(BigInt(regs[a[2]]));regs[a[1]]=b.readDoubleLE(0).toString()}}
  const key=m[1];res[key]=res[key]||[];res[key].push(['d0','d1','d2'].map(r=>regs[r]??'?').join(','))}
 const keys=Object.keys(res);const dm=execFileSync('xcrun',['swift-demangle','--simplified'],{input:keys.join('\n')}).toString().split('\n');
 keys.forEach((k,i)=>console.log(f.split('/').pop()+'\t'+dm[i]+'\t'+[...new Set(res[k])].join(' | ')))}
