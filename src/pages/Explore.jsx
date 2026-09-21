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
    <section className="theme-section"><div className="section-heading"><div><p className="eyebrow">Find a thread to follow</p><h2>Explore by theme</h2></div><a className="quiet-link" href="#/map">See the spatial map <Arrow direction="diagonal"/></a></div><CaseLinks/></section>
    <section className="how-to"><h2>A closer encounter</h2><p>Find a case on the map, see the objects together, then open a garment to examine its details. Within each case, compare two objects and follow the changes in material, technique, and form.</p></section>
  </main>;
}
export function ExhibitionMap() {
  const [level, setLevel] = useState('gallery');
  const upperCase = level === 'one' ? 'Meander' : 'Gilded';
  const displays = [['Cascade', 'cascade'], ['Fluting', 'fluting'], ['Contrapposto', 'contrapposto'], [level === 'gallery' ? 'Mantled' : upperCase, 'mantled']];
  return <><Breadcrumbs/><main id="content" tabIndex="-1" className="explore-page map-page">
    <div className="page-heading"><p className="eyebrow">Orient yourself</p><h1>The exhibition,<br/><em>in space.</em></h1><p>Choose a display to explore its objects and the ideas that connect them.</p></div>
    <div className="map-layout"><section className="map-panel" aria-label="Exhibition layout">
      <div className="floor-plan">
        <svg viewBox="0 0 680 540" preserveAspectRatio="none" aria-hidden="true"><path d="M45 25H640V490H500M420 490H280M200 490H45Z"/><path className="circulation" d="M240 515V260H560V210H235V260"/><path d="M230 525l10-10 10 10"/></svg>
        <span className="plan-direction">MVR / HEB circulation</span>
        {displays.map(([name, position]) => {
          const muted = level !== 'gallery' && position !== 'mantled';
          const content = <><span>{caseStories[name].number}</span><strong>{name}</strong>{!muted && <small aria-hidden="true"><Arrow direction="diagonal"/></small>}</>;
          return muted ? <div className={`map-case ${position} map-case-muted`} key={position}>{content}</div> : <a className={`map-case ${position}`} key={position} href={caseUrl(name)}>{content}</a>;
        })}
        <span className={`interactive-station ${level !== 'gallery' ? 'station-muted' : ''}`}><span>Interactive<br/>wall display</span></span>
      </div>
      <div className="map-level-legend" role="group" aria-label="Choose exhibition level"><span>View level</span><div>{[['gallery', 'Main gallery'], ['one', 'Level 1'], ['two', 'Level 2']].map(([id, name]) => <button key={id} aria-pressed={level === id} onClick={() => setLevel(id)}>{name}</button>)}</div></div>
      <p className="map-caption" aria-live="polite">{level === 'gallery' ? 'Meander on Level 1 and Gilded on Level 2 are directly above Mantled. Select a level to see their location.' : `${upperCase} is directly above Mantled. The grayed cases show the main gallery below.`} Schematic layout, not to scale.</p>
    </section><aside className="map-directory"><p className="eyebrow">All displays</p><h2>Choose a case</h2><CaseLinks/></aside></div>
  </main></>;
}
export function CasePage({ group }) {
  const installation=installations[group.name]; const story=caseStories[group.name]; const label=caseLabels[group.name]; const available=group.objects.map(getObject).filter(Boolean);const pending=group.objects.filter(id=>!getObject(id));
  return <><Breadcrumbs group={group.name}/><main id="content" className="explore-page case-page" tabIndex="-1"><header className="case-heading"><div><p className="eyebrow">Case {story.number} / {story.location}</p><h1>{group.name}</h1><p className="case-subtitle">{story.line}</p></div><p className="case-lead">{label?.lead || story.description}</p></header>
    {label && !installation && <section className="case-interpretation" aria-label={`${group.name} interpretive label`}>{label.paragraphs.map((paragraph,index)=><p key={index}>{paragraph}</p>)}</section>}
    <div className="section-heading"><h2>Objects in conversation</h2>{available.length>1 && <a className="primary-link" href={`${caseUrl(group.name)}/compare`}>Compare two objects <Arrow direction="diagonal"/></a>}</div>
    {installation ? <CaseInstallation key={group.name} installation={installation}>{available.length>0 ? <div className="object-grid">{available.map((item,index)=><a href={objectUrl(item.id)} className="object-card" key={item.id}><div className="card-image">{item.image ? <img loading="lazy" src={item.thumbnail || item.image} alt={item.alt}/> : <div className="photo-placeholder"><span>Photography<br/>forthcoming</span></div>}<span aria-hidden="true"><Arrow direction="diagonal"/></span></div><p className="eyebrow">{String(index+1).padStart(2,'0')} / {item.accession || 'Loan'}</p><h3>{item.title}</h3><p>{item.designer} · {item.date}</p>{item.model && <span className="model-available">360° view available</span>}</a>)}</div> : <div className="case-preparation"><h3>A place for the objects to come together.</h3><p>Object photography and individual pages for this case are being prepared. Explore the working Fluting case to see the collection experience.</p><a className="primary-link" href={caseUrl('Fluting')}>Explore Fluting <Arrow direction="diagonal"/></a></div>}</CaseInstallation> : (available.length>0 ? <div className="object-grid">{available.map((item,index)=><a href={objectUrl(item.id)} className="object-card" key={item.id}><div className="card-image">{item.image ? <img loading="lazy" src={item.thumbnail || item.image} alt={item.alt}/> : <div className="photo-placeholder"><span>Photography<br/>forthcoming</span></div>}<span aria-hidden="true"><Arrow direction="diagonal"/></span></div><p className="eyebrow">{String(index+1).padStart(2,'0')} / {item.accession || 'Loan'}</p><h3>{item.title}</h3><p>{item.designer} · {item.date}</p>{item.model && <span className="model-available">360° view available</span>}</a>)}</div> : <div className="case-preparation"><h3>A place for the objects to come together.</h3><p>Object photography and individual pages for this case are being prepared. Explore the working Fluting case to see the collection experience.</p><a className="primary-link" href={caseUrl('Fluting')}>Explore Fluting <Arrow direction="diagonal"/></a></div>)}
    {label && installation && <section className="case-interpretation installation-label" aria-label={`${group.name} interpretive label`}>{label.paragraphs.map((paragraph,index)=><p key={index}>{paragraph}</p>)}</section>}
    {pending.length>0 && <details className="pending-roster"><summary>Provisional object roster</summary><p>From the previously supplied case list; awaiting the revised selection.</p><ul>{pending.map(id=><li key={id}>{id}</li>)}</ul></details>}
    {group.alternates?.length > 0 && <section className="alternate-section"><p className="eyebrow">Alternate / not in the display sequence</p><h2>From the study collection</h2>{group.alternates.map(id => <a className="quiet-link" key={id} href={objectUrl(id)}>{getObject(id).designer}: {getObject(id).title} <Arrow direction="right"/></a>)}</section>}
    <nav className="case-connections" aria-label="Continue through the exhibition"><a href="#/map"><Arrow direction="left"/> Back to the map</a><a href={caseUrl(cases[(cases.indexOf(group)+1)%cases.length].name)}>Explore {cases[(cases.indexOf(group)+1)%cases.length].name} <Arrow direction="right"/></a></nav>
  </main></>;
}
export function Compare({ group }) {
  const available=group.objects.map(getObject).filter(item=>item?.image);
  const [left,setLeft]=useState(available[0]?.id);const [right,setRight]=useState(available[1]?.id);
  if(available.length<2)return <CasePage group={group}/>;
  return <><Breadcrumbs group={group.name} current="Compare"/><main id="content" className="explore-page compare-page" tabIndex="-1"><div className="page-heading"><p className="eyebrow">In conversation / {group.name}</p><h1>Look side by side.</h1><p>{caseStories[group.name].description} Compare how material, silhouette, and surface change from one object to another. Objects awaiting photography will join this view when images are available.</p></div><div className="comparison-grid">{[[left,setLeft,right,'First'],[right,setRight,left,'Second']].map(([id,setId,other,label])=>{const item=getObject(id);return <section key={label} aria-label={`${label} comparison object`}><label className="compare-select">{label} object<select value={id} onChange={e=>setId(e.target.value)}>{available.map(o=><option value={o.id} disabled={o.id===other} key={o.id}>{o.designer} — {o.id}</option>)}</select></label><img src={item.image} alt={item.alt}/><h2>{item.title}</h2><dl><div><dt>Designer</dt><dd>{item.designer}</dd></div><div><dt>Date</dt><dd>{item.date}</dd></div><div><dt>Material</dt><dd>{item.material}</dd></div></dl><p>{item.description}</p><a className="quiet-link" href={objectUrl(item.id)}>Explore this object <Arrow direction="diagonal"/></a></section>;})}</div><a className="primary-link" href={caseUrl(group.name)}>Return to {group.name} <Arrow direction="right"/></a></main></>;
}
