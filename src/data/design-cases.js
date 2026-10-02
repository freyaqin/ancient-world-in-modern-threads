export const designCases = {
  Cascade: { min: 6, max: 8, defaultCount: 8, image: '/cases/blank/cascade.webp', left: 25, right: 88, top: 34, bottom: 79 },
  Fluting: { min: 6, max: 6, defaultCount: 6, image: '/cases/blank/fluting.webp', positions: [17, 28, 39, 61, 72, 83], top: 31, bottom: 81 },
  Contrapposto: { min: 2, max: 3, defaultCount: 3, image: '/cases/blank/contrapposto.webp', left: 30, right: 70, top: 35, bottom: 77 },
  Mantled: { min: 5, max: 5, defaultCount: 5, image: '/cases/blank/mantled.webp', left: 19, right: 80, top: 32, bottom: 83 },
  Meander: { min: 5, max: 5, defaultCount: 5, image: '/cases/blank/meander.webp', left: 19, right: 80, top: 32, bottom: 83 },
  Gilded: { min: 5, max: 5, defaultCount: 5, image: '/cases/blank/gilded.webp', left: 19, right: 80, top: 32, bottom: 83 },
};
export const blankDesign = () => Object.fromEntries(Object.entries(designCases).map(([name, c]) => [name, Array(c.defaultCount).fill(null)]));
export function slotPositions(name, count) {
  const c = designCases[name];
  return c.positions || Array.from({length: count}, (_, i) => c.left + i * (c.right-c.left)/(count-1));
}
