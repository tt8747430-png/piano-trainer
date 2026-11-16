// Extract Kotlin/Native static String / primitive-array literals by typeinfo pointer.
const fs=require('fs');const [,,file,outPrefix,...pairs]=process.argv;const b=fs.readFileSync(file);
const types={};for(const p of pairs){const [n,a]=p.split('=');types[BigInt(a)]=n}
const strs=[],arrs=[];
for(let i=0;i+16<=b.length;i+=8){const v=b.readBigUInt64LE(i);const t=types[v&~3n];if(!t)continue;
 const n=b.readUInt32LE(i+8);if(n>200000)continue;
 if(t=='String'){let s='';for(let k=0;k<n-1;k++)s+=String.fromCharCode(b.readUInt16LE(i+18+2*k));strs.push({addr:'0x'+i.toString(16),s})}
 else if(t=='IntArray'){const a=[];for(let k=0;k<n;k++)a.push(b.readInt32LE(i+16+4*k));arrs.push({addr:'0x'+i.toString(16),t,a})}
 else if(t=='ByteArray'){const a=[];for(let k=0;k<n;k++)a.push(b.readInt8(i+12+k));arrs.push({addr:'0x'+i.toString(16),t,a})}
 else if(t=='CharArray'){let s='';for(let k=0;k<n;k++)s+=String.fromCharCode(b.readUInt16LE(i+12+2*k));arrs.push({addr:'0x'+i.toString(16),t,s})}
 else arrs.push({addr:'0x'+i.toString(16),t,n})}
fs.writeFileSync(outPrefix+'_strings.json',JSON.stringify(strs,null,0).replace(/\},\{/g,'},\n{'));
fs.writeFileSync(outPrefix+'_arrays.json',JSON.stringify(arrs).replace(/\},\{/g,'},\n{'));
console.log(strs.length,arrs.length)
