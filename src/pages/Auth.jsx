
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const features = [
  { icon: '♧', title: 'Emotion Tracking', description: 'Real-time emotion analysis & insights', color: 'blue' },
  { icon: '🎮', title: 'Adaptive Gameplay', description: 'Games adjust to match your state', color: 'purple' },
  { icon: '✿', title: 'Personalized Recommendations', description: 'AI suggests the best for you', color: 'pink' },
  { icon: '★', title: 'Progress & Achievements', description: 'Track, achieve and level up', color: 'orange' },
];

const testimonials = [
  { quote: 'EmotiCore feels like it was built just for me. The games adapt perfectly to how I feel!', author: 'Alex, EmotiCore Player' },
  { quote: 'I love how the gaming experience changes with my mood. Every session feels different!', author: 'Sam, EmotiCore Player' },
  { quote: 'A fresh way to play games while understanding my focus and emotions.', author: 'Jamie, EmotiCore Player' },
  { quote: 'The personalized experience makes every gaming session more enjoyable.', author: 'Taylor, EmotiCore Player' },
];

function AuthNavbar({ onBackHome }) {
  return (
    <nav className="auth-navbar">
      <a href="/" className="auth-brand" onClick={onBackHome}>
        <span className="auth-brand-logo">♡</span>
        <span className="auth-brand-text">
          <strong>EmotiCore</strong>
          <small>Powered by <b>Emotion.</b> Driven by <b>AI.</b></small>
        </span>
      </a>

      <div className="auth-nav-links">
        <a href="/" onClick={onBackHome}>Home</a>
        <a href="/dashboard">Dashboard</a>
        <a href="/emotion-engine">Emotion Engine</a>
        <a href="/game-arena">Game Arena</a>
        <a href="/analytics">Analytics</a>
        <a href="/settings">Settings</a>
      </div>

      <a href="/" className="auth-back-button" onClick={onBackHome}>
        <span>←</span> Back to Home
      </a>
    </nav>
  );
}


function GamingIllustration() {
  return (
    <div className="auth-illustration auth-illustration-image">
      <img
        src="/emoticore-gaming.png"
        alt="EmotiCore emotion-adaptive gaming controller with glowing brain"
      />
    </div>
  );
}


