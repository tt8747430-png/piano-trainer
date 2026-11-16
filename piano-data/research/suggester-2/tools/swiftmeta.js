// Dump Swift nominal types + fields (+enum cases) from a thin arm64 Mach-O.
const fs=require('fs');const {execFileSync}=require('child_process');
const b=fs.readFileSync(process.argv[2]);
let off=32;const ncmds=b.readUInt32LE(16);const secs={};const segs=[];
for(let i=0;i<ncmds;i++){const cmd=b.readUInt32LE(off),sz=b.readUInt32LE(off+4);
 if(cmd==0x19){const segname=b.toString('latin1',off+8,off+24).replace(/\0.*/,'');const vmaddr=Number(b.readBigUInt64LE(off+24)),fileoff=Number(b.readBigUInt64LE(off+40)),vmsize=Number(b.readBigUInt64LE(off+32));segs.push({segname,vmaddr,fileoff,vmsize});
  const ns=b.readUInt32LE(off+64);for(let j=0;j<ns;j++){const so=off+72+j*80;const sn=b.toString('latin1',so,so+16).replace(/\0.*/,'');const addr=Number(b.readBigUInt64LE(so+32)),size=Number(b.readBigUInt64LE(so+40)),fo=b.readUInt32LE(so+48);secs[sn]=secs[sn]||{addr,size,fo}}}
 off+=sz}
function a2o(a){for(const s of segs)if(a>=s.vmaddr&&a<s.vmaddr+s.vmsize)return a-s.vmaddr+s.fileoff;return -1}
function o2a(o){for(const s of segs)if(o>=s.fileoff&&o<s.fileoff+s.vmsize&&s.segname!='__PAGEZERO')return o-s.fileoff+s.vmaddr;return -1}
function rel(o){const v=b.readInt32LE(o);return v==0?0:o+v} // file offsets (same delta within segment assumption)
function cstr(o){let e=o;while(b[e])e++;return b.toString('utf8',o,e)}
const descName=new Map();
function ctxName(o,depth=0){if(o<=0||depth>8)return '?';const flags=b.readUInt32LE(o);const kind=flags&0x1f;
 let parent='';const p=b.readInt32LE(o+4);if(p){let po=o+4+p;if(p&1){/*indirect*/po=o+4+(p&~1);return cstr(rel(o+8))}parent=ctxName(po,depth+1)}
 if(kind==0)return cstr(rel(o+8))|| '?'; // module
 if(kind==1||kind==2){return parent}
 if(kind>=16&&kind<=18)return (parent?parent+'.':'')+cstr(rel(o+8));
 if(kind==3)return parent; // protocol
 return parent}
function mangled(o){if(o<=0)return '';let e=o;let s='';while(b[e]){const c=b[e];if(c>=1&&c<=0x17){const r=b.readInt32LE(e+1);const t=e+1+r;s+='<'+(c==1?ctxName(t):c==2?'ind:'+(()=>{try{const ta=Number(b.readBigUInt64LE(t));const to=a2o(ta&0xffffffffff);return to>0?ctxName(to):'?'}catch(x){return '?'}})():'sym'+c)+'>';e+=5;continue}if(c>=0x18&&c<=0x1f){e+=9;s+='<ptr>';continue}s+=String.fromCharCode(c);e++}return s}
const out=[];const t=secs['__swift5_types'];
const allMangled=new Set();
for(let i=0;i<t.size;i+=4){const o=rel(t.fo+i);const flags=b.readUInt32LE(o);const kind=flags&0x1f;const kname={16:'class',17:'struct',18:'enum'}[kind]||('kind'+kind);
 const name=ctxName(o);let fields=[];
 const fdo=b.readInt32LE(o+16)?o+16+b.readInt32LE(o+16):0;
 if(fdo>0){const nf=b.readUInt32LE(fdo+12);const rs=b.readUInt16LE(fdo+10);for(let k=0;k<nf;k++){const ro=fdo+16+k*rs;const fl=b.readUInt32LE(ro);const tn=b.readInt32LE(ro+4)?mangled(ro+4+b.readInt32LE(ro+4)):'';const fn=b.readInt32LE(ro+8)?cstr(ro+8+b.readInt32LE(ro+8)):'';fields.push({name:fn,type:tn,var:!!(fl&2)});if(tn&&!tn.includes('<'))allMangled.add(tn)}}
 out.push({kind:kname,name,fields})}
// demangle plain type names
const arr=[...allMangled];const dm={};if(arr.length){const res=execFileSync('xcrun',['swift-demangle','--compact'],{input:arr.map(x=>'$s'+x).join('\n'),maxBuffer:1e8}).toString().split('\n');arr.forEach((x,i)=>dm[x]=res[i])}
for(const ty of out)for(const f of ty.fields)if(dm[f.type])f.type=dm[f.type];
fs.writeFileSync(process.argv[3],JSON.stringify(out,null,1));
console.log(out.length,'types');
