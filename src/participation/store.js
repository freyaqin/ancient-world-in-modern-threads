// Opt-in session state only. No network, cookies or persistent storage.
import { useSyncExternalStore } from 'react';
const initial = () => ({ words: [], designs: [], enabled: false, session: null, pages: {}, features: {}, terms: {} });
let state = initial();
const listeners = new Set();
function update(next) { state = { ...state, ...next }; listeners.forEach(fn => fn()); }
export function previewSnapshot() { return state; }
export function useParticipation() { return useSyncExternalStore(fn => { listeners.add(fn); return () => listeners.delete(fn); }, () => state); }
export function addWord(word) { update({ words: [...state.words, word] }); }
export function addDesign(design) { update({ designs: [...state.designs, { ...design, id: crypto.randomUUID() }] }); }
export const consentVersion = 'app-session-review-2026-10-27';
export function beginTestSession({ adult, analytics } = {}) {
  if (adult !== true || analytics !== true) return false;
  update({ enabled: true, session: { id: crypto.randomUUID(), consentVersion, consentedAt: new Date().toISOString() }, pages: {}, features: {}, terms: {} });
  return true;
}
export function endTestSession() { update({ enabled: false, session: null, pages: {}, features: {}, terms: {} }); }
export function resetTesting() { state = initial(); listeners.forEach(fn => fn()); }
export function recordTime(route, seconds, sessionId) {
  if (!state.enabled || sessionId !== state.session?.id || !Number.isFinite(seconds) || seconds <= 0) return;
  update({ pages: { ...state.pages, [route]: (state.pages[route] || 0) + seconds } });
}
export function recordFeature(feature) {
  if (!state.enabled) return;
  update({ features: { ...state.features, [feature]: (state.features[feature] || 0) + 1 } });
}
const stop = new Set('a an the i it its is was are were this that and or to of in on for with my me you so very really'.split(' '));
export function words(text) { return (text.toLowerCase().match(/\p{L}+(?:[-’']\p{L}+)*/gu) || []).map(w => w === 'colour' ? 'color' : w).filter(w => w.length > 1 && !stop.has(w)); }
export function recordReflection(id, answer) {
  if (!state.enabled) return;
  const counts = { ...(state.terms[id] || {}) };
  words(answer).forEach(w => { counts[w] = (counts[w] || 0) + 1; });
  update({ terms: { ...state.terms, [id]: counts } });
}

export function finishMeasurement() {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event('exhibition-flush'));
  update({ enabled: false });
}
export function sessionSummary() {
  if (!state.session) return null;
  return { schema: 'exhibition-session-v1', session: { ...state.session }, pages: Object.fromEntries(Object.entries(state.pages).map(([key, value]) => [key, Math.round(value)])), features: { ...state.features }, terms: structuredClone(state.terms) };
}