function LoginForm({ activeTab, setActiveTab }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  function switchTab(tab) {
    setActiveTab(tab);
    setMessage('');
  }

  
function handleSubmit(event) {
  event.preventDefault();

  if (activeTab === 'login') {
    navigate('/calibration');
  } else {
    setMessage('Sign-up UI ready. Authentication service is not connected yet.');
  }
}


  return (
    <section className="auth-form-card">
      <div className="auth-tabs">
        <button
          type="button"
          className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
          onClick={() => switchTab('login')}
        >
          <span className="auth-tab-icon">♙</span> Login
        </button>

        <button
          type="button"
          className={`auth-tab ${activeTab === 'signup' ? 'active' : ''}`}
          onClick={() => switchTab('signup')}
        >
          <span className="auth-tab-icon">♧</span> Sign Up
        </button>
      </div>

      <div className="auth-form-heading">
        <h2>{activeTab === 'login' ? 'Welcome back! 👋' : 'Join EmotiCore! ✨'}</h2>
        <p>
          {activeTab === 'login'
            ? 'Login to access your EmotiCore dashboard'
            : 'Create an account for your personalized gaming journey'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        {activeTab === 'signup' && (
          <label className="auth-input-wrap">
            <span className="auth-input-icon">♙</span>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              required
            />
          </label>
        )}

        <label className="auth-input-wrap">
          <span className="auth-input-icon">✉</span>
          <input
            type={activeTab === 'login' ? 'text' : 'email'}
            placeholder={activeTab === 'login' ? 'Email or Username' : 'Email Address'}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete={activeTab === 'login' ? 'username' : 'email'}
            required
          />
        </label>

        <label className="auth-input-wrap">
          <span className="auth-input-icon">♙</span>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete={activeTab === 'login' ? 'current-password' : 'new-password'}
            minLength={6}
            required
          />
          <button
            type="button"
            className="auth-password-toggle"
            onClick={() => setShowPassword((previous) => !previous)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? '◉' : '◎'}
          </button>
        </label>

        {activeTab === 'login' && (
          <div className="auth-form-options">
            <label className="auth-remember">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
              />
              <span>Remember Me</span>
            </label>

            <button
              type="button"
              className="auth-text-button"
              onClick={() => setMessage('Password reset will be available after authentication is connected.')}
            >
              Forgot Password?
            </button>
          </div>
        )}

        {message && <p className="auth-form-message" role="status">{message}</p>}

        <button type="submit" className="auth-submit-button">
          {activeTab === 'login' ? 'Login to EmotiCore' : 'Create My Account'}
          <span>→</span>
        </button>
      </form>

      <div className="auth-divider">
        <span />
        <p>or continue with</p>
        <span />
      </div>

      <div className="auth-social-buttons">
        <button type="button" onClick={() => setMessage('Google login needs to be connected.')}>
          <span className="auth-google-icon">G</span> Google
        </button>
        <button type="button" onClick={() => setMessage('Discord login needs to be connected.')}>
          <span className="auth-discord-icon">●</span> Discord
        </button>
        <button type="button" onClick={() => setMessage('Apple login needs to be connected.')}>
          <span className="auth-apple-icon">●</span> Apple
        </button>
      </div>
    </section>
  );
}

function JourneyCard() {
  return (
    <section className="auth-journey-card">
      <h3>Your Journey, Powered by AI</h3>
      <div className="auth-feature-grid">
        {features.map((feature) => (
          <article className="auth-feature" key={feature.title}>
            <div className={`auth-feature-icon ${feature.color}`}>{feature.icon}</div>
            <h4>{feature.title}</h4>
            <p>{feature.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function SecurityCard() {
  return (
    <section className="auth-security-card">
      <div className="auth-security-icon">♙</div>
      <div className="auth-security-content">
        <h3>Secure &amp; Private</h3>
        <p>Your data is encrypted and never shared. 100% private &amp; secure.</p>
        <div className="auth-security-badges">
          <span>◈ End-to-End Encrypted</span>
          <span>♧ You're in Control</span>
        </div>
      </div>
    </section>
  );
}

function TestimonialBanner({ onCreateAccount }) {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const testimonial = testimonials[activeTestimonial];

  return (
    <section className="auth-testimonial-banner">
      <div className="auth-testimonial-avatar">🧑🏻‍💻</div>

      <div className="auth-testimonial-copy">
        <p>"{testimonial.quote}"</p>
        <strong>— {testimonial.author}</strong>
        <div className="auth-testimonial-dots">
          {testimonials.map((item, index) => (
            <button
              key={item.author}
              type="button"
              aria-label={`Show testimonial ${index + 1}`}
              className={activeTestimonial === index ? 'active' : ''}
              onClick={() => setActiveTestimonial(index)}
            />
          ))}
        </div>
      </div>

      <button type="button" className="auth-create-button" onClick={onCreateAccount}>
        ♙ Create New Account
      </button>

      <div className="auth-community">
        <div className="auth-community-avatars">
          <span>👩🏻</span><span>👨🏽</span><span>👩🏾</span><span>🧑🏻</span>
        </div>
        <p>Join 2.5K+ players worldwide</p>
      </div>
    </section>
  );
}

function AuthFooter({ onBackHome }) {
  return (
    <footer className="auth-footer">
      <div className="auth-footer-main">
        <div className="auth-footer-brand">
          <a href="/" onClick={onBackHome} className="auth-footer-logo">
            <span>♡</span><strong>EmotiCore</strong>
          </a>
          <p>Powered by <b>Emotion.</b><br />Driven by <b>AI.</b></p>
          <div className="auth-footer-socials">
            <a href="https://discord.com" aria-label="Discord">●</a>
            <a href="https://twitter.com" aria-label="Twitter">♥</a>
            <a href="https://instagram.com" aria-label="Instagram">◎</a>
            <a href="https://youtube.com" aria-label="YouTube">▶</a>
          </div>
        </div>

        <div className="auth-footer-column">
          <h4>Quick Links</h4>
          <a href="/" onClick={onBackHome}>Home</a>
          <a href="/dashboard">Dashboard</a>
          <a href="/emotion-engine">Emotion Engine</a>
          <a href="/game-arena">Game Arena</a>
        </div>

        <div className="auth-footer-column">
          <h4>Resources</h4>
          <a href="#documentation">Documentation</a>
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Use</a>
          <a href="#support">Support</a>
        </div>

        <div className="auth-footer-column">
          <h4>Support</h4>
          <a href="#help">Help Center</a>
          <a href="#contact">Contact Us</a>
          <a href="#feedback">Feedback</a>
          <a href="#report">Report an Issue</a>
        </div>

        <div className="auth-footer-newsletter">
          <h4>Stay Connected</h4>
          <p>Be the first to know about new updates &amp; features.</p>
          <form onSubmit={(event) => { event.preventDefault(); event.currentTarget.reset(); }}>
            <input type="email" placeholder="Enter your email" aria-label="Email address" required />
            <button type="submit" aria-label="Subscribe">➤</button>
          </form>
        </div>
      </div>

      <div className="auth-footer-bottom">
        <span>© 2026 EmotiCore. All rights reserved.</span>
        <span>Crafted with <b>♥</b> by Team Emotion Raiders</span>
      </div>
    </footer>
  );
}

export default function Auth({ onBackHome }) {
  const [activeTab, setActiveTab] = useState('login');

  function handleBackHome(event) {
    if (onBackHome) {
      event.preventDefault();
      onBackHome();
    }
  }

  function openSignup() {
    setActiveTab('signup');
    document.querySelector('.auth-form-card')?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }

  return (
    <div className="auth-page">
      <AuthNavbar onBackHome={handleBackHome} />

      <main className="auth-main">
        <section className="auth-intro">
          <h1>
            Welcome Back to
            <span>Emoti<span className="auth-gradient-text">Core</span></span>
          </h1>

          <p className="auth-intro-description">
            Sign in to continue your emotion-adaptive gaming journey and unlock
            your personalized experience.
          </p>

          <div className="auth-ai-badge">✦ AI understands you. Games adapt for you.</div>
          <GamingIllustration />
        </section>

        <div className="auth-form-column">
          <LoginForm activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        <JourneyCard />
        <SecurityCard />

        <div className="auth-testimonial-wrap">
          <TestimonialBanner onCreateAccount={openSignup} />
        </div>
      </main>

      <AuthFooter onBackHome={handleBackHome} />
    </div>
  );
}
