import { installations } from '../src/data/installations.js';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p)));
const groups=read('src/data/cases.json'),edits=read('src/data/editorial.json'),labels=read('src/data/case-labels.json');
const records=read('src/data/collection.json').map(record=>({...record,...edits[record.id]}));
for(const group of groups){const label=labels[group.name];assert(label,`Missing group label: ${group.name}`);assert([label.lead,...label.paragraphs].join(' ').trim().split(/\s+/).length<=400,`Group label too long: ${group.name}`);}
assert.equal(records.find(o=>o.id==='2002.08.016').date,'1974–1979');
assert(!records.find(o=>o.id==='2002.08.016').recordNote);
assert(!records.find(o=>o.id==='2002.08.006').recordNote);
assert(records.find(o=>o.id==='2002.08.006').description.includes('sweetheart'));
assert(records.find(o=>o.id==='2002.08.006').description.includes('deep V'));
const ids=groups.flatMap(g=>g.objects);
assert.equal(groups.length,6);assert.equal(ids.length,31);assert.equal(new Set(ids).size,31);
assert.equal(records.length,32);assert.equal(new Set(records.map(o=>o.id)).size,32);
assert.deepEqual(groups.map(g=>g.objects.length),[8,3,5,5,5,5]);
assert.deepEqual(groups.find(g=>g.name==='Fluting').alternates,['2002.05.026']);
assert(!ids.includes('2002.05.026'));assert(!ids.includes('2002.05.054'));assert(!ids.includes('1995.07.008'));
for(const group of groups)for(const [i,id] of group.objects.entries()){
 const record=records.find(o=>o.id===id);assert(record,`Missing record ${id}`);
 assert.equal(record.collection,group.name);assert.equal(record.displayOrder,i+1);
}
for(const item of records){
 for(const key of ['title','designer','date','description','material'])assert(item[key],`${item.id}: missing ${key}`);
 if(item.accession){assert(item.footer.includes('CF+TC No'));assert(item.labelSource.includes(item.credit));assert(item.description.length>80)}
 for(const type of ['image','thumbnail','model'])if(item[type])assert(fs.existsSync(path.join(root,'public',item[type])),`${item.id}: missing ${type}`);
 if(item.image)assert(item.alt.length>20);
 if(item.model){
  const bytes=fs.readFileSync(path.join(root,'public',item.model));assert.equal(bytes.toString('ascii',0,4),'glTF');
  const json=JSON.parse(bytes.toString('utf8',20,20+bytes.readUInt32LE(12)));
  assert(json.materials.some(m=>m.pbrMetallicRoughness?.baseColorTexture),`${item.id}: missing color texture`);
  assert(bytes.length<10000000,`${item.id}: oversized web GLB`);
 }
}
assert.equal(records.filter(o=>o.model).length,28);assert.equal(records.filter(o=>o.image).length,29);
for(const id of ['3136','loan-issey-miyake','loan-madame-gres']){const r=records.find(o=>o.id===id);assert.equal(r.image,null);assert.equal(r.model,null)}
console.log('PASS: 31 ordered display entries, 1 alternate, 29 photographs, 28 textured web GLBs, placeholders, and label records.');

for (const group of groups) {
  const installation = installations[group.name];
  assert(installation, `Missing installation: ${group.name}`);
  assert.deepEqual(installation.markers.map(marker => marker.id), group.objects);
  assert(fs.existsSync(path.join(root, 'public', installation.image)));
  assert(installation.width > 0 && installation.height > 0);
  for (const marker of installation.markers) assert(marker.x > 0 && marker.x < 100 && marker.y > 0 && marker.y < 100);
  for (let i=0;i<installation.markers.length;i++) for(let j=i+1;j<installation.markers.length;j++) {
    const a=installation.markers[i],b=installation.markers[j];
    const dx=Math.abs(a.x-b.x)/100*installation.minWidth;
    const dy=Math.abs(a.y-b.y)/100*installation.minWidth*installation.height/installation.width;
    assert(dx>=44 || dy>=44, `Overlapping marker touch targets: ${group.name}`);
  }
}
console.log('PASS: six installation images, 31 correctly mapped markers, and non-overlapping minimum touch targets.');
