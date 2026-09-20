import { assetPath } from './asset-path.js';
import records from './collection.json';
import editorial from './editorial.json';
import { object as demo } from './object';
export const objects = records.map(record => ({ ...record, ...editorial[record.id] })).map(item => item.id === demo.id ? { ...item, hotspots: demo.hotspots, views: demo.views, note: demo.note } : item).map(item => ({ ...item, image: assetPath(item.image), thumbnail: assetPath(item.thumbnail), model: assetPath(item.model), modelWithoutJacket: assetPath(item.modelWithoutJacket) }));
export const getObject = id => objects.find(item => item.id === id);
