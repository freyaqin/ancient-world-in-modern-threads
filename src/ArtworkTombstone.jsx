import React, { useId, useState } from 'react';

export default function ArtworkTombstone({ item, marker = false, style }) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const id = useId();
  const visible = !dismissed && (open || hovered || focused);
  return <div className={`artwork-tombstone ${marker ? 'artwork-marker' : 'artwork-card'}`} style={style}
    onMouseEnter={() => { setHovered(true); setDismissed(false); }} onMouseLeave={() => setHovered(false)}
    onKeyDown={event => { if (event.key === 'Escape') { setDismissed(true); setOpen(false); } }}>
    <button type="button" aria-label={marker ? `Tombstone: ${item.title}` : undefined} aria-expanded={visible} aria-controls={id}
      onFocus={() => { setFocused(true); setDismissed(false); }} onBlur={() => { setFocused(false); setOpen(false); }}
      onClick={() => { if (visible && open) { setOpen(false); setDismissed(true); } else { setOpen(true); setDismissed(false); } }}>
      {marker ? <span aria-hidden="true">i</span> : <><strong>{item.title}</strong><span className="artwork-hint">View tombstone</span></>}
    </button>
    <div id={id} className="artwork-label" hidden={!visible}>
      <strong>{item.title}</strong><p>{item.designer}</p><p>{item.date}</p><p>{item.material}</p>
      {item.origin && <p>{item.origin}</p>}<p>{item.credit}</p>
      {item.accession && !['Loan','Uncatalogued'].includes(item.accession) && <p className="artwork-accession">{item.accession}</p>}
    </div>
  </div>;
}
