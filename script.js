/* ===========================================================
   EMOTICORE - Awwwards-Grade Premium JavaScript Engine
   Manages State, Particle Background, Scroll Reveals,
   Card Cursor Glows, Canvas Runner Game, and Accessibility.
=========================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initGlobalSettings();
    initGlobalUI();
    initParticleCanvas();
    initScrollReveal();
    initCardCursorGlow();
    initNumericCountups();
    
    // Page Router mapping logic based on unique page bodies
    const pageId = document.body.dataset.page;
    switch(pageId) {
        case 'landing':
            initLandingPage();
            break;
        case 'dashboard':
            initDashboardPage();
            break;
        case 'engine':
            initEnginePage();
            break;
        case 'game':
            initGamePage();
            break;
        case 'analytics':
            initAnalyticsPage();
            break;
        case 'settings':
            initSettingsPage();
            break;
    }

    // De-activate page loader overlay
    const loader = document.querySelector('.page-loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('fade-out');
        }, 400);
    }
});

/* ===========================================================
   1. GLOBAL STATE & SETTINGS SYSTEM
   =========================================================== */
const DEFAULT_STATE = {
    stress: 45,
    fatigue: 35,
    confidence: 96,
    engineSpeed: 100,
    highScore: 0,
    theme: 'dark',
    highContrast: 'false',
    textSize: 'normal',
    sound: 'true'
};

function getLocalState() {
    const state = {};
    for (let key in DEFAULT_STATE) {
        let val = localStorage.getItem(`emoticore_${key}`);
        if (val === null) {
            localStorage.setItem(`emoticore_${key}`, DEFAULT_STATE[key]);
            state[key] = DEFAULT_STATE[key];
        } else {
            state[key] = isNaN(val) ? val : Number(val);
        }
    }
    return state;
}

function updateLocalState(key, value) {
    localStorage.setItem(`emoticore_${key}`, value);
    window.dispatchEvent(new Event('storage'));
}

function initGlobalSettings() {
    const state = getLocalState();
    const body = document.body;
    
    if (state.highContrast === 'true' || state.highContrast === true) {
        body.classList.add('high-contrast');
    } else {
        body.classList.remove('high-contrast');
    }

    if (state.textSize === 'large') {
        body.classList.add('text-large');
    } else {
        body.classList.remove('text-large');
    }
}

/* ===========================================================
   2. INTERACTIVE PARTICLES SYSTEM
   =========================================================== */
function initParticleCanvas() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let particles = [];
    let mouse = { x: null, y: null, radius: 120 };

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.5 + 0.5;
            this.vx = (Math.random() - 0.5) * 0.25;
            this.vy = (Math.random() - 0.5) * 0.25;
        }

        draw() {
            ctx.fillStyle = 'rgba(137, 207, 240, 0.15)';
            if (document.body.classList.contains('high-contrast')) {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
            }
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Boundary wrap
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;

            // Mouse interaction
            if (mouse.x != null && mouse.y != null) {
                let dx = this.x - mouse.x;
                let dy = this.y - mouse.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    let force = (mouse.radius - dist) / mouse.radius;
                    // repel gently
                    this.x += (dx / dist) * force * 1.2;
                    this.y += (dy / dist) * force * 1.2;
                }
            }
        }
    }

    function init() {
        particles = [];
        const quantity = Math.min(65, Math.floor((canvas.width * canvas.height) / 18000));
        for (let i = 0; i < quantity; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Draw connections
        ctx.strokeStyle = 'rgba(137, 207, 240, 0.035)';
        if (document.body.classList.contains('high-contrast')) {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        }
        ctx.lineWidth = 0.5;

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 110) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    init();
    animate();
}

/* ===========================================================
   3. AWWWARDS CURSOR HOVER CARD GLOWS
   =========================================================== */
function initCardCursorGlow() {
    const cards = document.querySelectorAll('.glass-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

/* ===========================================================
   4. SCROLL REVEAL (IntersectionObserver)
   =========================================================== */
function initScrollReveal() {
    const options = {
        root: null,
        threshold: 0.1,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, options);

    // Apply observer to all reveal elements
    document.querySelectorAll('.reveal-element').forEach(el => {
        observer.observe(el);
    });
}

/* ===========================================================
   5. NUMERIC COUNT-UP TICKERS
   =========================================================== */
function initNumericCountups() {
    const options = {
        threshold: 0.2,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const targetText = el.textContent;
                
                // Extract number and suffix (e.g. 12ms -> 12 and ms)
                const numMatch = targetText.match(/^([0-9.,]+)(.*)$/);
                if (numMatch) {
                    const finalVal = parseFloat(numMatch[1].replace(/,/g, ''));
                    const suffix = numMatch[2] || '';
                    animateCount(el, 0, finalVal, suffix, 1500);
                }
                observer.unobserve(el);
            }
        });
    }, options);

    document.querySelectorAll('.about-mini-card .val').forEach(el => {
        observer.observe(el);
    });
}

