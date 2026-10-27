import { useEffect } from 'react';
import { useParticipation, recordTime, recordFeature } from './store';
export function Measurement({ route }) {
  const { enabled, session } = useParticipation();
  useEffect(() => {
    if (!enabled || ['/research-preview','/share-session'].includes(route)) return;
    let last = performance.now(), active = last, total = 0, visible = document.visibilityState === 'visible';
    const tick = () => { const now=performance.now(); if (visible) total += Math.max(0, Math.min(now,active+60000)-last)/1000; last=now; };
    const activity = () => { tick(); active=performance.now(); };
    const visibility = () => { tick(); visible=document.visibilityState==='visible'; if(visible) active=last; };
    const flush = () => { tick(); recordTime(route,total,session.id); total=0; };
    const interval=setInterval(flush,5000);
    ['pointerdown','keydown','scroll'].forEach(name=>window.addEventListener(name,activity,{passive:true}));
    document.addEventListener('visibilitychange',visibility);
    window.addEventListener('pagehide',flush);
    window.addEventListener('exhibition-flush',flush);
    return () => { flush(); clearInterval(interval); ['pointerdown','keydown','scroll'].forEach(name=>window.removeEventListener(name,activity)); document.removeEventListener('visibilitychange',visibility);window.removeEventListener('pagehide',flush);window.removeEventListener('exhibition-flush',flush); };
  },[route,enabled,session]);
  useEffect(()=>{
    const click = e => { const el=e.target.closest('button,a'); if(!el) return;
      const feature=el.dataset.feature;
      const href=el.getAttribute('href') || '';
      const label=el.textContent.trim();
      if(feature) recordFeature(feature);
      else if(href.includes('/compare')) recordFeature('Comparisons');
      else if(href==='#/design') recordFeature('Exhibition design');
      else if(href==='#/map') recordFeature('Exhibition map');
      else if(label==='Photos') recordFeature('Photographs');
      else if(label==='Closer look' || /^Detail \d+$/.test(label)) recordFeature('Close-up photographs');
    };
    document.addEventListener('click',click);return()=>document.removeEventListener('click',click);
  },[]);
  return null;
}
