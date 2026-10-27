
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Calibration.css';

const steps = [
  { title: 'Welcome', icon: '①' },
  { title: 'Camera Check', icon: '▣' },
  { title: 'Microphone Check', icon: '♬' },
  { title: 'Facial & Voice Scan', icon: '◎' },
  { title: 'Calibration Complete', icon: '✦' },
];

const captures = [
  {
    icon: '◎',
    title: 'Facial Expressions',
    description:
      'A future emotion model can analyze facial expressions and subtle movements to estimate emotional cues.',
    color: 'pink',
  },
  {
    icon: '♬',
    title: 'Voice & Tone',
    description:
      'A future audio model can study voice patterns and tone to estimate energy and emotional cues.',
    color: 'purple',
  },
  {
    icon: '🎮',
    title: 'Gameplay Behavior',
    description:
      'Gameplay interactions can help understand response patterns and adapt the gaming experience.',
    color: 'blue',
  },
];

function Calibration() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [cameraReady, setCameraReady] = useState(false);
  const [micReady, setMicReady] = useState(false);
  const [consent, setConsent] = useState(false);
  const [message, setMessage] = useState('');

  async function checkCamera() {
    setMessage('');

    if (!consent) {
      setMessage('Please give consent before testing your camera.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      stream.getTracks().forEach((track) => track.stop());
      setCameraReady(true);
      setMessage('Camera check completed for this demo.');
    } catch {
      setMessage('Camera unavailable or permission denied. You can still continue the demo.');
    }
  }

  async function checkMicrophone() {
    setMessage('');

    if (!consent) {
      setMessage('Please give consent before testing your microphone.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });

      stream.getTracks().forEach((track) => track.stop());
      setMicReady(true);
      setMessage('Microphone permission check completed for this demo.');
    } catch {
      setMessage('Microphone unavailable or permission denied. You can still continue the demo.');
    }
  }

  function continueStep() {
    setMessage('');
    setStep((current) => Math.min(current + 1, steps.length - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function finishCalibration() {
    navigate('/dashboard');
  }

  return (
    <main className="calibration-page">
      <div className="calibration-orb calibration-orb-left" />
      <div className="calibration-orb calibration-orb-right" />

      <header className="calibration-navbar">
        <a className="calibration-brand" href="/">
          <span className="calibration-brand-icon">♡</span>
          <span className="calibration-brand-copy">
            <strong>EmotiCore</strong>
            <small>
              Powered by <b>Emotion.</b> Driven by <b>AI.</b>
            </small>
          </span>
        </a>

        <nav className="calibration-nav-links" aria-label="Main navigation">
          <a href="/">Home</a>
          <a href="#dashboard">Dashboard</a>
          <a href="#emotion-engine">Emotion Engine</a>
          <a href="#game-arena">Game Arena</a>
          <a href="#analytics">Analytics</a>
          <a href="#settings">Settings</a>
        </nav>

        <a className="calibration-back-button" href="/">
          <span>←</span> Back to Home
        </a>
      </header>

      <section className="calibration-hero">
        <span className="calibration-eyebrow">
          <span>◎</span> AI Calibration
        </span>

        <h1>
          Let’s understand your
          <br />
          <span>gaming state.</span>
        </h1>

        <p className="calibration-hero-description">
          EmotiCore will help prepare your personalized gaming experience.
          Camera and microphone checks are optional in this demo.
        </p>

       
<div className="calibration-hero-art">
  <img
    className="calibration-hero"
    src="/calibration-hero.png"
    alt="Emotion-aware gaming experience illustration"
  />
</div>

      </section>

      <section className="calibration-stepper" aria-label="Calibration steps">
        {steps.map((item, index) => (
          <button
            type="button"
            key={item.title}
            className={`calibration-step ${index === step ? 'active' : ''} ${
              index < step ? 'completed' : ''
            }`}
            onClick={() => {
              setStep(index);
              setMessage('');
            }}
          >
            <span className="calibration-step-icon">
              {index < step ? '✓' : item.icon}
            </span>
            <span className="calibration-step-number">{index + 1}</span>
            <span className="calibration-step-title">{item.title}</span>
          </button>
        ))}
      </section>

      <section className="calibration-capture-section">
        <span className="calibration-section-icon">〰</span>
        <h2>{step === 0 ? 'What We’ll Capture' : steps[step].title}</h2>

<section className="why-calibration">
  <div className="why-calibration-content">
    <h2>Why Calibration?</h2>
    <ul>
      <li>Personalized game recommendations</li>
      <li>Adaptive difficulty for your current state</li>
      <li>A smoother, smarter and more enjoyable experience</li>
      <li>Games that respond to how you feel</li>
    </ul>
  </div>

  <img
    className="why-calibration-image"
    src="/why-calibration.png"
    alt="Why AI calibration improves the gaming experience"
  />
</section>

        <p className="calibration-section-description">
          {step === 0
            ? 'Explore the signals that may help personalize your gaming experience.'
            : 'Follow the steps below. You can continue without enabling your devices.'}
        </p>

        {step === 0 ? (
          <div className="calibration-capture-grid">
            {captures.map((item) => (
              <article
                className={`capture-card capture-${item.color}`}
                key={item.title}
              >
                <div className="capture-card-top">
                  <span className="capture-icon">{item.icon}</span>
                  <span className="capture-check">✓</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        ) : (
          <div className="calibration-action-panel">
            <div className="calibration-action-symbol">
              {step === 1 ? '▣' : step === 2 ? '♬' : step === 3 ? '◎' : '✦'}
            </div>
            <div className="calibration-action-copy">
              <h3>
                {step === 1
                  ? 'Camera permission check'
                  : step === 2
                    ? 'Microphone permission check'
                    : step === 3
                      ? 'Facial & voice scan preview'
                      : 'Your setup is ready'}
              </h3>
              <p>
                {step === 1
                  ? 'Choose whether to allow temporary camera access for this demo.'
                  : step === 2
                    ? 'Choose whether to allow temporary microphone access for this demo.'
                    : step === 3
                      ? 'Real facial and voice analysis is not connected yet. This screen is a UI preview only.'
                      : 'You have completed the demo calibration steps.'}
              </p>

              {step === 1 && (
                <button className="calibration-device-button" type="button" onClick={checkCamera}>
                  {cameraReady ? 'Camera Checked ✓' : 'Check Camera'}
                </button>
              )}

              {step === 2 && (
                <button className="calibration-device-button" type="button" onClick={checkMicrophone}>
                  {micReady ? 'Microphone Checked ✓' : 'Check Microphone'}
                </button>
              )}
            </div>
          </div>
        )}

        <label className="calibration-consent">
          <input
            type="checkbox"
            checked={consent}
            onChange={(event) => setConsent(event.target.checked)}
          />
          <span>
            I consent to temporary camera or microphone access when I choose to test them.
            Device access is optional.
          </span>
        </label>

        {message && (
          <p className="calibration-message" role="status">
            {message}
          </p>
        )}

        <div className="calibration-actions">
          {step > 0 && (
            <button
              className="calibration-previous-button"
              type="button"
              onClick={() => {
                setStep((current) => Math.max(current - 1, 0));
                setMessage('');
              }}
            >
              ← Back
            </button>
          )}

          {step < steps.length - 1 ? (
            <button
              className="calibration-start-button"
              type="button"
              onClick={continueStep}
            >
              {step === 0 ? 'Start AI Calibration' : 'Continue'}
              <span>→</span>
            </button>
          ) : (
            <button
              className="calibration-start-button"
              type="button"
              onClick={finishCalibration}
            >
              Continue to Dashboard <span>→</span>
            </button>
          )}
        </div>

        <p className="calibration-security-note">
          <span>♙</span> Your privacy matters. Device access is requested only when you choose a check.
        </p>
      </section>

      <footer className="calibration-page-footer">
        <span>© 2026 EmotiCore</span>
        <span>POWERED BY EMOTION. DRIVEN BY AI.</span>
      </footer>
    </main>
  );
}

export default Calibration;
