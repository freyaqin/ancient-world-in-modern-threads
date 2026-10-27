import SessionResearch, { SessionBar } from './participation/SessionResearch';
import { Measurement } from './participation/Measurement';
import Feedback from './pages/Feedback';
import Arrow from './Arrow';
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import ObjectPage from './ObjectPage';
import DesignExhibition from './pages/DesignExhibition';
import { Home, ExhibitionMap, CasePage, Compare } from './pages/Explore';
import { cases } from './data/exhibition';
import { caseSlug, site } from './data/site';
import { getObject } from './data/objects';
import './styles.css';
import './explore.css';

function readRoute() { return window.location.hash.slice(1) || '/'; }
function App() {
  const [route,setRoute]=useState(readRoute);
  useEffect(()=>{const update=()=>setRoute(readRoute());window.addEventListener('hashchange',update);return()=>window.removeEventListener('hashchange',update);},[]);
  useEffect(()=>{window.scrollTo(0,0);requestAnimationFrame(()=>document.getElementById('content')?.focus({preventScroll:true}));},[route]);
  let page, title=site.title; const parts=route.split('/');
  const legacyCases={cascade:'gathers',contrapposto:'posture',fluting:'pleats',mantled:'layers',meander:'greece',gilded:'egypt'};
  const group=cases.find(item=>caseSlug(item.name)===(legacyCases[parts[2]] || parts[2]));
  let item;try{item=getObject(decodeURIComponent(parts[2]||''));}catch{}
  if(route==='/' || route==='')page=<Home/>;
  else if(route==='/share-session') {page=<SessionResearch/>;title='Share your exploration';}
  else if(route==='/feedback') {page=<Feedback/>;title='Feedback';}
  else if(route==='/design') {page=<DesignExhibition/>;title='Design your own exhibition';}
  else if(route==='/compare') {page=<Compare/>;title='Compare garments';}
  else if(route==='/map') {page=<ExhibitionMap/>;title='Exhibition map';}
  else if(parts[1]==='case' && group && (!parts[3] || parts[3]==='compare')){page=parts[3]==='compare'?<Compare key={group.name} group={group}/>:<CasePage group={group}/>;title=group.name;}
  else if(parts[1]==='object' && item){page=<ObjectPage key={item.id} object={item}/>;title=item.title;}
  else page=<main id="content" className="explore-page not-found" tabIndex="-1"><h1>Page not found</h1><p>This object or display is not available in this preview.</p><a className="primary-link" href="#/map">Return to the exhibition map</a></main>;
  useEffect(()=>{document.title=title===site.title?title:`${title} · ${site.title}`;},[title]);
  const isObject=parts[1]==='object' && !!item;
  return <><Measurement route={route}/><a className="skip-link" href="#content" onClick={event=>{event.preventDefault();document.getElementById('content')?.focus();}}>Skip to content</a><header className="exhibition-header"><a href="#/" className="exhibition-brand">Ancient Worlds<span>in Modern Threads</span></a><nav aria-label="Main navigation"><a href="#/" aria-current={route==='/'?'page':undefined}>Home</a><a href="#/map" aria-current={route==='/map'?'page':undefined}>Exhibition map</a><a href="#/design" aria-current={route==='/design'?'page':undefined}>Design your own</a><a href="#/feedback" aria-current={route==='/feedback'?'page':undefined}>Feedback</a><a href="#/share-session" aria-current={route==='/share-session'?'page':undefined}>Share your exploration</a></nav></header><SessionBar/>{page}{!isObject && <footer className="exhibition-footer"><span>{site.title}</span><span>{site.subtitle}</span><a href="#/map">Explore the map <Arrow direction="diagonal"/></a></footer>}</>;
}
createRoot(document.getElementById('root')).render(<App/>);