function animateCount(element, start, end, suffix, duration) {
    let startTime = null;

    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const current = progress * (end - start) + start;
        
        // Format with commas if integer is large
        const formattedNum = end > 100 ? Math.floor(current).toLocaleString() : current.toFixed(end % 1 === 0 ? 0 : 1);
        
        element.textContent = formattedNum + suffix;
        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }
    requestAnimationFrame(step);
}

/* ===========================================================
   6. GLOBAL UI ELEMENTS RIPPLE
   =========================================================== */
function initGlobalUI() {
    // Header Scroll Effect
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('open');
            navLinks.classList.toggle('open');
        });
    }

    // Button ripples
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            this.appendChild(ripple);

            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = `${size}px`;

            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Custom system notification HUD alerts
    window.showSystemNotification = function(title, text, type = 'info') {
        let container = document.getElementById('notif-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notif-container';
            container.style.cssText = 'position: fixed; bottom: 25px; right: 25px; display: flex; flex-direction: column; gap: 12px; z-index: 9999; max-width: 320px;';
            document.body.appendChild(container);
        }

        const el = document.createElement('div');
        el.className = 'glass';
        el.style.cssText = 'padding: 16px 20px; border-radius: 16px; border-left: 3px solid var(--white); transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); transform: translateY(50px); opacity: 0; box-shadow: var(--glass-glow);';
        
        if (type === 'danger') el.style.borderLeftColor = 'var(--primary)';
        if (type === 'warning') el.style.borderLeftColor = 'var(--warning)';
        
        el.innerHTML = `<h5 style="margin:0;font-family:var(--font-heading);font-weight:700;color:var(--white);font-size:0.9rem;letter-spacing:0.5px;">${title}</h5><p style="margin:0;font-size:0.8rem;color:var(--muted);">${text}</p>`;
        
        container.appendChild(el);
        
        setTimeout(() => {
            el.style.transform = 'translateY(0)';
            el.style.opacity = '1';
        }, 50);

        setTimeout(() => {
            el.style.transform = 'translateY(-20px)';
            el.style.opacity = '0';
            setTimeout(() => el.remove(), 400);
        }, 4000);
    };

    // Parallax mouse interaction on Aurora layers
    document.addEventListener('mousemove', (e) => {
        const orbs = document.querySelectorAll('.aurora-orb');
        if (orbs.length === 0) return;
        const x = (e.clientX - window.innerWidth / 2) * 0.02;
        const y = (e.clientY - window.innerHeight / 2) * 0.02;
        
        orbs.forEach((orb, i) => {
            const factor = (i + 1) * 0.4;
            orb.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
        });
    });
}

/* ===========================================================
   7. LANDING PAGE (index.html)
   =========================================================== */
function initLandingPage() {
    const statusVal = document.querySelector('.hero-mockup-wrapper .online');
    const emotionVal = document.querySelector('.hero-mockup-wrapper .hud-emotion');
    const scoreVal = document.querySelector('.hero-mockup-wrapper .hud-score');

    if (emotionVal && scoreVal) {
        setInterval(() => {
            const states = ['😊 Balanced Flow', '⚡ Low Focus', '🔥 High Stress'];
            const randomState = states[Math.floor(Math.random() * states.length)];
            emotionVal.textContent = randomState;
            
            const curVal = parseInt(scoreVal.textContent);
            scoreVal.textContent = curVal + Math.floor(Math.random() * 8) + 1;
        }, 3000);
    }
}

/* ===========================================================
   8. AI DASHBOARD (dashboard.html)
   =========================================================== */
