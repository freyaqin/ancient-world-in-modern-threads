import React, { useId, useState } from 'react';

// Interface testing only: no network calls, browser storage, or analytics.
export default function ObjectResponse({ question }) {
  const id = useId();
  const [response, setResponse] = useState('');
  const [result, setResult] = useState('');
  const limit = 1500;
  return <section className="looking-question" aria-labelledby={`${id}-question`}>
    <p className="eyebrow">Pause and look</p>
    <h2 id={`${id}-question`}>{question}</h2>
    <form className="object-response" onSubmit={event => {
      event.preventDefault();
      setResult(response.trim() ? 'Test complete. Your response was not sent or saved.' : 'Question skipped. No answer was required or saved.');
      setResponse('');
    }}>
      <p id={`${id}-notice`} className="response-notice">Interface test only. Try a made-up reflection or skip this question. Nothing you type is sent or saved; drafts disappear when you leave this object page or refresh.</p>
      {!result && <>
        <label htmlFor={`${id}-answer`}>Your reflection <span>(optional)</span></label>
        <textarea id={`${id}-answer`} rows={4} maxLength={limit} value={response}
          onChange={event => setResponse(event.target.value)}
          aria-describedby={`${id}-notice ${id}-count`}
          placeholder="What catches your eye? There is no single right answer." />
        <p id={`${id}-count`} className="response-count">{response.length} / {limit} characters</p>
        <div className="response-actions">
          <button type="submit">Test submit</button>
          <button type="button" className="response-clear" onClick={() => { setResponse(''); setResult('Question skipped. No answer was required or saved.'); }}>Skip question</button>
          <button type="button" className="response-clear" disabled={!response} onClick={() => setResponse('')}>Clear draft</button>
        </div>
      </>}
      <p role="status" aria-live="polite" className="response-result">{result}</p>
      {result && <div className="response-actions"><button type="button" onClick={() => setResult('')}>Try again</button></div>}
    </form>
  </section>;
}
