import React, { useState, useEffect, useRef } from 'react';
import { useParticipation, beginTestSession, endTestSession, finishMeasurement, sessionSummary } from './store';
import '../pages/feedback.css';
export const SESSION_SURVEY_URL = 'https://cornell.ca1.qualtrics.com/jfe/form/SV_d770bWAr46P7PFQ';
export function SessionBar() {
  const state = useParticipation();
  return state.session && <aside className="session-research-bar" aria-label="Optional research session"><span>{state.enabled ? 'Your visit is being recorded on this device only. Nothing has been sent.' : 'Recording stopped. You can review your visit before sharing it.'}</span><a href="#/share-session">Review and share</a><button onClick={endTestSession}>Stop and delete my visit</button></aside>;
}
export default function SessionResearch({ embedded = false, onClose }) {
  const Container = embedded ? 'div' : 'main';
  const state = useParticipation(); const [adult,setAdult]=useState(false); const [agree,setAgree]=useState(false); const [review,setReview]=useState(null); const [message,setMessage]=useState('');
  function prepare() { finishMeasurement(); setReview(JSON.stringify(sessionSummary(),null,2)); setMessage('Recording stopped. Review your visit and remove anything you do not want to share.'); }
  async function copy() { try { await navigator.clipboard.writeText(review); setMessage('Copied. Open the Qualtrics form, read its consent information, then paste the summary and submit. Copying alone does not send it.'); } catch { setMessage('Copy is unavailable here. Select the summary text and copy it manually.'); } }
  return <Container id={embedded ? undefined : "content"} tabIndex="-1" className="explore-page feedback-page"><p className="eyebrow">Optional research participation</p><h1>Share your<br/><em>exploration.</em></h1><section className="feedback-intro"><h2>Would you like to share how you explore?</h2><p>Help the curator understand how visitors engage with exhibition interpretation. You can use every exhibition feature without participating. This choice is separate from the visitor survey and future research activities. You can also leave contact details after the visitor survey to hear about future workshop opportunities.</p><p>If you choose to participate, the website keeps track of the pages you visit, about how long you spend viewing them, the features you use, and how often words appear in reflections you submit. Unsent drafts and full conversations are not included. A random code distinguishes this visit; it does not link your separate visits or tabs.</p><p>This information stays on your device until you choose to share it. When you finish exploring, you can review it, remove anything you do not want to share, and copy it into a Cornell Qualtrics form. Nothing is sent automatically. Closing or refreshing this tab deletes the information kept here. Please avoid names or identifying details in your reflections.</p><p>Research participation is for adults 18 or older. Your choice does not affect grades, employment, or relationships with Cornell personnel. You may stop and delete this information at any time. After submission, contact the researcher with your session code about removal; deleting information here does not delete a submitted response.</p><p>Questions: <a href="mailto:yq322@cornell.edu">Freya Qin</a>. Participant rights: Cornell IRB, 607-255-6182, <a href="https://researchservices.cornell.edu/offices/IRB">IRB website</a>; concerns: hotline.cornell.edu or 1-866-293-3077.</p>
  {!state.session ? <form onSubmit={e=>{e.preventDefault(); if(beginTestSession({adult,analytics:agree})){setReview(null);setMessage('Explore the exhibition, then choose Review and share when you finish.');if(onClose) onClose(); else window.location.hash='/map';}}}><label className="session-choice"><input type="checkbox" checked={adult} onChange={e=>setAdult(e.target.checked)}/> I am at least 18 years old.</label><label className="session-choice"><input type="checkbox" checked={agree} onChange={e=>setAgree(e.target.checked)}/> I agree to record this visit on my device so I can choose whether to share it for research.</label><div className="feedback-actions"><button disabled={!adult || !agree}>Start exploring</button><a href="#/map" onClick={onClose}>Explore without participating</a></div></form> : <div className="feedback-actions"><button onClick={prepare}>Finish and review my visit</button><button onClick={()=>{endTestSession();setReview(null);setMessage('Information about this visit deleted.');}}>Delete my visit</button><a href="#/map">Back to exhibition</a></div>}
  <p className="feedback-note">Viewing time excludes hidden tabs and stops after 60 seconds without activity. It estimates active viewing, not attention. Feature-use counts do not show which features you liked. Word counts count occurrences, not people; “colour” and “color” are combined.</p></section>
  {review !== null && state.session && <section className="feedback-intro"><h2>Review before you share</h2><p>You can remove any words or entries. Keep a copy of the session code if you want to refer to this submission later. Submit each session only once.</p><label htmlFor="session-summary">Your editable summary</label><textarea id="session-summary" className="session-summary" rows={16} value={review} onChange={e=>setReview(e.target.value)}/><div className="feedback-actions"><button onClick={copy}>Copy reviewed summary</button>{SESSION_SURVEY_URL && <a href={SESSION_SURVEY_URL} target="_blank" rel="noopener noreferrer">Open Qualtrics submission form ↗</a>}</div><p>Read the study information in Qualtrics, paste your summary, and select Next to submit. A confirmation appears in Qualtrics when it finishes; this website cannot confirm submission.</p></section>}
  <p role="status">{message}</p></Container>;
}

let invitationShown = false;
export function SessionInvitation({ route }) {
  const { session } = useParticipation();
  const [open, setOpen] = useState(false);
  const dialog = useRef(null);
  useEffect(() => {
    if (invitationShown || session || ['/share-session', '/feedback'].includes(route)) return;
    const timer = setTimeout(() => { invitationShown = true; setOpen(true); }, 6000);
    return () => clearTimeout(timer);
  }, [route, session]);
  useEffect(() => { if(open) dialog.current?.showModal(); }, [open]);
  function close() { dialog.current?.close(); setOpen(false); }
  if (!open) return null;
  return <dialog ref={dialog} className="session-invitation" aria-label="Share your exploration" onCancel={close} onClick={e=>{if(e.target===dialog.current) close();}}>
    <button className="session-invitation-close" onClick={close} aria-label="Close invitation">Close ×</button>
    <SessionResearch embedded onClose={close}/>
  </dialog>;
}
