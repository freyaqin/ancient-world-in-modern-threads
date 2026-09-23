import Arrow from './Arrow';
import React, { lazy, Suspense, useRef, useState } from 'react';

import { cases, runwayNotes } from './data/exhibition';
import { caseUrl, objectUrl } from './data/site';


const ModelViewer = lazy(() => import('./ModelViewer'));

function Icon({ name, ...props }) {
  const shapes = {
    case: <><rect x="3" y="4" width="18" height="16" rx="1"/><path d="M9 4v16M15 4v16M3 15h18"/></>,
    object: <path d="m8 3 2 5h4l2-5 2 1-2 7 4 10H4l4-10-2-7 2-1Zm0 8h8"/>,
    rotate: <><path d="M4 8a8 8 0 1 1-1 7M4 3v5h5"/><path d="M9 12h6m-3-3v6"/></>,
    compare: <><path d="M10 3 3 5v14l7 2V3Zm4 0 7 2v14l-7 2V3Z"/></>,
    material: <><path d="m4 6 14 14M4 12l8 8M6 4l14 14M12 4l8 8M4 18 18 4M4 12l8-8M12 20l8-8"/></>,
    close: <path d="m6 6 12 12M6 18 18 6"/>,
    arrow: <path d="M5 12h14m-5-5 5 5-5 5"/>,
  };
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{shapes[name]}</svg>;
}
function Garment({ object, decorative = false }) {
  const c = object.crop;
  return <img className={c ? 'garment cropped' : 'garment'} src={object.image} alt={decorative ? '' : object.alt} draggable="false" style={c ? { width: `${c.sourceWidth / c.width * 100}%`, maxWidth: 'none', left: `${-c.x / c.width * 100}%`, top: `${-c.y / c.height * 100}%` } : undefined} />;
}
export default function ObjectPage({ object }) {
  const [mode, setMode] = useState('object');
  const [active, setActive] = useState(null);
  const [view, setView] = useState(object.views[0] || {id:'full',scale:1,origin:'50% 50%'});
  const group = cases.find(group => group.name === object.collection);
  const position = group.objects.indexOf(object.id);
  const runway = runwayNotes[object.id];
  const hotspotRefs = useRef({});
  const triggerRef = useRef(null);
  const detailRef = useRef(null);
  function selectHotspot(hotspot, event) {
    triggerRef.current = event.currentTarget;
    setMode('object');
    setActive(hotspot);
    // Focus the revealed text so keyboard and screen-reader users reach it immediately.
    requestAnimationFrame(() => detailRef.current?.focus({ preventScroll: true }));
  }
  function closeDetail() {
    const id = active?.id;
    setActive(null);
    requestAnimationFrame(() => (triggerRef.current?.isConnected ? triggerRef.current : hotspotRefs.current[id])?.focus({ preventScroll: true }));
  }
  return <>
    <nav className="breadcrumbs" aria-label="Breadcrumb"><a href="#/">Home</a><span>/</span><a href="#/map">Exhibition map</a><span>/</span><a href={caseUrl(object.collection)}>{object.collection}</a><span>/</span><span aria-current="page">{object.accession || object.designer}</span></nav>
    <main id="content" className="object-page" tabIndex="-1">
      <section className="viewer" aria-label="Interactive garment viewer">
        <div className="viewer-caption"><span>{mode === 'object' ? 'Object study' : '360° study'}</span><span>{object.accession || 'Loan'}</span></div>
        <div hidden={mode !== 'object'}>{!object.image ? <div className="object-photo-placeholder"><p className="eyebrow">{object.collection}</p><h2>Photography forthcoming</h2><p>{object.assetNote}</p></div> : <><div className="image-window"><div className="image-plane" style={{ aspectRatio: object.crop ? `${object.crop.width} / ${object.crop.height}` : object.imageAspect, transform: `scale(${view.scale})`, transformOrigin: view.origin }}>
          <Garment object={object} />
          {object.hotspots.filter(h => { const [ox, oy] = view.origin.split(' ').map(parseFloat); const x = (h.x - ox) * view.scale + ox; const y = (h.y - oy) * view.scale + oy; return x > 8 && x < 92 && y > 6 && y < 94; }).map(h => <button key={h.id} ref={el => hotspotRefs.current[h.id] = el} className={`hotspot ${active?.id === h.id ? 'selected' : ''}`} style={{ left: `${h.x}%`, top: `${h.y}%`, transform: `translate(-50%, -50%) scale(${1 / view.scale})` }} aria-label={`Explore ${h.label.toLowerCase()}: ${h.title}`} aria-expanded={active?.id === h.id} aria-controls="interpretation" onClick={event => selectHotspot(h, event)}><span>{h.number}</span></button>)}
        </div></div>
        <div className="view-controls" aria-label="Image views">{object.views.map(v => <button key={v.id} className={`view-option ${view.id === v.id ? 'current' : ''}`} aria-pressed={view.id === v.id} onClick={() => setView(v)}><span className="thumbnail" aria-hidden="true"><span className="thumb-plane" style={{ transform: `scale(${v.scale})`, transformOrigin: v.origin }}><Garment object={object} decorative /></span></span><span>{v.label}</span></button>)}</div>
        <p className="viewer-hint">{object.hotspots.length ? 'Touch a circle. Discover a detail.' : 'Select Closer look to examine the photograph.'}</p></>}{object.image && object.assetNote && <p className="asset-note">{object.assetNote}</p>}</div>
        {mode === 'rotate' && <Suspense fallback={<p role="status">Loading the 3D viewer…</p>}><ModelViewer object={object} /></Suspense>}
      </section>
      <aside className="object-info" aria-label="About this object">
        <p className="eyebrow">{object.collection} / {object.accession || 'Loan'}</p>{object.alternate && <p className="record-note">Alternate study object · retained for exploration, outside the current display sequence.</p>}<h1>{object.title}</h1><p className="attribution">{object.designer}<span>{object.date}</span></p>
        <p className="credit">{object.credit}<br/><span>{object.footer}</span></p>
        <section className="looking-question" aria-label="A question to consider"><p className="eyebrow">Pause and look</p><h2>{object.question}</h2></section>
        <p className="description">{object.description}</p>
        <dl className="facts"><div><dt>Material</dt><dd>{object.material}</dd></div>{object.origin && <div><dt>Recorded origin</dt><dd>{object.origin}</dd></div>}{object.wornBy && <div><dt>Worn by</dt><dd>{object.wornBy}</dd></div>}<div><dt>{object.alternate ? 'Related case' : 'Display'}</dt><dd>{object.collection}</dd></div></dl>
        {object.hotspots.length > 0 && <>
        <div id="look-closer" className="details-header"><h2>Look closer</h2>{object.hotspots.length > 0 && <span>{object.hotspots.length} details</span>}</div>
        <p className="details-instruction">{object.image ? object.note : 'Object details will be added as they become available.'}</p>
        <div className="detail-list">{object.hotspots.map(h => <button key={h.id} className={active?.id === h.id ? 'active' : ''} onClick={event => selectHotspot(h, event)} aria-expanded={active?.id === h.id} aria-controls="interpretation"><span className="detail-number">{h.number}</span><span>{h.label}</span><Icon name="arrow" /></button>)}</div>
        </>}
        {object.recordNote && <p className="record-note">{object.recordNote}</p>}
        {runway && <details className="material-detail"><summary>Runway context</summary>{runway.collection && <p>{runway.collection}</p>}<p>Runway model: {runway.model}</p>{runway.possibleModel && <p>Possible identification: {runway.possibleModel} (unconfirmed).</p>}</details>}
        {position >= 0 && <nav className="object-sequence" aria-label="Objects in display order">{position > 0 && <a href={objectUrl(group.objects[position-1])}><Arrow direction="left"/> Previous object</a>}{position < group.objects.length-1 && <a href={objectUrl(group.objects[position+1])}>Next object <Arrow direction="right"/></a>}</nav>}
        <a className="case-return" href={caseUrl(object.collection)}>See this object in {object.collection} <Arrow direction="right"/></a>
        <section id="interpretation" className={`interpretation ${active ? 'is-open' : ''}`} aria-label="Selected garment detail" hidden={!active} onKeyDown={e => { if (e.key === 'Escape') closeDetail(); }}>
          {active && <><div className="detail-top"><span className="eyebrow">Detail {active.number} / {active.label}</span><button className="close-button" aria-label="Close detail" onClick={closeDetail}><Icon name="close" /></button></div><div ref={detailRef} tabIndex="-1" className="detail-copy"><h2>{active.title}</h2><p>{active.text}</p></div></>}
        </section>
        <p className="collection-note">{object.footer}</p>
      </aside>
    </main>
    <nav className="navigation object-navigation" aria-label="Object views">
      <a href={caseUrl(object.collection)}><Icon name="case"/><span>{object.collection}</span></a>
      <button aria-current={mode === 'object' ? 'page' : undefined} onClick={() => {setMode('object'); setActive(null);}}><Icon name="object"/><span>Object</span></button>
      <button disabled={!object.model} aria-current={mode === 'rotate' ? 'page' : undefined} onClick={() => {setMode('rotate'); setActive(null);}}><Icon name="rotate"/><span>360° View</span>{!object.model && <small>In preparation</small>}</button>
      <a href={`${caseUrl(object.collection)}/compare`}><Icon name="compare"/><span>Compare</span></a>
    </nav>
  </>;
}