function initDashboardPage() {
    const stressValText = document.getElementById('dash-stress-val');
    const stressFill = document.getElementById('dash-stress-fill');
    const fatigueValText = document.getElementById('dash-fatigue-val');
    const fatigueFill = document.getElementById('dash-fatigue-fill');
    const confidenceValText = document.getElementById('dash-confidence-val');
    const confidenceFill = document.getElementById('dash-confidence-fill');

    // Engine Speed Radial SVG
    const engineSpeedText = document.getElementById('dash-engine-speed');
    const engineRadialFill = document.getElementById('dash-engine-radial');

    function drawDashboardMetrics() {
        const curState = getLocalState();

        // Stress Adjustments
        if (stressValText && stressFill) {
            stressValText.textContent = `${curState.stress}%`;
            stressFill.style.width = `${curState.stress}%`;
            const label = document.getElementById('dash-stress-status');
            if (label) {
                if (curState.stress > 70) {
                    label.textContent = 'High Stress - Adapting';
                    label.className = 'metric-footer stress-high';
                } else if (curState.stress < 30) {
                    label.textContent = 'Under-aroused';
                    label.className = 'metric-footer';
                } else {
                    label.textContent = 'Optimal Flow State';
                    label.className = 'metric-footer focus-optimal';
                }
            }
        }

        // Fatigue Adjustments
        if (fatigueValText && fatigueFill) {
            fatigueValText.textContent = `${curState.fatigue}%`;
            fatigueFill.style.width = `${curState.fatigue}%`;
            const label = document.getElementById('dash-fatigue-status');
            if (label) {
                if (curState.fatigue > 70) {
                    label.textContent = 'High Fatigue - Challenge Up';
                    label.className = 'metric-footer fatigue-warning';
                } else {
                    label.textContent = 'Excellent Focus';
                    label.className = 'metric-footer focus-optimal';
                }
            }
        }

        // Confidence Indicator
        if (confidenceValText && confidenceFill) {
            const conf = Math.max(88, Math.min(99, 100 - Math.floor(curState.stress * 0.1)));
            confidenceValText.textContent = `${conf}%`;
            confidenceFill.style.width = `${conf}%`;
        }

        // Engine Speed Radial
        if (engineSpeedText && engineRadialFill) {
            let speed = 100;
            if (curState.stress > 70) speed = 65;
            else if (curState.fatigue > 70) speed = 130;

            engineSpeedText.textContent = `${speed}`;
            const percent = Math.min(100, (speed / 150) * 100);
            const offset = 440 * (1 - percent / 100);
            engineRadialFill.style.strokeDashoffset = offset;
        }

        updateDashboardRecommendations(curState);
    }

    function updateDashboardRecommendations(curState) {
        const list = document.querySelector('.recs-list');
        if (!list) return;

        let itemsHTML = '';

        if (curState.stress > 70) {
            itemsHTML += `
                <div class="rec-item card-stress-alert" style="border-left: 2px solid var(--primary);">
                    <span class="rec-icon">🧘‍♂️</span>
                    <div class="rec-info">
                        <h4>Calm Adaptation Active</h4>
                        <p>Game speeds are dampening by 30% to ease cognitive fatigue and stabilize play thresholds.</p>
                    </div>
                </div>
            `;
        }

        if (curState.fatigue > 70) {
            itemsHTML += `
                <div class="rec-item" style="border-left: 2px solid var(--warning);">
                    <span class="rec-icon">⚡</span>
                    <div class="rec-info">
                        <h4>Attention Spark Engaged</h4>
                        <p>Obstacle speed scaled up by 35% to stimulate neurological focus and offset attention dips.</p>
                    </div>
                </div>
            `;
        }

        if (curState.stress <= 70 && curState.fatigue <= 70) {
            itemsHTML += `
                <div class="rec-item" style="border-left: 2px solid var(--white);">
                    <span class="rec-icon">✨</span>
                    <div class="rec-info">
                        <h4>Optimal Flow Maintained</h4>
                        <p>Heuristics parameters synchronized at 100Hz. Performance levels remain ideal.</p>
                    </div>
                </div>
            `;
        }

        itemsHTML += `
            <div class="rec-item">
                <span class="rec-icon">♿</span>
                <div class="rec-info">
                    <h4>Contrast recommendation available</h4>
                    <p>Toggle high contrast layout grids in settings panel to improve visual outline readability.</p>
                </div>
            </div>
        `;

        list.innerHTML = itemsHTML;
    }

    drawDashboardMetrics();
    window.addEventListener('storage', drawDashboardMetrics);
}

/* ===========================================================
   9. EMOTION ENGINE SCANNER (emotion-engine.html)
   =========================================================== */
