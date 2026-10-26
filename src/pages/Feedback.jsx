import React, { useState } from 'react';
import './feedback.css';

export const SURVEY_URL = 'https://cornell.ca1.qualtrics.com/jfe/form/SV_03ASkdl2PvtFm3I';
export default function Feedback() {
  const [opened, setOpened] = useState(false);
  return <main id="content" tabIndex="-1" className="explore-page feedback-page">
    <p className="eyebrow">Share your experience</p>
    <h1>What stayed<br/><em>with you?</em></h1>
    <p>Your feedback supports Freya Qin’s M.A. research on visitor engagement in fashion exhibitions.</p>
    <section className="feedback-intro" aria-label="About the visitor survey">
      <p>This optional survey takes about 10 minutes and is for visitors aged 18 or older. Read the study information and choose whether to participate inside the survey. You may skip questions or stop at any time. You can explore the exhibition without participating.</p>
      <p>Responses go to the research team through Cornell Qualtrics and are not displayed publicly. Optional raffle and follow-up contact details are collected in a separate form after the survey.</p>
      <div className="feedback-actions">
        {!opened && <button className="primary-link" onClick={() => setOpened(true)}>Open visitor survey here</button>}
        <a href={SURVEY_URL} target="_blank" rel="noopener noreferrer">Open survey in a new tab ↗</a>
        {opened && <button onClick={() => setOpened(false)}>Close survey</button>}
      </div>
      <p className="feedback-note">Qualtrics loads only when you open the survey. Closing this panel does not retract a response already submitted. Incomplete responses are set to be deleted after one hour of inactivity.</p>
    </section>
    {opened && <section aria-label="Visitor survey"><p>If the form does not appear, use the new-tab link above.</p><iframe className="feedback-survey" title="Cornell visitor survey: study information and optional feedback" src={SURVEY_URL} referrerPolicy="no-referrer" /></section>}
  </main>;
}
