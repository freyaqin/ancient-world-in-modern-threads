// Draft introductory copy synthesized from the user's project conversations.
// See docs/CONTENT-SOURCES.md for provenance and selection status.
export const site = {
  title: 'Ancient Worlds in Modern Threads',
  subtitle: 'A digital exhibition companion',
  introduction: "Fashion’s fascination with antiquity reveals as much about the present as the past. What makes a style “classic,” and why do particular aesthetics and beauty ideals stand the test of time? Explore how designers reinterpret, reproduce, and reimagine the ancient Mediterranean through fashion.",
  about: "Garments from the Cornell Fashion + Textile Collection—including works from the newly gifted Ralph Rucci collection—enter into conversation with objects from the Herbert F. Johnson Museum of Art and Cornell Anthropology Collections. Casts from Cornell’s historic Plaster Cast Collection bring sculptural line, volume, and proportion into dialogue with wearable structure.",
  approach: "Gathers, Pleats, Layers, and Posture explore ways of shaping the dressed body on Level T. Upstairs, Ancient World: Greece considers pattern and emphasis; Ancient World: Egypt explores color and light. Follow what designers preserve, what they change, and what their interpretations reveal about their own time.",
  researchTitle: "Designing Proximity: Interactive Strategies for Visitor Engagement in Fashion Exhibitions",
  researchIntroduction: "This exhibition and its digital companion support Freya Qin’s M.A. thesis research, exploring how designed interfaces can bring visitors nearer to fashion objects while the objects themselves remain untouched.",
  researchQuote: "What might handling a fabric sample or rotating a digital model reveal that looking through the glass cannot?",
  researchInterfaces: "Ralph Rucci’s original sketches lead toward a tactile display near Pleats. Construction drawings, newly made fabric samples, and 3D-printed figurines suggest a path from an idea to a drawing, to experiments with fabric and form, and finally to a garment. The historic Cheney Brothers sample book in Pleats dates to fall 1929. This website offers close-up photographs, rotatable reconstructions, comparisons across cases, and a space to design your own exhibition.",
  researchNotice: "As part of this research, the curator-researcher will observe visitors’ interactions with the displays and interpretive tools. These observations, combined with visitor feedback, will improve understandings of how tactile and digital experiences contribute to looking at, learning about, and interpreting fashion.",

};
export { default as caseStories } from './case-stories.json';
export const caseSlug = name => name.toLowerCase().replace('ancient world: ', '').replaceAll(' ', '-');
export const caseUrl = name => `#/case/${caseSlug(name)}`;
export const objectUrl = id => `#/object/${encodeURIComponent(id)}`;
