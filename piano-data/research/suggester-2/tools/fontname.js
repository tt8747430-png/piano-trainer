const b=require('fs').readFileSync(process.argv[2]);const n=b.readUInt16BE(4);let name=null;
for(let i=0;i<n;i++){const o=12+16*i;if(b.toString('latin1',o,o+4)=='name')name=b.readUInt32BE(o+8)}
const cnt=b.readUInt16BE(name+2),so=name+b.readUInt16BE(name+4);const seen={};
for(let i=0;i<cnt;i++){const r=name+6+12*i;const pid=b.readUInt16BE(r),eid=b.readUInt16BE(r+2),lid=b.readUInt16BE(r+4),nid=b.readUInt16BE(r+6),len=b.readUInt16BE(r+8),off=b.readUInt16BE(r+10);
 const raw=b.subarray(so+off,so+off+len);let s=pid==3||pid==0?Buffer.from(raw).swap16().toString('utf16le'):raw.toString('latin1');if(!seen[nid]){seen[nid]=1;console.log(nid+': '+s)}}
