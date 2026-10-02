import React, { useId, useRef, useState } from 'react';
import { openingQuestion, followUpFor } from './data/reflection';

export default function ObjectResponse() {
  const id = useId();
  const [response, setResponse] = useState('');
  const [followUp, setFollowUp] = useState('');
  const [step, setStep] = useState(0);
  const [result, setResult] = useState('');
  const heading = useRef(null);
  const question = step === 1 ? followUp : openingQuestion;
  function finish() { setResponse(''); setResult('Test complete. Nothing was sent or saved.'); }
  function advance(event) {
    event.preventDefault();
    if (step === 0 && response.trim()) {
      setFollowUp(followUpFor(response)); setResponse(''); setStep(1);
      requestAnimationFrame(() => heading.current?.focus());
    } else finish();
  }
  return <section className="looking-question" aria-labelledby={`${id}-question`}>
    <p className="eyebrow">Pause and look {step === 1 && '· A little further'}</p>
    <h2 id={`${id}-question`} ref={heading} tabIndex="-1">{question}</h2>
    <form className="object-response" onSubmit={advance}>
      <p id={`${id}-notice`} className="response-notice">Interface test only. Reflections are optional and are not sent or saved. Follow-up prompts use simple word matching on this device.</p>
      {!result && <><label htmlFor={`${id}-answer`}>Your reflection <span>(optional)</span></label>
        <textarea id={`${id}-answer`} rows={3} maxLength={1500} value={response} onChange={e => setResponse(e.target.value)} aria-describedby={`${id}-notice ${id}-count`} placeholder="There is no single right answer."/>
        <p id={`${id}-count`} className="response-count">{response.length} / 1500 characters</p>
        <div className="response-actions"><button type="submit">{step === 0 ? 'Continue' : 'Finish test'}</button><button type="button" className="response-clear" onClick={finish}>Skip question</button></div>
      </>}
      <p role="status" className="response-result">{result}</p>
      {result && <div className="response-actions"><button type="button" onClick={() => {setResult(''); setStep(0); setFollowUp('');}}>Try again</button></div>}
    </form>
  </section>;
}
