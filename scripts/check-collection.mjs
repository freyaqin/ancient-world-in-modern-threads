import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../src/data/'+p,import.meta.url)));
const installations=read('final-installations.json');
const groups=read('cases.json'), records=read('final-collection.json'), related=read('related-objects.json'), labels=read('case-labels.json');
const ids=groups.flatMap(g=>g.objects);
assert.equal(groups.length,6);assert.equal(ids.length,25);assert.equal(new Set(ids).size,25);
assert.deepEqual(groups.map(g=>g.objects.length),[6,5,3,3,4,4]);
assert.equal(records.find(o=>o.id==='2012.08.027ab').designer,'Patricia Lester');
assert.equal(records.find(o=>o.id==='2002.08.016').date,'1974–1980');
assert(ids.includes('2002.05.026'));assert(ids.includes('2026.06.177a'));assert(!ids.includes('2026.06.177ab'));
for(const group of groups){
 const label=labels[group.name];assert(label);assert([label.lead,...label.paragraphs].join(' ').split(/\s+/).length<=400);
 const installation=installations[group.name];assert(installation);assert.deepEqual(installation.markers.map(m=>m.id),group.objects);
 assert(fs.existsSync(new URL('../public'+installation.image,import.meta.url)));
 for(const [i,id] of group.objects.entries()) {const r=records.find(o=>o.id===id);assert(r);assert.equal(r.collection,group.name);assert.equal(r.displayOrder,i+1);assert(r.image,`${id} needs photo`);}
 for(let i=0;i<installation.markers.length;i++)for(let j=i+1;j<installation.markers.length;j++){
  const a=installation.markers[i],b=installation.markers[j];
  assert(Math.abs(a.x-b.x)/100*installation.minWidth>=44 || Math.abs(a.y-b.y)/100*installation.minWidth*installation.height/installation.width>=44,`Overlapping targets ${group.name}`);
 }
}
for(const r of [...records,...related]){
 for(const k of ['title','designer','date','material','credit','description'])assert(r[k],`${r.id} missing ${k}`);
 assert(r.description.length>80);assert(r.image,`${r.id} missing image`);
 for(const k of ['image','thumbnail','model','modelWithoutJacket'])if(r[k])assert(fs.existsSync(new URL('../public'+r[k],import.meta.url)),`${r.id} missing asset ${r[k]}`);
 for(const view of r.views || [])if(view.image)assert(fs.existsSync(new URL('../public'+view.image,import.meta.url)));
 if(r.model){const bytes=fs.readFileSync(new URL('../public'+r.model,import.meta.url));assert.equal(bytes.toString('ascii',0,4),'glTF');const gltf=JSON.parse(bytes.toString('utf8',20,20+bytes.readUInt32LE(12)));assert(gltf.materials.some(m=>m.pbrMetallicRoughness?.baseColorTexture));}
}
console.log(`PASS: ${records.length} selected garments, ${related.length} contextual objects, six final installations, labels, photos, model textures, and marker touch targets.`);
console.log(`Models available: ${records.filter(r=>r.model).length}; models/configurations still needed: ${records.filter(r=>!r.model).length}.`);