function initEnginePage() {
    let webcamActive = false;
    let videoStream = null;
    let scanLoopId = null;

    const stressSlider = document.getElementById('stress-control');
    const stressTextVal = document.getElementById('stress-val-hud');
    const fatigueSlider = document.getElementById('fatigue-control');
    const fatigueTextVal = document.getElementById('fatigue-val-hud');

    const toggleWebcamBtn = document.getElementById('toggle-webcam-btn');
    const videoEl = document.getElementById('webcam-feed-video');
    const canvasEl = document.getElementById('webcam-emulator-canvas');
    const hudRect = document.getElementById('hud-tracking-box');
    const engineStatusBadge = document.getElementById('engine-adapt-badge');
    const engineStatusDesc = document.getElementById('engine-adapt-desc');

    const consoleEl = document.getElementById('live-engine-console');

    function logToTerminal(message, type = 'system') {
        if (!consoleEl) return;
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        
        const line = document.createElement('div');
        line.className = `log-line ${type}`;
        line.innerHTML = `<span class="timestamp">[${timeStr}]</span> ${message}`;
        
        consoleEl.appendChild(line);
        consoleEl.scrollTop = consoleEl.scrollHeight;

        if (consoleEl.children.length > 50) {
            consoleEl.children[0].remove();
        }
    }

    // Set Sliders
    if (stressSlider && stressTextVal) {
        const state = getLocalState();
        stressSlider.value = state.stress;
        stressTextVal.textContent = `${state.stress}%`;
        
        stressSlider.addEventListener('input', (e) => {
            const val = e.target.value;
            stressTextVal.textContent = `${val}%`;
            
            if (val > 70) {
                stressTextVal.className = 'slider-val-box high-stress';
                hudRect.classList.add('stress-lock');
            } else {
                stressTextVal.className = 'slider-val-box';
                hudRect.classList.remove('stress-lock');
            }
            
            updateLocalState('stress', val);
            updateStatusHUD();
        });
    }

    if (fatigueSlider && fatigueTextVal) {
        const state = getLocalState();
        fatigueSlider.value = state.fatigue;
        fatigueTextVal.textContent = `${state.fatigue}%`;
        
        fatigueSlider.addEventListener('input', (e) => {
            const val = e.target.value;
            fatigueTextVal.textContent = `${val}%`;
            updateLocalState('fatigue', val);
            updateStatusHUD();
        });
    }

    function updateStatusHUD() {
        const curState = getLocalState();
        if (!engineStatusBadge || !engineStatusDesc) return;

        if (curState.stress > 70) {
            engineStatusBadge.textContent = 'HIGH STRESS';
            engineStatusBadge.className = 'adapt-badge stress';
            engineStatusDesc.textContent = 'Dampening game velocities to protect player focus.';
            document.querySelector('.adapt-status-panel').className = 'adapt-status-panel stress-active';
        } else if (curState.fatigue > 70) {
            engineStatusBadge.textContent = 'LOW FOCUS';
            engineStatusBadge.className = 'adapt-badge fatigue';
            engineStatusDesc.textContent = 'Accelerating obstacles and challenges to force brain activity.';
            document.querySelector('.adapt-status-panel').className = 'adapt-status-panel';
        } else {
            engineStatusBadge.textContent = 'FLOW STATE';
            engineStatusBadge.className = 'adapt-badge balanced';
            engineStatusDesc.textContent = 'Game parameters operating at premium tailored defaults.';
            document.querySelector('.adapt-status-panel').className = 'adapt-status-panel';
        }
    }

    // High Tech wireframe face emulator
    function runCanvasEmulatorLoop() {
        if (!canvasEl) return;
        const ctx = canvasEl.getContext('2d');
        let width = canvasEl.width = canvasEl.offsetWidth;
        let height = canvasEl.height = canvasEl.offsetHeight;

        const faceCenterX = width / 2;
        const faceCenterY = height / 2;

        function animate() {
            if (webcamActive) return;

            width = canvasEl.width = canvasEl.offsetWidth;
            height = canvasEl.height = canvasEl.offsetHeight;

            ctx.clearRect(0, 0, width, height);

            const curState = getLocalState();
            
            // Draw technical coordinates grid lines
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
            ctx.lineWidth = 1;
            const gridSize = 45;
            for (let x = 0; x < width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }
            for (let y = 0; y < height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }

            // Draw a high-tech synthetic wireframe face scan
            ctx.strokeStyle = curState.stress > 70 ? 'rgba(220, 20, 60, 0.35)' : 'rgba(255, 255, 255, 0.2)';
            ctx.lineWidth = 1.2;
            
            // Face outline
            ctx.beginPath();
            ctx.ellipse(faceCenterX, faceCenterY - 10, 80, 110, 0, 0, Math.PI * 2);
            ctx.stroke();

            // Jaw and Crosshairs
            ctx.beginPath();
            ctx.moveTo(faceCenterX - 100, faceCenterY - 10);
            ctx.lineTo(faceCenterX + 100, faceCenterY - 10);
            ctx.moveTo(faceCenterX, faceCenterY - 130);
            ctx.lineTo(faceCenterX, faceCenterY + 120);
            ctx.stroke();

            // Eyes landmarks
            const eyeOffset = 30;
            const eyeHeight = faceCenterY - 30;
            
            ctx.beginPath();
            ctx.arc(faceCenterX - eyeOffset, eyeHeight, 8, 0, Math.PI * 2);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.arc(faceCenterX + eyeOffset, eyeHeight, 8, 0, Math.PI * 2);
            ctx.stroke();

            // Eyebrows matching Stress
            const stressAngle = (curState.stress / 100) * 0.35;
            ctx.strokeStyle = curState.stress > 70 ? 'var(--primary)' : 'var(--white)';
            ctx.lineWidth = 2.5;
            
            // Left Eyebrow
            ctx.beginPath();
            ctx.moveTo(faceCenterX - eyeOffset - 18, eyeHeight - 15 + (stressAngle * 12));
            ctx.lineTo(faceCenterX - eyeOffset + 18, eyeHeight - 18 - (stressAngle * 6));
            ctx.stroke();
            
            // Right Eyebrow
            ctx.beginPath();
            ctx.moveTo(faceCenterX + eyeOffset + 18, eyeHeight - 15 + (stressAngle * 12));
            ctx.lineTo(faceCenterX + eyeOffset - 18, eyeHeight - 18 - (stressAngle * 6));
            ctx.stroke();

            // Mouth outline
            ctx.strokeStyle = 'var(--white)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            const mouthY = faceCenterY + 45;
            const smileFactor = curState.stress > 70 ? 10 : -8;
            ctx.moveTo(faceCenterX - 25, mouthY);
            ctx.quadraticCurveTo(faceCenterX, mouthY + smileFactor, faceCenterX + 25, mouthY);
            ctx.stroke();

            // Pulse point coordinates
            ctx.fillStyle = 'var(--white)';
            const time = Date.now() * 0.003;
            const pulseSize = 2.5 + Math.sin(time) * 1.2;
            ctx.beginPath();
            ctx.arc(faceCenterX - eyeOffset, eyeHeight, pulseSize, 0, Math.PI * 2);
            ctx.arc(faceCenterX + eyeOffset, eyeHeight, pulseSize, 0, Math.PI * 2);
            ctx.fill();

            scanLoopId = requestAnimationFrame(animate);
        }

        animate();
    }

    if (toggleWebcamBtn) {
        toggleWebcamBtn.addEventListener('click', async () => {
            if (!webcamActive) {
                try {
                    videoStream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 400 } });
                    if (videoEl) {
                        videoEl.srcObject = videoStream;
                        videoEl.style.display = 'block';
                        videoEl.play();
                    }
                    webcamActive = true;
                    toggleWebcamBtn.textContent = 'Disable Webcam Feed';
                    toggleWebcamBtn.className = 'btn btn-primary';
                    logToTerminal('Webcam feed linked successfully.', 'system');
                    logToTerminal('Analyzing facial parameters dynamically...', 'info');
                    if (scanLoopId) cancelAnimationFrame(scanLoopId);
                    
                    if (canvasEl) {
                        const ctx = canvasEl.getContext('2d');
                        let w = canvasEl.width = canvasEl.offsetWidth;
                        let h = canvasEl.height = canvasEl.offsetHeight;
                        
                        function webCamOverlayTick() {
                            if (!webcamActive) return;
                            w = canvasEl.width = canvasEl.offsetWidth;
                            h = canvasEl.height = canvasEl.offsetHeight;
                            ctx.clearRect(0, 0, w, h);

                            ctx.strokeStyle = 'var(--white)';
                            ctx.lineWidth = 1.5;
                            ctx.strokeRect(w/2 - 75, h/2 - 75, 150, 150);

                            ctx.strokeStyle = 'var(--muted)';
                            ctx.beginPath();
                            ctx.moveTo(w/2 - 10, h/2); ctx.lineTo(w/2 + 10, h/2);
                            ctx.moveTo(w/2, h/2 - 10); ctx.lineTo(w/2, h/2 + 10);
                            ctx.stroke();

                            requestAnimationFrame(webCamOverlayTick);
                        }
                        webCamOverlayTick();
                    }

                } catch (e) {
                    logToTerminal('Webcam access blocked. Emulating scans.', 'warning');
                    window.showSystemNotification('Sensor Alert', 'Cam access blocked. Emulation enabled.', 'warning');
                }
            } else {
                if (videoStream) {
                    videoStream.getTracks().forEach(track => track.stop());
                }
                if (videoEl) {
                    videoEl.srcObject = null;
                    videoEl.style.display = 'none';
                }
                webcamActive = false;
                toggleWebcamBtn.textContent = 'Enable Webcam Feed';
                toggleWebcamBtn.className = 'btn btn-secondary';
                logToTerminal('Webcam stream terminated.', 'system');
                logToTerminal('Re-loading synthetic scanner overlays.', 'system');
                runCanvasEmulatorLoop();
            }
        });
    }

    let termTicker = setInterval(() => {
        const logs = [
            'Analyzing micro-expression metrics...',
            'Pupillary dilation tracking stable.',
            'Blink latency calculated at 240ms.',
            'Facial blood flow signature: OPTIMAL.',
            'Ocular micro-tremors: minimal drift.',
            'Checking stress thresholds... clear.',
            'Cognitive engagement matrix: 94.2%',
            'Synchronizing logs to cloud index...'
        ];
        const rand = logs[Math.floor(Math.random() * logs.length)];
        const curState = getLocalState();
        
        if (curState.stress > 70) {
            logToTerminal('STRESS THRESHOLD EXCEEDED (>70%). Compressing obstacle speed limits.', 'warning');
        } else if (curState.fatigue > 70) {
            logToTerminal('ATTENTION FATIGUE IDENTIFIED. Boosting obstacle activity scales.', 'info');
        } else {
            logToTerminal(rand, 'system');
        }
    }, 6000);

    updateStatusHUD();
    runCanvasEmulatorLoop();
}

