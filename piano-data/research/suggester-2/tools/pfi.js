// Extract numeric constants from Swift property initialisers (symbols ending in vpfi) in dyld_info -disassemble output
const fs=require('fs');const {execFileSync}=require('child_process');const L=fs.readFileSync(process.argv[2],'utf8').split('\n');
const res=[];let cur=null;let regs={};
function flush(){if(cur&&cur.vals.length)res.push(cur)}
for(const l of L){if(/^_\$s.*:$/.test(l)){flush();const n=l.slice(1,-1);cur=/vpfi$/.test(n)?{sym:n,vals:[]}:null;regs={};continue}
 if(!cur)continue;let m;
 if((m=l.match(/fmov\s+(d\d+), #(-?[0-9.e+-]+)/)))cur.vals.push(m[1]+'='+parseFloat(m[2]));
 else if((m=l.match(/mov\s+(x\d+), #(0x[0-9a-fA-F]+)/))){regs[m[1]]=BigInt(m[2])}
 else if((m=l.match(/movk\s+(x\d+), #(0x[0-9a-fA-F]+), lsl #(\d+)/))&&regs[m[1]]!==undefined){regs[m[1]]|=BigInt(m[2])<<BigInt(m[3])}
 else if((m=l.match(/fmov\s+(d\d+), (x\d+)/))&&regs[m[2]]!==undefined){const b=Buffer.alloc(8);b.writeBigUInt64LE(BigInt.asUintN(64,regs[m[2]]));cur.vals.push(m[1]+'='+b.readDoubleLE(0))}
 else if((m=l.match(/movi\s+d(\d+), #0/)))cur.vals.push('d'+m[1]+'=0')}
flush();
const dm=execFileSync('xcrun',['swift-demangle','--simplified'],{input:res.map(r=>r.sym).join('\n'),maxBuffer:1e8}).toString().split('\n');
res.forEach((r,i)=>console.log(dm[i].replace(/^variable initialization expression of /,'').replace(/ : .*$/,'')+'\t'+r.vals.join(' ')));
