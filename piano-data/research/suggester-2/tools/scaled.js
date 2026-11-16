const fs=require('fs');const {execFileSync}=require('child_process');const [,,bin,dis]=process.argv;
const fx=execFileSync('dyld_info',['-fixups',bin],{maxBuffer:1e9}).toString().split('\n');const got={};
for(const l of fx){const m=l.match(/(0x[0-9A-F]+)\s+bind\s+\S+?\/(\S+)/);if(m)got[parseInt(m[1],16)]=m[2]}
const st=execFileSync('otool',['-v','-s','__TEXT','__stubs',bin],{maxBuffer:1e9}).toString().split('\n');const stub={};
for(let i=0;i<st.length;i++){const a=st[i].match(/^([0-9a-f]+)\s+adrp\s+x16, \d+ ; (0x[0-9a-f]+)/);if(a){const b=st[i+1].match(/ldr\s+x16, \[x16, #(0x[0-9a-f]+)\]/);if(b)stub[parseInt(a[1],16)]=got[parseInt(a[2],16)+parseInt(b[1],16)]}}
const L=fs.readFileSync(dis,'utf8').split('\n');let fn='';const hits=[];let regs={},fl={};
for(const l of L){if(/^_\S+:$/.test(l)){fn=l.slice(1,-1);regs={};fl={};continue}let m;
 if((m=l.match(/fmov\s+(d\d+), #(-?[0-9.e+-]+)/)))fl[m[1]]=parseFloat(m[2]);
 else if((m=l.match(/mov\s+(x\d+), #(0x[0-9a-fA-F]+)/)))regs[m[1]]=BigInt(m[2]);
 else if((m=l.match(/movk\s+(x\d+), #(0x[0-9a-fA-F]+), lsl #(\d+)/))&&regs[m[1]]!==undefined)regs[m[1]]|=BigInt(m[2])<<BigInt(m[3]);
 else if((m=l.match(/fmov\s+(d\d+), (x\d+)/))&&regs[m[2]]!==undefined){const b=Buffer.alloc(8);b.writeBigUInt64LE(BigInt.asUintN(64,regs[m[2]]));fl[m[1]]=b.readDoubleLE(0)}
 else if((m=l.match(/\bbl\s+0x([0-9a-f]+)/))){const s=stub[parseInt(m[1],16)];if(s&&/ScaledMetric|11ScaledMetric/.test(s)){hits.push([fn,s,fl.d0])}}}
const syms=[...new Set(hits.flatMap(h=>[h[0],h[1]]))];const dm=execFileSync('xcrun',['swift-demangle','--simplified'],{input:syms.map(s=>s.replace(/^_/,'')).join('\n'),maxBuffer:1e8}).toString().split('\n');const D={};syms.forEach((s,i)=>D[s]=dm[i]);
for(const h of hits)console.log(D[h[0]].slice(0,110)+'\t'+D[h[1]].slice(0,60)+'\t'+h[2]);
