// Draft introductory copy synthesized from the user's project conversations.
// See docs/CONTENT-SOURCES.md for provenance and selection status.
export const site = {
  title: 'Ancient World in Modern Threads',
  subtitle: 'A digital exhibition companion',
  introduction: 'How does the ancient world find its way into the clothes we wear? Through folds, silhouettes, and ornament, this exhibition explores how modern fashion reinterprets the visual languages of the ancient Mediterranean and Egypt.',
  about: 'A pleat can echo a column. A length of cloth can become a mantle. A geometric border can travel between places and times. Bringing garments into conversation through their form, material, and construction, Ancient World in Modern Threads invites a closer look at these changing relationships.',
  approach: 'Resemblance is a starting point for looking, not proof of direct influence. Explore what changes as forms are translated into new materials, techniques, and contexts.',
};
export const caseStories = {
  Cascade: { number: '01', line: 'Cloth in motion', description: 'Follow the fall of fabric: folds gather, release, and cascade around the body.', location: 'Main gallery · west side' },
  Contrapposto: { number: '02', line: 'The body in balance', description: 'Look at the relationship between posture, asymmetry, and the lines of a dressed figure.', location: 'Main gallery · central case' },
  Fluting: { number: '03', line: 'One idea, many techniques', description: 'Fine pleats, vertical folds, and suspended beads give cloth a columnar rhythm. This case explores how related visual effects emerge from different materials and ways of making.', location: 'Main gallery · north side' },
  Mantled: { number: '04', line: 'Wrapped, suspended, released', description: 'Scarves, overlays, and draped panels revisit the mantle through the gestures of wrapping and letting cloth fall.', location: 'Main gallery · east side' },
  Meander: { number: '05', line: 'Patterns that travel', description: 'Borders and repeating geometric forms move across the Mediterranean and into modern dress, accumulating new meanings along the way.', location: 'Level 1' },
  Gilded: { number: '06', line: 'Cloth becomes luminous', description: 'Metal, beads, and shimmering surfaces transform the dressed body through reflected light.', location: 'Level 2' },
  'Egyptian Textiles': { number: '07', line: 'Looking through material', description: 'A closer encounter with the textiles represented in the exhibition.', location: 'Location to be confirmed' },
};
export const caseSlug = name => name.toLowerCase().replaceAll(' ', '-');
export const caseUrl = name => `#/case/${caseSlug(name)}`;
export const objectUrl = id => `#/object/${encodeURIComponent(id)}`;
