import React, { useId, useState } from 'react';

// Deliberately memory-only until the research notice and storage service are supplied.
// No browser storage, analytics, or network requests are made for responses.
export default function ObjectResponse({ question }) {
  const id = useId();
  const [response, setResponse] = useState('');
  const limit = 1500;
  return <section className="looking-question" aria-labelledby={`${id}-question`}>
    <p className="eyebrow">Pause and look</p>
    <h2 id={`${id}-question`}>{question}</h2>
    <div className="object-response">
      <p id={`${id}-notice`} className="response-notice">Response collection is not open yet. You can try writing a reflection here, but it will not be sent or saved and will disappear when you leave this object page or refresh.</p>
      <label htmlFor={`${id}-answer`}>Your reflection <span>(optional)</span></label>
      <textarea id={`${id}-answer`} rows={4} maxLength={limit} value={response}
        onChange={event => setResponse(event.target.value)}
        aria-describedby={`${id}-notice ${id}-count`}
        placeholder="What catches your eye? There is no single right answer." />
      <p id={`${id}-count`} className="response-count">{response.length} / {limit} characters</p>
      <div className="response-actions">
        <button type="button" disabled aria-describedby={`${id}-notice`}>Submit response · coming soon</button>
        <button type="button" className="response-clear" disabled={!response} onClick={() => setResponse('')}>Clear draft</button>
      </div>
    </div>
  </section>;
}