/* ===========================================================
   10. INTERACTIVE CANVAS ENDLESS RUNNER (game.html)
   =========================================================== */
function initGamePage() {
    const canvas = document.getElementById('game-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const adaptGlow = document.getElementById('game-glow-overlay');
    const adaptBanner = document.getElementById('game-adapt-banner');
    const menuOverlay = document.getElementById('game-menu-overlay');
    const menuTitle = document.getElementById('game-menu-title');
    const menuBtn = document.getElementById('game-menu-btn');
    
    const scoreValHUD = document.getElementById('game-score-val');
    const highScoreHUD = document.getElementById('game-highscore-val');
    const livesHUD = document.getElementById('game-lives-val');
    
    const sidebarEmotion = document.getElementById('game-hud-emotion');
    const sidebarSpeed = document.getElementById('game-hud-speed');
    const sidebarMultiplier = document.getElementById('game-hud-multiplier');

    let gameActive = false;
    let gameOver = false;
    let score = 0;
    let lives = 3;
    let animationFrameId = null;

    let baseSpeed = 5.0;
    let currentSpeed = baseSpeed;
    let gravity = 0.65;
    
    const state = getLocalState();
    let highScore = state.highScore;
    if (highScoreHUD) highScoreHUD.textContent = highScore;

    // Player Object
    const player = {
        x: 80,
        y: 220,
        width: 32,
        height: 32,
        vy: 0,
        jumpStrength: -12.5,
        isGrounded: false,
        color: '#ffffff',
        glow: 'rgba(255, 255, 255, 0.4)',
        trail: [],
        
        draw() {
            if (this.trail.length > 0) {
                for (let i = 0; i < this.trail.length; i++) {
                    const opacity = (i + 1) / this.trail.length * 0.2;
                    ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
                    ctx.fillRect(this.trail[i].x, this.trail[i].y, this.width, this.height);
                }
            }

            ctx.fillStyle = this.color;
            ctx.shadowBlur = 15;
            ctx.shadowColor = this.glow;
            
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.shadowBlur = 0;
        },
        
        update() {
            this.vy += gravity;
            this.y += this.vy;
            
            const floorY = canvas.height - 70;
            if (this.y + this.height >= floorY) {
                this.y = floorY - this.height;
                this.vy = 0;
                this.isGrounded = true;
            } else {
                this.isGrounded = false;
            }

            this.trail.push({ x: this.x, y: this.y });
            if (this.trail.length > 6) {
                this.trail.shift();
            }
        },

        jump() {
            if (this.isGrounded) {
                const curState = getLocalState();
                let adjust = 0;
                if (curState.stress > 70) {
                    adjust = 2.0; // heavy control
                }
                this.vy = this.jumpStrength + adjust;
                this.isGrounded = false;
            }
        }
    };

    let obstacles = [];
    let spawnTimer = 0;
    let spawnInterval = 110;

    class Obstacle {
        constructor(speed) {
            this.width = 24 + Math.random() * 20;
            this.height = 30 + Math.random() * 35;
            this.x = canvas.width + 50;
            this.y = canvas.height - 70 - this.height;
            this.speed = speed;
            this.color = '#ffffff';
            this.glow = 'rgba(255, 255, 255, 0.2)';
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.glow;
            
            ctx.beginPath();
            ctx.moveTo(this.x, this.y + this.height);
            ctx.lineTo(this.x + this.width / 2, this.y);
            ctx.lineTo(this.x + this.width, this.y + this.height);
            ctx.closePath();
            ctx.fill();
            
            ctx.shadowBlur = 0;
        }

        update() {
            this.x -= this.speed;
        }
    }

    let stars = [];
    function initStars() {
        stars = [];
        for (let i = 0; i < 40; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * (canvas.height - 120),
                size: Math.random() * 1.5,
                speed: (0.2 + Math.random() * 0.8)
            });
        }
    }

    function drawStars() {
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        stars.forEach(star => {
            ctx.fillRect(star.x, star.y, star.size, star.size);
            star.x -= star.speed * (currentSpeed / baseSpeed);
            if (star.x < 0) {
                star.x = canvas.width;
            }
        });
    }

    function handleObstacles() {
        const curState = getLocalState();
        let interval = spawnInterval;
        if (curState.fatigue > 70) {
            interval = 70;
        }

        spawnTimer++;
        if (spawnTimer >= interval) {
            obstacles.push(new Obstacle(currentSpeed));
            spawnTimer = 0;
        }

        for (let i = obstacles.length - 1; i >= 0; i--) {
            obstacles[i].update();
            obstacles[i].draw();

            if (
                player.x < obstacles[i].x + obstacles[i].width &&
                player.x + player.width > obstacles[i].x &&
                player.y < obstacles[i].y + obstacles[i].height &&
                player.y + player.height > obstacles[i].y
            ) {
                obstacles.splice(i, 1);
                handlePlayerHit();
                continue;
            }

            if (obstacles[i].x + obstacles[i].width < 0) {
                obstacles.splice(i, 1);
                score += 10;
                if (scoreValHUD) scoreValHUD.textContent = score;
            }
        }
    }

    function handlePlayerHit() {
        lives--;
        if (livesHUD) livesHUD.textContent = lives;
        
        window.showSystemNotification('Player Hit', `Life lost! Remainder: ${lives}`, 'danger');
        
        canvas.style.transform = 'translateX(-10px)';
        setTimeout(() => canvas.style.transform = 'translateX(10px)', 50);
        setTimeout(() => canvas.style.transform = 'translateX(0)', 100);

        if (lives <= 0) {
            endGame();
        }
    }

    function syncGameDifficulty() {
        const curState = getLocalState();
        
        if (curState.stress > 70) {
            currentSpeed = baseSpeed * 0.75;
            player.color = 'var(--primary)';
            player.glow = 'rgba(220, 20, 60, 0.8)';
            
            adaptGlow.className = 'game-adapt-glow stress-glow';
            adaptBanner.textContent = 'HIGH STRESS | ADAPTING SPEED';
            adaptBanner.className = 'game-screen-banner stress-banner show';
            
            if (sidebarEmotion) sidebarEmotion.textContent = '🔥 Overstressed';
            if (sidebarSpeed) sidebarSpeed.textContent = '0.75x (Dampened)';
            if (sidebarMultiplier) sidebarMultiplier.textContent = '1.0x';
        } else if (curState.fatigue > 70) {
            currentSpeed = baseSpeed * 1.35;
            player.color = 'var(--warning)';
            player.glow = 'rgba(250, 204, 21, 0.8)';
            
            adaptGlow.className = 'game-adapt-glow fatigue-glow';
            adaptBanner.textContent = 'LOW FOCUS | INCREASING CHALLENGE';
            adaptBanner.className = 'game-screen-banner fatigue-banner show';

            if (sidebarEmotion) sidebarEmotion.textContent = '⚡ Fatigue Warning';
            if (sidebarSpeed) sidebarSpeed.textContent = '1.35x (Accelerated)';
            if (sidebarMultiplier) sidebarMultiplier.textContent = '1.5x Boost';
        } else {
            currentSpeed = baseSpeed;
            player.color = 'var(--white)';
            player.glow = 'rgba(255, 255, 255, 0.3)';
            
            adaptGlow.className = 'game-adapt-glow flow-glow';
            adaptBanner.textContent = 'FLOW STATE | OPTIMIZED MODE';
            adaptBanner.className = 'game-screen-banner flow-banner show';

            if (sidebarEmotion) sidebarEmotion.textContent = '😊 Balanced Flow';
            if (sidebarSpeed) sidebarSpeed.textContent = '1.00x (Standard)';
            if (sidebarMultiplier) sidebarMultiplier.textContent = '1.2x';
        }
    }

    function drawFloor() {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.fillRect(0, canvas.height - 70, canvas.width, 1);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.01)';
        ctx.fillRect(0, canvas.height - 69, canvas.width, 69);

        // stripes scrolling
        ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
        const stripeWidth = 60;
        const spacing = 120;
        const offset = (Date.now() * 0.04 * currentSpeed) % spacing;
        for (let x = -offset; x < canvas.width; x += spacing) {
            ctx.fillRect(x, canvas.height - 69, stripeWidth, 6);
        }
    }

    function gameLoop() {
        if (!gameActive) return;

        if (canvas.width !== canvas.offsetWidth) {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            initStars();
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        syncGameDifficulty();
        drawStars();
        drawFloor();

        player.update();
        player.draw();

        handleObstacles();

        animationFrameId = requestAnimationFrame(gameLoop);
    }

    function startGame() {
        score = 0;
        lives = 3;
        gameOver = false;
        gameActive = true;
        obstacles = [];
        spawnTimer = 0;
        
        if (scoreValHUD) scoreValHUD.textContent = '0';
        if (livesHUD) livesHUD.textContent = '3';

        menuOverlay.classList.add('hidden');
        initStars();
        gameLoop();
        window.showSystemNotification('Arena Status', 'Endless runner arena initialized.', 'info');
    }

    function endGame() {
        gameActive = false;
        gameOver = true;
        if (animationFrameId) cancelAnimationFrame(animationFrameId);

        if (score > highScore) {
            highScore = score;
            updateLocalState('highScore', highScore);
            if (highScoreHUD) highScoreHUD.textContent = highScore;
            window.showSystemNotification('High Score Set!', `New record: ${score}!`, 'info');
        }

        menuTitle.textContent = 'GAME OVER';
        menuBtn.textContent = 'Play Again';
        menuOverlay.classList.remove('hidden');
    }

    window.addEventListener('keydown', (e) => {
        if (e.code === 'Space' || e.code === 'ArrowUp') {
            e.preventDefault();
            player.jump();
        }
    });

    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        player.jump();
    });
    
    canvas.addEventListener('mousedown', () => {
        player.jump();
    });

    if (menuBtn) {
        menuBtn.addEventListener('click', startGame);
    }
}

