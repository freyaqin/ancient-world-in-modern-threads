// Draft introductory copy synthesized from the user's project conversations.
// See docs/CONTENT-SOURCES.md for provenance and selection status.
export const site = {
  title: 'Ancient World in Modern Threads',
  subtitle: 'A digital exhibition companion',
  introduction: "Ancient forms rarely remain fixed in the past. They travel across geography, materials, bodies, and time. This exhibition traces how the ancient Mediterranean and Egypt resurface in twentieth- and twenty-first-century fashion.",
  about: "Garments from the Cornell Fashion + Textile Collection—including works from the newly gifted Ralph Rucci collection—enter into conversation with objects from the Herbert F. Johnson Museum of Art and Cornell Anthropology Collections. Casts from Cornell’s historic Plaster Cast Collection bring sculptural line, volume, and proportion into dialogue with wearable structure.",
  approach: "Rather than following a chronology, the exhibition is organized around modes of visual translation. Explore how ancient forms, gestures, and surfaces are reinterpreted through modern dress.",
  researchTitle: "Designing Proximity: Interactive Strategies for Visitor Engagement in Fashion Exhibitions",
  researchIntroduction: "This exhibition and its digital companion support Freya Qin’s M.A. thesis research, exploring how designed interfaces can bring visitors nearer to fashion objects while the objects themselves remain untouched.",
  researchQuote: "Looking is one point of entry; touching, manipulating, comparing, and exploring digitally offer others—each a different route toward the same understanding.",
  researchInterfaces: "Near Fluting, five tactile pages pair construction drawings with mock-up swatches, responding to the original 1950s textile sample book in the case. Alongside 3D-printed figurines and Ralph Rucci’s sketches in a separate wall display, they extend the exploration of garment form. This website adds close-up photographs, rotatable 3D reconstructions, and comparisons between objects.",
  researchNotice: "As part of the research associated with this exhibition, visitors’ interactions with the displays and interpretive interfaces may be observed by the curator-researcher to better understand how people engage with fashion in an exhibition setting.",
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
