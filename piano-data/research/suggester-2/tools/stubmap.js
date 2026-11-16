const fs=require('fs');const {execFileSync}=require('child_process');const [,,bin,disfile]=process.argv;
const fx=execFileSync('dyld_info',['-fixups',bin],{maxBuffer:1e9}).toString().split('\n');const got={};
for(const l of fx){const m=l.match(/(0x[0-9A-F]+)\s+bind\s+\S+?\/(\S+)/);if(m)got[parseInt(m[1],16)]=m[2]}
const st=execFileSync('otool',['-v','-s','__TEXT','__stubs',bin],{maxBuffer:1e9}).toString().split('\n');const stub={};
for(let i=0;i<st.length;i++){const a=st[i].match(/^([0-9a-f]+)\s+adrp\s+x16, \d+ ; (0x[0-9a-f]+)/);if(a){const b=st[i+1].match(/ldr\s+x16, \[x16, #(0x[0-9a-f]+)\]/);if(b){stub[parseInt(a[1],16)]=got[parseInt(a[2],16)+parseInt(b[1],16)]}}}
// annotate calls
const L=fs.readFileSync(disfile,'utf8').split('\n');const names=new Set();
const out=L.map(l=>{const m=l.match(/\bbl\s+0x([0-9a-f]+)/);if(m&&stub[parseInt(m[1],16)]){names.add(stub[parseInt(m[1],16)]);return l+' ; '+stub[parseInt(m[1],16)]}return l});
fs.writeFileSync(disfile+'.ann',out.join('\n'));console.log(Object.keys(stub).length,names.size)