/* ===========================================================
   11. ANALYTICS & WEEKLY CHARTS DRAWERS (analytics.html)
   =========================================================== */
function initAnalyticsPage() {
    const stressContainer = document.getElementById('stress-chart-wrapper');
    const fatigueContainer = document.getElementById('fatigue-chart-wrapper');

    function drawCustomSVGCharts() {
        const state = getLocalState();

        const stressData = [45, 52, 60, state.stress, Math.max(30, state.stress - 15), 45, 50];
        const fatigueData = [30, 42, 55, state.fatigue, Math.max(20, state.fatigue - 10), 35, 40];
        const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

        if (stressContainer) {
            stressContainer.innerHTML = buildLineChartSVG(stressData, labels, 'stress');
        }

        if (fatigueContainer) {
            fatigueContainer.innerHTML = buildLineChartSVG(fatigueData, labels, 'fatigue');
        }
    }

    function buildLineChartSVG(data, labels, type) {
        const width = 500;
        const height = 220;
        const padding = 35;
        
        const chartW = width - (padding * 2);
        const chartH = height - (padding * 2);

        const maxVal = 100;

        const coords = data.map((val, idx) => {
            const x = padding + (idx / (data.length - 1)) * chartW;
            const y = padding + chartH - (val / maxVal) * chartH;
            return { x, y };
        });

        let pathString = '';
        coords.forEach((c, idx) => {
            if (idx === 0) {
                pathString += `M ${c.x} ${c.y}`;
            } else {
                pathString += ` L ${c.x} ${c.y}`;
            }
        });

        const first = coords[0];
        const last = coords[coords.length - 1];
        let areaPathString = `${pathString} L ${last.x} ${padding + chartH} L ${first.x} ${padding + chartH} Z`;

        const strokeColor = type === 'stress' ? 'var(--primary)' : 'var(--warning)';
        const gradId = `${type}-grad`;

        let grids = '';
        for (let i = 0; i <= 4; i++) {
            const yVal = padding + (i / 4) * chartH;
            const textVal = Math.round(maxVal - (i / 4) * maxVal);
            grids += `
                <line x1="${padding}" y1="${yVal}" x2="${width - padding}" y2="${yVal}" class="svg-chart-grid" />
                <text x="${padding - 8}" y="${yVal + 4}" text-anchor="end" class="svg-chart-axis-text">${textVal}</text>
            `;
        }

        let axisLabels = '';
        coords.forEach((c, idx) => {
            axisLabels += `
                <text x="${c.x}" y="${height - 10}" text-anchor="middle" class="svg-chart-axis-text">${labels[idx]}</text>
                <circle cx="${c.x}" cy="${c.y}" r="3" fill="${strokeColor}" />
            `;
        });

        return `
            <svg viewBox="0 0 ${width} ${height}" class="svg-chart">
                <defs>
                    <linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="${strokeColor}" stop-opacity="0.2"/>
                        <stop offset="100%" stop-color="${strokeColor}" stop-opacity="0.0"/>
                    </linearGradient>
                </defs>
                ${grids}
                <path d="${areaPathString}" fill="url(#${gradId})" />
                <path d="${pathString}" fill="none" stroke="${strokeColor}" stroke-width="2" stroke-linecap="round" />
                ${axisLabels}
            </svg>
        `;
    }

    drawCustomSVGCharts();
    window.addEventListener('storage', drawCustomSVGCharts);
}

