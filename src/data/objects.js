import { assetPath } from './asset-path.js';
import records from './collection.json';
import editorial from './editorial.json';
import finalRecords from './final-collection.json';
import related from './related-objects.json';
import roster from './cases.json';
const renamed = {Cascade:'Gathers', Contrapposto:'Posture', Fluting:'Pleats', Mantled:'Layers', Meander:'Ancient World: Greece', Gilded:'Ancient World: Egypt'};
const currentIds = new Set(finalRecords.map(o => o.id));
const historical = records.filter(o => !currentIds.has(o.id) && o.id !== '2026.06.177ab').map(o => ({...o,...editorial[o.id],collection:renamed[o.collection] || o.collection,retired:true,alternate:false}));
export const objects = [...historical,...finalRecords].map(item => ({...item,hotspots:item.hotspots || [],views:(item.views || []).map(v => ({...v,image:assetPath(v.image)})),image:assetPath(item.image),thumbnail:assetPath(item.thumbnail),model:assetPath(item.model),modelWithoutJacket:assetPath(item.modelWithoutJacket)}));
export const getObject = id => objects.find(item => item.id === (id === '2026.06.177ab' ? '2026.06.177a' : id));
// Artworks are case-only tombstones, never routable object pages.
export const relatedObjects = name => related.filter(o => o.collection === name);
