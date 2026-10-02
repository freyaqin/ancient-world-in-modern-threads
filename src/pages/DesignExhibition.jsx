import React, { useEffect, useRef, useState } from 'react';
import { cases } from '../data/exhibition';
import { getObject } from '../data/objects';
import { assetPath } from '../data/asset-path';
import { blankDesign, designCases, slotPositions } from '../data/design-cases';
import { Breadcrumbs } from './Explore';

const storageKey = 'exhibition-personal-design-v1';
const collection = cases.flatMap(c => c.objects.map(getObject));
function ObjectPicker({ used, onChoose, onClose }) {
  const dialog = useRef(null);
  const [group, setGroup] = useState('All cases');
  const [query, setQuery] = useState('');
  useEffect(() => { dialog.current.showModal(); }, []);
  const available = collection.filter(o => (group === 'All cases' || o.collection === group) && `${o.title} ${o.designer} ${o.id}`.toLowerCase().includes(query.toLowerCase()));
  return <dialog ref={dialog} className="object-picker" aria-labelledby="picker-title" onCancel={onClose}>
    <header><h2 id="picker-title">Choose a garment</h2><button type="button" onClick={onClose} aria-label="Close garment picker">Close</button></header>
    <div className="picker-filters"><label>Case<select value={group} onChange={e => setGroup(e.target.value)}><option>All cases</option>{cases.map(c => <option key={c.name}>{c.name}</option>)}</select></label><label>Search garments<input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Title, designer, or accession"/></label></div>
    <p>{available.length} garments · Choose from any case.</p>
    <div className="picker-grid">{available.map(o => <button type="button" key={o.id} disabled={used.includes(o.id)} onClick={() => onChoose(o.id)}>
      {o.image ? <img loading="lazy" src={o.thumbnail || o.image} alt=""/> : <span className="picker-placeholder">Photography forthcoming</span>}
      <strong>{o.title}</strong><span>{o.collection}</span>{used.includes(o.id) && <small>Already in this case</small>}
    </button>)}</div>
    {!available.length && <p>No garments match. Try another search or case.</p>}
  </dialog>;
}
export default function DesignExhibition() {
  const [scope, setScope] = useState('single');
  const [activeCase, setActiveCase] = useState('Cascade');
  const [design, setDesign] = useState(blankDesign);
  const [slot, setSlot] = useState(null);
  const [notice, setNotice] = useState('');
  const trigger = useRef(null);
  const config = designCases[activeCase]; const slots = design[activeCase];
  function updateSlots(next) { setDesign(current => ({...current, [activeCase]: next})); setNotice('Unsaved changes. Save on this device to keep your arrangement.'); }
  function openPicker(index, event) { trigger.current = event.currentTarget; setSlot(index); }
  function closePicker() { setSlot(null); requestAnimationFrame(() => trigger.current?.focus()); }
  function choose(id) { updateSlots(slots.map((value, index) => index === slot ? id : value)); closePicker(); }
  function save() {
    try { localStorage.setItem(storageKey, JSON.stringify(design)); setNotice('Saved on this device only. Your arrangement has not been submitted to the exhibition.'); }
    catch { setNotice('This browser could not save locally. Download your arrangement instead.'); }
  }
  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey));
      if (!saved) { setNotice('No saved arrangement on this device yet.'); return; }
      const next = blankDesign();
      for (const [name, c] of Object.entries(designCases)) {
        const values = saved[name];
        if (!Array.isArray(values) || values.length < c.min || values.length > c.max || values.some(id => id !== null && !collection.some(o => o.id === id))) throw new Error('Invalid saved layout');
        next[name] = values;
      }
      setDesign(next); setNotice('Your saved arrangement is loaded.');
    } catch { setNotice('The saved arrangement could not be loaded. Your current work has been kept.'); }
  }
  function download() {
    const selected = scope === 'single' ? {[activeCase]: slots} : design;
    const output = {title: 'My exhibition arrangement', cases: Object.fromEntries(Object.entries(selected).map(([name, ids]) => [name, ids.map(id => id ? {id, title:getObject(id).title} : null)]))};
    const url = URL.createObjectURL(new Blob([JSON.stringify(output, null, 2)], {type:'application/json'}));
    const link = document.createElement('a'); link.href = url; link.download = 'my-exhibition.json'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice('Downloaded your selected arrangement.');
  }
  return <><Breadcrumbs current="Design your own exhibition"/><main id="content" className="explore-page design-page" tabIndex="-1">
    <div className="page-heading"><p className="eyebrow">Your turn to curate</p><h1>Design your own<br/><em>exhibition.</em></h1><p>Bring garments together in a new way. Start with one case or arrange the whole exhibition. What connections will you make?</p></div>
    <div className="design-toolbar"><div className="installation-toggle" role="group" aria-label="Design scope"><button aria-pressed={scope === 'single'} onClick={() => setScope('single')}>One case</button><button aria-pressed={scope === 'all'} onClick={() => setScope('all')}>Whole exhibition</button></div>
      <label>Choose a case<select value={activeCase} onChange={e => {setActiveCase(e.target.value); setSlot(null);}}>{cases.map(c => <option key={c.name}>{c.name}</option>)}</select></label>
      {config.min !== config.max && <label>Number of spaces<select value={slots.length} onChange={e => updateSlots(Array.from({length:Number(e.target.value)}, (_, i) => slots[i] || null))}>{Array.from({length: config.max-config.min+1}, (_, i) => config.min+i).map(n => <option key={n} value={n} disabled={slots.slice(n).some(Boolean)}>{n}{slots.slice(n).some(Boolean) ? ' · clear last slots first' : ''}</option>)}</select></label>}
    </div>
    {scope === 'all' && <nav className="design-overview" aria-label="Your exhibition cases">{cases.map(c => <button key={c.name} aria-pressed={activeCase === c.name} onClick={() => setActiveCase(c.name)}><strong>{c.name}</strong><span>{design[c.name].filter(Boolean).length} / {design[c.name].length} placed</span></button>)}</nav>}
    <div className="section-heading"><h2>{activeCase}</h2><p>{slots.filter(Boolean).length} of {slots.length} spaces filled</p></div>
    <p className="installation-help">Select + to add a garment. Select a filled space to replace it. Photographs show your arrangement as a layout study; scale is approximate.{activeCase === 'Fluting' && ' Three spaces sit on each side of the monitor.'} On phones, swipe across the case.</p>
    <div className="design-scroller" tabIndex="0" role="region" aria-label={`${activeCase} arrangement`}>
      <div className={`design-scene ${activeCase === 'Contrapposto' ? 'portrait' : ''}`}>
        <img className="blank-case" src={assetPath(config.image)} alt={`Empty ${activeCase} display case`}/>
        {slotPositions(activeCase, slots.length).map((x, index) => {
          const object = getObject(slots[index]);
          return <button type="button" key={index} className={`design-slot ${object ? 'filled' : ''}`} style={{left:`${x}%`,top:`${config.top}%`,height:`${config.bottom-config.top}%`,width:activeCase === 'Contrapposto' ? '18%' : activeCase === 'Cascade' ? `${Math.min(9, 62/slots.length)}%` : '10%'}} onClick={e => openPicker(index, e)} aria-label={object ? `Replace slot ${index+1}: ${object.title}` : `Add garment to slot ${index+1}`}>
            {object ? <>{object.image ? <img src={object.thumbnail || object.image} alt=""/> : <span className="slot-placeholder">{object.title}<small>Image forthcoming</small></span>}<span className="slot-number">{index+1}</span></> : <><span className="slot-plus" aria-hidden="true">+</span><span>Slot {index+1}</span></>}
          </button>;
        })}
      </div>
    </div>
    <ol className="design-slot-list">{slots.map((id,index) => <li key={index}><span><strong>{index+1}.</strong> {id ? getObject(id).title : 'Empty space'}</span><div><button onClick={e => openPicker(index,e)}>{id ? 'Replace' : 'Add garment'}</button>{id && <button aria-label={`Remove ${getObject(id).title} from slot ${index+1}`} onClick={() => updateSlots(slots.map((v,i) => i === index ? null : v))}>Remove</button>}</div></li>)}</ol>
    <div className="design-save"><p>Your layout stays in this page until you leave. You can save it on this device or download it. Nothing is sent to the researcher.</p><div className="response-actions"><button onClick={save}>Save on this device</button><button className="response-clear" onClick={load}>Load saved design</button><button className="response-clear" onClick={download}>Download arrangement</button></div><p role="status">{notice}</p></div>
    {slot !== null && <ObjectPicker used={slots.filter((id,i) => id && i !== slot)} onChoose={choose} onClose={closePicker}/>}
  </main></>;
}
