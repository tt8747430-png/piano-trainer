// Extract Kotlin/Native string literals: [typeinfo 8][hash/flags?][count int32][utf16 chars]
const fs=require('fs');const b=fs.readFileSync(process.argv[2]);const min=+process.argv[3]||2;
let out=[];let i=0;
function ok(c){return (c>=0x20&&c<0x7f)||c==9||c==10||(c>=0xa0&&c<0x3000)||(c>=0xe000&&c<0xfffe&&c!=0xfeff)}
for(i=0;i+1<b.length;i+=2){let s='';let j=i;while(j+1<b.length){const c=b.readUInt16LE(j);if(!ok(c))break;s+=String.fromCharCode(c);j+=2}
 if(s.length>=min){// check length prefix at i-4
  const n=i>=4?b.readInt32LE(i-4):-1; if(n===s.length||n>0&&n<=s.length&&n>=min){out.push(i.toString(16)+'\t'+JSON.stringify(s.slice(0,n)))} else if(s.length>=min+4) out.push(i.toString(16)+'\t?'+JSON.stringify(s));
  i=j-2+2-2;i=j;} }
fs.writeFileSync(process.argv[4],out.join('\n'));console.log(out.length)
