import Arrow from '../Arrow';
import React, { useState } from 'react';
import CaseInstallation from '../CaseInstallation';
import { installations } from '../data/installations';
import caseLabels from '../data/case-labels.json';
import { cases } from '../data/exhibition';
import { site, caseStories, caseSlug, caseUrl, objectUrl } from '../data/site';
import { getObject } from '../data/objects';
const featuredObjects = ['2021.12.001', '2012.08.026abcde', '2002.05.090', '2002.08.005', '322', '2015.30.016'].map(getObject);

export function Breadcrumbs({ group, current }) {
  return <nav className="breadcrumbs" aria-label="Breadcrumb"><a href="#/">Home</a>{group && <><span>/</span><a href="#/map">Exhibition map</a></>}{group && current && <><span>/</span><a href={caseUrl(group)}>{group}</a></>}<span>/</span><span aria-current="page">{current || group || 'Exhibition map'}</span></nav>;
}
function CaseLinks() {
  return <div className="case-links">{cases.map(group => <a key={group.name} href={caseUrl(group.name)}><span className="case-index">{caseStories[group.name].number}</span><div><h3>{group.name}</h3><p>{caseStories[group.name].line}</p></div><span aria-hidden="true"><Arrow direction="diagonal"/></span></a>)}</div>;
}
export function Home() {
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const object = featuredObjects[featuredIndex];
  const group = cases.find(group => group.objects.includes(object.id));
  const browse = direction => setFeaturedIndex(index => (index + direction + featuredObjects.length) % featuredObjects.length);
  return <main id="content" tabIndex="-1" className="explore-page home-page">
    <section className="home-hero">
      <div className="hero-copy"><p className="eyebrow">Fashion · Form · Antiquity</p><h1>Ancient World<br/><em>in Modern</em><br/>Threads</h1><p className="hero-intro">{site.introduction}</p>
        <div className="start-exploring"><p className="eyebrow">Your exhibition starts here</p><a className="primary-link" href="#/map">Start with the exhibition map <Arrow direction="diagonal"/></a><p>Choose a case, discover its connections, then explore each garment.</p></div>
      </div>
      <section className="featured-garments" aria-label="Browse featured garments" aria-roledescription="carousel">
        <p className="eyebrow">Or begin with a single garment</p>
        <a className="featured-link" href={objectUrl(object.id)} aria-label={`Explore ${object.designer}: ${object.title}`}>
          <figure className="hero-image"><img src={object.image} alt={object.alt}/><figcaption><span>{group.name} / {object.designer}</span><span>{object.date}</span></figcaption><span className="featured-invitation">Explore this garment <Arrow direction="diagonal"/></span></figure>
        </a>
        <div className="featured-controls"><p aria-live="polite" aria-atomic="true"><span>{String(featuredIndex + 1).padStart(2, '0')} / {String(featuredObjects.length).padStart(2, '0')}</span> {object.title}</p><div><button type="button" onClick={() => browse(-1)} aria-label="Previous featured garment"><Arrow direction="left"/></button><button type="button" onClick={() => browse(1)} aria-label="Next featured garment"><Arrow/></button></div></div>
      </section>
    </section>
    <section className="home-about"><p className="eyebrow">Looking across time</p><div><h2>Ancient forms.<br/>New ways of making.</h2><p>{site.about}</p><p>{site.approach}</p></div></section>
    <section className="home-research" aria-labelledby="research-heading"><div><p className="eyebrow">Proximity / Exhibition research</p><h2 id="research-heading">Fashion within reach</h2><blockquote><p>{site.researchQuote}</p><cite>From the Proximity wall text</cite></blockquote></div><div><h3>{site.researchTitle}</h3><p>{site.researchIntroduction}</p><p>{site.researchInterfaces}</p><p className="research-notice">{site.researchNotice}</p></div></section>
    <section className="theme-section"><div className="section-heading"><div><p className="eyebrow">Find a thread to follow</p><h2>Explore by theme</h2></div><a className="quiet-link" href="#/map">See the spatial map <Arrow direction="diagonal"/></a></div><CaseLinks/></section>
    <section className="how-to"><a className="primary-link" href="#/design">Design your own exhibition <Arrow/></a><h2>A closer encounter</h2><p>Find a case on the map, see the objects together, then open a garment to examine its details. Compare two objects across the exhibition and follow the changes in material, technique, and form.</p></section>
  </main>;
}
export function ExhibitionMap() {
  const [level, setLevel] = useState('T');
  const upperCase = level === '1' ? 'Meander' : 'Gilded';
  const displays = [['Cascade', 'cascade'], ['Fluting', 'fluting'], ['Contrapposto', 'contrapposto'], [level === 'T' ? 'Mantled' : upperCase, 'mantled']];
  return <><Breadcrumbs/><main id="content" tabIndex="-1" className="explore-page map-page">
    <div className="page-heading"><p className="eyebrow">Level T / Main gallery</p><h1>The exhibition,<br/><em>in space.</em></h1><p>Start on Level T. There is more to discover upstairs: Meander on Level 1 and Gilded on Level 2, directly above Mantled.</p></div>
    <div className="map-layout"><section className="map-panel" aria-label="Exhibition floor plan">
      <p className="installation-help">Select a blue case to explore. On a small screen, swipe across the plan.</p>
      <div className="floor-scroll" tabIndex="0" role="region" aria-label="Scrollable floor plan">
      <div className="spatial-plan">
        <svg viewBox="0 0 1000 870" aria-hidden="true"><g fill="#e4e0da" stroke="#948c82" strokeWidth="3"><path d="M55 25H350V650H55Z"/><path d="M645 25H945V385H645Z"/><path d="M480 620H990V850H480Z"/></g><g fill="none" stroke="#948c82" strokeWidth="3"><path d="M15 10H365V385H330M365 600V665H330M55 665H235M15 10V855H405M460 850H990M475 0V170M510 30V385H645M945 25H1000M950 385H1000"/><path d="M550 470H600V520H550Z M775 470H810V520H775Z"/><path d="M365 605l50 40 50-40 M410 850l45-40" strokeDasharray="5 5"/></g></svg>
        <span className="room room-gallery">Jill Stuart<br/>Gallery</span><span className="room room-restrooms">Restrooms</span><span className="room room-office">Office</span>
        {displays.map(([name, position]) => level !== 'T' && position !== 'mantled'
          ? <div key={position} className={`plan-case plan-${position} muted`}><strong>{name}</strong></div>
          : <a key={position} className={`plan-case plan-${position}`} href={caseUrl(name)}><strong>{name}</strong><span>{position === 'mantled' ? `Level ${level}` : 'Level T'}</span></a>)}
        <span className="wall-label wall-interactive">Interactive wall display</span><span className="wall-label wall-sketches">Ralph Rucci sketches</span>
      </div></div>
      <div className="map-level-legend" role="group" aria-label="Choose exhibition level"><span>View level</span><div>{['T','1','2'].map(id => <button key={id} aria-pressed={level === id} onClick={() => setLevel(id)}>Level {id}{id === 'T' ? ' · Main gallery' : ''}</button>)}</div></div>
      <p className="map-caption" aria-live="polite">{level === 'T' ? 'Blue rectangles mark the four Level T cases. Select Level 1 or Level 2 to explore the cases upstairs.' : `${upperCase} occupies the position directly above Mantled. The grayed cases and room outlines show Level T for orientation.`} Based on the supplied floor plan; schematic, not to scale.</p>
    </section><aside className="map-directory"><p className="eyebrow">All displays</p><h2>Choose a case</h2><CaseLinks/><a className="primary-link" href="#/design">Design your own exhibition <Arrow/></a></aside></div>
  </main></>;
}
export function CasePage({ group }) {
  const installation=installations[group.name]; const story=caseStories[group.name]; const label=caseLabels[group.name]; const available=group.objects.map(getObject).filter(Boolean);const pending=group.objects.filter(id=>!getObject(id));
  return <><Breadcrumbs group={group.name}/><main id="content" className="explore-page case-page" tabIndex="-1"><header className="case-heading"><div><p className="eyebrow">Case {story.number} / {story.location}</p><h1>{group.name}</h1><p className="case-subtitle">{story.line}</p></div><p className="case-lead">{label?.lead || story.description}</p></header>
    {label && !installation && <section className="case-interpretation" aria-label={`${group.name} interpretive label`}>{label.paragraphs.map((paragraph,index)=><p key={index}>{paragraph}</p>)}</section>}
    <div className="section-heading"><h2>Objects in conversation</h2>{available.length>1 && <a className="primary-link" href={`${caseUrl(group.name)}/compare`}>Compare two objects <Arrow direction="diagonal"/></a>}</div>
    {installation ? <CaseInstallation key={group.name} installation={installation}>{available.length>0 ? <div className="object-grid">{available.map((item,index)=><a href={objectUrl(item.id)} className="object-card" key={item.id}><div className="card-image">{item.image ? <img loading="lazy" src={item.thumbnail || item.image} alt={item.alt}/> : <div className="photo-placeholder"><span>Photography<br/>forthcoming</span></div>}<span aria-hidden="true"><Arrow direction="diagonal"/></span></div><p className="eyebrow">In the case · {String(index+1).padStart(2,'0')}</p><h3>{item.title}</h3><p>{item.designer} · {item.date}</p>{item.model && <span className="model-available">360° view available</span>}</a>)}</div> : <div className="case-preparation"><h3>A place for the objects to come together.</h3><p>Object photography and individual pages for this case are being prepared. Explore the working Fluting case to see the collection experience.</p><a className="primary-link" href={caseUrl('Fluting')}>Explore Fluting <Arrow direction="diagonal"/></a></div>}</CaseInstallation> : (available.length>0 ? <div className="object-grid">{available.map((item,index)=><a href={objectUrl(item.id)} className="object-card" key={item.id}><div className="card-image">{item.image ? <img loading="lazy" src={item.thumbnail || item.image} alt={item.alt}/> : <div className="photo-placeholder"><span>Photography<br/>forthcoming</span></div>}<span aria-hidden="true"><Arrow direction="diagonal"/></span></div><p className="eyebrow">In the case · {String(index+1).padStart(2,'0')}</p><h3>{item.title}</h3><p>{item.designer} · {item.date}</p>{item.model && <span className="model-available">360° view available</span>}</a>)}</div> : <div className="case-preparation"><h3>A place for the objects to come together.</h3><p>Object photography and individual pages for this case are being prepared. Explore the working Fluting case to see the collection experience.</p><a className="primary-link" href={caseUrl('Fluting')}>Explore Fluting <Arrow direction="diagonal"/></a></div>)}
    {label && installation && <section className="case-interpretation installation-label" aria-label={`${group.name} interpretive label`}>{label.paragraphs.map((paragraph,index)=><p key={index}>{paragraph}</p>)}</section>}
    {pending.length>0 && <details className="pending-roster"><summary>Provisional object roster</summary><p>From the previously supplied case list; awaiting the revised selection.</p><ul>{pending.map(id=><li key={id}>{id}</li>)}</ul></details>}
    {group.alternates?.length > 0 && <section className="alternate-section"><p className="eyebrow">Alternate / not in the display sequence</p><h2>From the study collection</h2>{group.alternates.map(id => <a className="quiet-link" key={id} href={objectUrl(id)}>{getObject(id).designer}: {getObject(id).title} <Arrow direction="right"/></a>)}</section>}
    <nav className="case-connections" aria-label="Continue through the exhibition"><a href="#/map"><Arrow direction="left"/> Back to the map</a><a href={caseUrl(cases[(cases.indexOf(group)+1)%cases.length].name)}>Explore {cases[(cases.indexOf(group)+1)%cases.length].name} <Arrow direction="right"/></a></nav>
  </main></>;
}
export function Compare({ group = cases[0] }) {
  const [selection, setSelection] = useState([group.objects[0], group.objects[1] || group.objects[0]]);
  function change(index, id) { setSelection(current => current.map((value, i) => i === index ? id : value)); }
  return <><Breadcrumbs group={group.name} current="Compare"/><main id="content" className="explore-page compare-page" tabIndex="-1">
    <div className="page-heading"><p className="eyebrow">Across the exhibition</p><h1>Look side by side.</h1><p>Choose a case for each side, then a garment. Follow a connection within one case or discover a relationship across the exhibition.</p></div>
    <div className="comparison-grid">{selection.map((id, index) => {
      const item = getObject(id); const label = index === 0 ? 'First' : 'Second';
      const selectedCase = cases.find(c => c.objects.includes(id));
      return <section key={index} aria-label={`${label} comparison object`}>
        <label className="compare-select">{label} case<select value={selectedCase.name} onChange={e => change(index, cases.find(c => c.name === e.target.value).objects[0])}>{cases.map(c => <option key={c.name}>{c.name}</option>)}</select></label>
        <label className="compare-select">{label} garment<select value={id} onChange={e => change(index, e.target.value)}>{selectedCase.objects.map(getObject).map(o => <option value={o.id} key={o.id}>{o.title}</option>)}</select></label>
        {item.image ? <img src={item.image} alt={item.alt}/> : <div className="comparison-placeholder">Photography forthcoming<br/>{item.title}</div>}
        <h2>{item.title}</h2><dl><div><dt>Designer</dt><dd>{item.designer}</dd></div><div><dt>Date</dt><dd>{item.date}</dd></div><div><dt>Material</dt><dd>{item.material}</dd></div></dl><p>{item.description}</p><a className="quiet-link" href={objectUrl(item.id)}>Explore this object <Arrow direction="diagonal"/></a>
      </section>;
    })}</div><a className="primary-link" href="#/design">Create your own arrangement <Arrow/></a>
  </main></>;
}