/* ===========================================================
   12. SETTINGS & ACCESSIBILITY CONTROLS (settings.html)
   =========================================================== */
function initSettingsPage() {
    const state = getLocalState();

    const contrastSwitch = document.getElementById('contrast-mode-switch');
    const notificationSwitch = document.getElementById('notif-mode-switch');
    
    const textNormalBtn = document.getElementById('text-scale-normal');
    const textLargeBtn = document.getElementById('text-scale-large');

    const resetDataBtn = document.getElementById('reset-data-btn');

    if (contrastSwitch) {
        contrastSwitch.checked = (state.highContrast === 'true' || state.highContrast === true);
        contrastSwitch.addEventListener('change', (e) => {
            const checked = e.target.checked;
            updateLocalState('highContrast', checked);
            
            if (checked) {
                document.body.classList.add('high-contrast');
                window.showSystemNotification('System calibrator', 'High contrast overrides loaded.', 'info');
            } else {
                document.body.classList.remove('high-contrast');
                window.showSystemNotification('System calibrator', 'Standard theme profiles restored.', 'info');
            }
        });
    }

    if (notificationSwitch) {
        notificationSwitch.checked = (state.sound === 'true' || state.sound === true);
        notificationSwitch.addEventListener('change', (e) => {
            updateLocalState('sound', e.target.checked);
            window.showSystemNotification('Calibration Alert', `Warnings display audio updates toggled: ${e.target.checked ? 'ON' : 'OFF'}`, 'info');
        });
    }

    if (textNormalBtn && textLargeBtn) {
        if (state.textSize === 'large') {
            textLargeBtn.classList.add('active');
            textNormalBtn.classList.remove('active');
        } else {
            textNormalBtn.classList.add('active');
            textLargeBtn.classList.remove('active');
        }

        textNormalBtn.addEventListener('click', () => {
            textNormalBtn.classList.add('active');
            textLargeBtn.classList.remove('active');
            updateLocalState('textSize', 'normal');
            document.body.classList.remove('text-large');
        });

        textLargeBtn.addEventListener('click', () => {
            textLargeBtn.classList.add('active');
            textNormalBtn.classList.remove('active');
            updateLocalState('textSize', 'large');
            document.body.classList.add('text-large');
        });
    }

    if (resetDataBtn) {
        resetDataBtn.addEventListener('click', () => {
            if (confirm('Restore default heuristics parameters? This wipes score registries.')) {
                localStorage.clear();
                window.location.reload();
            }
        });
    }
}
