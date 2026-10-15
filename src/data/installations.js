import { assetPath } from './asset-path.js';
import records from './final-installations.json';
export const installations = Object.fromEntries(Object.entries(records).map(([name,item]) => [name,{...item,image:assetPath(item.image)}]));
