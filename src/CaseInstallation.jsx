import React, { useRef, useState } from 'react';
import { getObject } from './data/objects';
import { objectUrl } from './data/site';

export default function CaseInstallation({ installation, children }) {
  const [mode, setMode] = useState(() => window.matchMedia('(min-width: 760px)').matches ? 'gallery' : 'grid');
  const [enlarged, setEnlarged] = useState(false);
  const scroller = useRef(null);
  function toggleSize() {
    setEnlarged(value => !value);
    requestAnimationFrame(() => { if (scroller.current) scroller.current.scrollLeft = 0; });
  }
  return <section className="case-browser" aria-label="Explore the case">
    <div className="installation-toolbar">
      <div className="installation-toggle" role="group" aria-label="Case display mode">
        <button aria-pressed={mode === 'gallery'} onClick={() => setMode('gallery')}>In the gallery</button>
        <button aria-pressed={mode === 'grid'} onClick={() => setMode('grid')}>Object grid</button>
      </div>
      {mode === 'gallery' && <button className="installation-enlarge" aria-pressed={enlarged} onClick={toggleSize}>{enlarged ? 'Fit view' : 'Enlarge view'}</button>}
    </div>
    {mode === 'grid' ? children : <figure className="installation-figure">
      <p id="installation-help" className="installation-help">Select a numbered garment to open its page. Swipe or use the arrow keys to pan when the image extends beyond the screen.</p>
      <div ref={scroller} className="installation-scroll" tabIndex="0" role="region" aria-label={`${installation.name} installation image`} aria-describedby="installation-help" onKeyDown={event => {
          if (event.target !== event.currentTarget) return;
          if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault();
            event.currentTarget.scrollLeft += event.key === 'ArrowRight' ? 100 : -100;
          }
        }}>
        <div className={`installation-scene ${enlarged ? 'enlarged' : ''}`} style={{minWidth: enlarged ? Math.max(1000, installation.minWidth) : installation.minWidth, maxWidth: enlarged ? undefined : installation.maxWidth}}>
          <img src={installation.image} alt={installation.alt} width={installation.width} height={installation.height} />
          {installation.markers.map((marker,index) => {
            const item = getObject(marker.id);
            return <a key={marker.id} className="installation-marker" href={objectUrl(marker.id)} style={{left:`${marker.x}%`,top:`${marker.y}%`}} aria-label={`${index+1}. ${item.title}, ${item.id}`}>
              <span className="marker-number" aria-hidden="true">{index+1}</span><span className="marker-title" aria-hidden="true">{item.title}</span>
            </a>;
          })}
        </div>
      </div>
      <figcaption><strong>Proposed installation</strong><span>Digital mockup · Garment markers open collection pages. Artwork and other borrowed-object records will be added later.</span></figcaption>
      {installation.note && <p className="installation-help">{installation.note}</p>}
      <ol className="installation-key">{installation.markers.map(marker => <li key={marker.id}><a href={objectUrl(marker.id)}>{getObject(marker.id).title}</a></li>)}</ol>
    </figure>}
  </section>;
}
