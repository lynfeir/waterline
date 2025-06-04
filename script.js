// PERFORMANCE OPTIMIZATIONS
let rafId;
let isAnimating = false;
let scrollTimeout;
const isMobile = window.innerWidth <= 768;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// THROTTLE UTILITY
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// DEBOUNCE UTILITY
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// UNIFIED ANIMATION LOOP
class AnimationManager {
    constructor() {
        this.animations = new Map();
        this.isRunning = false;
        this.frameCount = 0;
    }
    
    add(name, callback) {
        this.animations.set(name, callback);
        if (!this.isRunning) {
            this.start();
        }
    }
    
    remove(name) {
        this.animations.delete(name);
        if (this.animations.size === 0) {
            this.stop();
        }
    }
    
    start() {
        this.isRunning = true;
        this.animate();
    }
    
    stop() {
        this.isRunning = false;
        if (rafId) {
            cancelAnimationFrame(rafId);
        }
    }
    
    animate() {
        if (!this.isRunning) return;
        
        this.frameCount++;
        
        // Run animations at different intervals to reduce load
        this.animations.forEach((callback, name) => {
            if (name === 'cursor' || this.frameCount % 2 === 0) {
                callback(this.frameCount);
            }
        });
        
        rafId = requestAnimationFrame(() => this.animate());
    }
}

const animationManager = new AnimationManager();

// OPTIMIZED CUSTOM CURSOR SYSTEM
const cursor = document.querySelector('.artistic-cursor');
const cursorTrail = document.querySelector('.cursor-trail');
let mouseX = 0, mouseY = 0;
let trailX = 0, trailY = 0;
let cursorVisible = false;

// Only enable cursor on desktop
if (!isMobile && cursor && cursorTrail) {
    const updateMousePosition = throttle((e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!cursorVisible) {
            cursor.style.opacity = '1';
            cursorTrail.style.opacity = '0.6';
            cursorVisible = true;
        }
    }, 16); // ~60fps
    
    document.addEventListener('mousemove', updateMousePosition, { passive: true });
    
    // Hide cursor on mobile/touch
    document.addEventListener('touchstart', () => {
        cursor.style.opacity = '0';
        cursorTrail.style.opacity = '0';
        cursorVisible = false;
    }, { passive: true });
    
    // Optimized cursor animation
    animationManager.add('cursor', () => {
        if (!cursorVisible) return;
        
        // Use transform instead of left/top for better performance
        cursor.style.transform = `translate3d(${mouseX - 20}px, ${mouseY - 20}px, 0)`;
        
        trailX += (mouseX - trailX) * 0.1;
        trailY += (mouseY - trailY) * 0.1;
        cursorTrail.style.transform = `translate3d(${trailX - 4}px, ${trailY - 4}px, 0)`;
    });
    
    // OPTIMIZED HOVER EFFECTS
    const interactiveElements = document.querySelectorAll('a, button, .filmmaker-portrait, .input-field');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform += ' scale(1.5)';
            cursor.style.background = 'radial-gradient(circle, var(--electric-cyan) 0%, transparent 70%)';
        }, { passive: true });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = cursor.style.transform.replace(' scale(1.5)', '');
            cursor.style.background = 'radial-gradient(circle, var(--liquid-yellow) 0%, transparent 70%)';
        }, { passive: true });
    });
}

// OPTIMIZED FLOATING SYMBOLS SYSTEM
const symbols = ['◊', '◈', '◇', '◉', '◎', '◐', '◑', '◒', '◓', '⬟', '⬢', '⬡', '⟐', '⟑', '⟒', '⟓'];
const symbolsContainer = document.getElementById('symbolsContainer');
let symbolCount = 0;
const maxSymbols = isMobile ? 5 : 10;

function createFloatingSymbol() {
    if (symbolCount >= maxSymbols || prefersReducedMotion) return;
    
    const symbol = document.createElement('div');
    symbol.className = 'symbol';
    symbol.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    symbol.style.left = Math.random() * 100 + '%';
    symbol.style.animationDuration = (Math.random() * 10 + 10) + 's';
    symbol.style.animationDelay = Math.random() * 5 + 's';
    symbol.style.willChange = 'transform, opacity';
    
    symbolsContainer.appendChild(symbol);
    symbolCount++;
    
    // Clean up symbol
    setTimeout(() => {
        if (symbol.parentNode) {
            symbol.remove();
            symbolCount--;
        }
    }, 20000);
}

// Reduce symbol creation frequency on mobile
const symbolInterval = isMobile ? 6000 : 3000;
setInterval(createFloatingSymbol, symbolInterval);

// OPTIMIZED SUBMISSION COUNTER
const counter = document.getElementById('submissionCount');
let currentCount = 0;
const targetCount = 287;
let counterAnimating = false;

function animateCounter() {
    if (counterAnimating) return;
    counterAnimating = true;
    
    const increment = Math.ceil(targetCount / 60); // Complete in ~1 second at 60fps
    
    const updateCounter = () => {
        if (currentCount < targetCount) {
            currentCount = Math.min(currentCount + increment, targetCount);
            counter.textContent = currentCount;
            requestAnimationFrame(updateCounter);
        } else {
            counterAnimating = false;
        }
    };
    
    updateCounter();
}

// Start counter animation when page loads
setTimeout(animateCounter, 2000);

// OPTIMIZED SCROLL REVEAL
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // Stop observing once activated for performance
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => {
    observer.observe(el);
});

// SMOOTH SCROLLING FOR NAVIGATION
document.querySelectorAll('.nav-node').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            // Close mobile nav if open
            const nav = document.getElementById('mainNav');
            const hamburger = document.getElementById('hamburgerBtn');
            const body = document.body;
            const navOverlay = document.getElementById('navOverlay');
            
            if (nav && nav.classList.contains('open')) {
                nav.classList.remove('open');
                if (hamburger) hamburger.classList.remove('open');
                if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
                body.classList.remove('nav-open');
                if (navOverlay) navOverlay.classList.remove('active');
            }
            
            // Smooth scroll to section
            setTimeout(() => {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, window.innerWidth <= 768 ? 300 : 0);
        }
    });
});

// OPTIMIZED BACKGROUND INTERACTION
if (!isMobile && !prefersReducedMotion) {
    const blobs = document.querySelectorAll('.morphing-blob');
    let lastMouseUpdate = 0;
    
    const updateBlobPositions = throttle((e) => {
        const now = performance.now();
        if (now - lastMouseUpdate < 50) return; // Limit to 20fps
        lastMouseUpdate = now;
        
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        blobs.forEach((blob, index) => {
            const speed = (index + 1) * 0.3; // Reduced from 0.5
            const x = mouseX * 20 * speed; // Reduced from 30
            const y = mouseY * 20 * speed;
            
            blob.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        });
    }, 50);
    
    document.addEventListener('mousemove', updateBlobPositions, { passive: true });
}

// OPTIMIZED FORM ENHANCEMENT
const form = document.querySelector('.contact-form');
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('.submit-artifact');
        const originalText = submitBtn.textContent;
        
        // Prevent multiple submissions
        submitBtn.disabled = true;
        submitBtn.textContent = 'TRANSMITTING...';
        submitBtn.style.background = 'linear-gradient(45deg, var(--electric-cyan), var(--water-blue))';
        
        setTimeout(() => {
            submitBtn.textContent = 'MESSAGE SENT ✨';
            submitBtn.style.background = 'linear-gradient(45deg, #00ff00, #00aa00)';
            
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.background = 'linear-gradient(45deg, var(--water-blue), var(--liquid-yellow))';
                submitBtn.disabled = false;
                form.reset();
            }, 2000);
        }, 1500);
    });
}

// OPTIMIZED PARALLAX EFFECT
if (!isMobile && !prefersReducedMotion) {
    const parallaxElements = document.querySelectorAll('.hero-title, .hero-subtitle');
    let lastScrollY = 0;
    
    const updateParallax = throttle(() => {
        const scrolled = window.pageYOffset;
        if (Math.abs(scrolled - lastScrollY) < 10) return; // Only update on significant scroll
        lastScrollY = scrolled;
        
        parallaxElements.forEach((el, index) => {
            const speed = (index + 1) * 0.3; // Reduced from 0.5
            el.style.transform = `translate3d(0, ${scrolled * speed}px, 0)`;
        });
    }, 16);
    
    window.addEventListener('scroll', updateParallax, { passive: true });
}

// OPTIMIZED COLOR-SHIFTING EFFECT
if (!prefersReducedMotion) {
    const liquidCanvas = document.querySelector('.liquid-canvas');
    let lastColorUpdate = 0;
    
    const updateColors = throttle(() => {
        const now = performance.now();
        if (now - lastColorUpdate < 100) return; // Limit to 10fps
        lastColorUpdate = now;
        
        const scrollPercent = window.pageYOffset / (document.body.scrollHeight - window.innerHeight);
        const hue = scrollPercent * 360;
        
        document.documentElement.style.setProperty('--dynamic-hue', hue + 'deg');
        if (liquidCanvas) {
            liquidCanvas.style.filter = `blur(80px) hue-rotate(${hue}deg)`;
        }
    }, 100);
    
    window.addEventListener('scroll', updateColors, { passive: true });
}

// OPTIMIZED FILMMAKER PORTRAITS
document.querySelectorAll('.filmmaker-portrait').forEach(portrait => {
    let rippleTimeout;
    
    portrait.addEventListener('mouseenter', () => {
        // Prevent multiple ripples
        if (rippleTimeout) return;
        
        rippleTimeout = setTimeout(() => {
            rippleTimeout = null;
        }, 1000);
        
        // Simplified ripple effect
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            background: radial-gradient(circle, rgba(91, 143, 199, 0.3), transparent);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            animation: rippleEffect 1s ease-out;
            pointer-events: none;
            z-index: 10;
            will-change: width, height, opacity;
        `;
        
        portrait.appendChild(ripple);
        setTimeout(() => ripple.remove(), 1000);
    }, { passive: true });
});

// OPTIMIZED RIPPLE ANIMATION
if (!document.getElementById('ripple-styles')) {
    const rippleStyle = document.createElement('style');
    rippleStyle.id = 'ripple-styles';
    rippleStyle.textContent = `
        @keyframes rippleEffect {
            0% {
                width: 0;
                height: 0;
                opacity: 1;
            }
            100% {
                width: 300px;
                height: 300px;
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);
}

// OPTIMIZED AUDIO VISUALIZATION
if (!isMobile) {
    function createAudioVisualization() {
        const visualizer = document.createElement('div');
        visualizer.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            width: 200px;
            height: 60px;
            display: flex;
            align-items: flex-end;
            gap: 2px;
            z-index: 1000;
            opacity: 0.7;
            will-change: transform;
        `;
        
        const barCount = isMobile ? 10 : 20;
        for (let i = 0; i < barCount; i++) {
            const bar = document.createElement('div');
            bar.style.cssText = `
                width: 8px;
                background: linear-gradient(to top, var(--water-blue), var(--liquid-yellow));
                border-radius: 4px 4px 0 0;
                animation: audioBar ${Math.random() * 2 + 1}s ease-in-out infinite alternate;
                animation-delay: ${Math.random() * 2}s;
                will-change: height;
            `;
            visualizer.appendChild(bar);
        }
        
        document.body.appendChild(visualizer);
    }
    
    // Add audio bar animation
    if (!document.getElementById('audio-styles')) {
        const audioStyle = document.createElement('style');
        audioStyle.id = 'audio-styles';
        audioStyle.textContent = `
            @keyframes audioBar {
                0% { height: 5px; }
                100% { height: ${Math.random() * 50 + 10}px; }
            }
        `;
        document.head.appendChild(audioStyle);
    }
    
    createAudioVisualization();
}

// OPTIMIZED PARTICLE SYSTEM
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.life = 60; // Reduced from 100
        this.maxLife = 60;
        this.size = Math.random() * 3 + 1;
        this.color = `hsl(${Math.random() * 60 + 180}, 70%, 60%)`;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;
        this.vy += 0.1;
    }
    
    draw(ctx) {
        const alpha = this.life / this.maxLife;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
    
    isDead() {
        return this.life <= 0;
    }
}

// OPTIMIZED PARTICLE CANVAS
if (!isMobile && !prefersReducedMotion) {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 5;
    `;
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    const particles = [];
    let lastParticleUpdate = 0;
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', debounce(resizeCanvas, 250));
    
    // Limit particle creation
    let lastClickTime = 0;
    document.addEventListener('click', (e) => {
        const now = performance.now();
        if (now - lastClickTime < 500) return; // Limit to once per 500ms
        lastClickTime = now;
        
        const particleCount = isMobile ? 5 : 10;
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle(e.clientX, e.clientY));
        }
    }, { passive: true });
    
    function animateParticles() {
        const now = performance.now();
        if (now - lastParticleUpdate < 32) { // Limit to 30fps
            requestAnimationFrame(animateParticles);
            return;
        }
        lastParticleUpdate = now;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = particles.length - 1; i >= 0; i--) {
            const particle = particles[i];
            particle.update();
            particle.draw(ctx);
            
            if (particle.isDead()) {
                particles.splice(i, 1);
            }
        }
        
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
}

// OPTIMIZED LOADING SCREEN
function createLoadingScreen() {
    const loader = document.createElement('div');
    loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--void-black);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        transition: opacity 2s ease, transform 2s ease;
    `;
    
    loader.innerHTML = `
        <div style="
            font-family: 'Playfair Display', serif;
            font-size: ${isMobile ? '2.5rem' : '4rem'};
            font-weight: 900;
            font-style: italic;
            background: linear-gradient(45deg, var(--water-blue), var(--liquid-yellow), var(--electric-cyan));
            background-size: 400% 400%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: logoFlow 2s ease-in-out infinite;
            text-align: center;
        ">
            WATERLINE<br>
            <span style="font-size: ${isMobile ? '1rem' : '1.5rem'}; opacity: 0.8;">Loading Visual Experience...</span>
        </div>
    `;
    
    document.body.appendChild(loader);
    
    setTimeout(() => {
        loader.style.opacity = '0';
        loader.style.transform = 'scale(1.5)';
        setTimeout(() => loader.remove(), 2000);
    }, 2000); // Reduced from 3000
}

createLoadingScreen();

// OPTIMIZED GLITCH EFFECTS
function addGlitchEffect() {
    if (document.getElementById('glitch-styles')) return;
    
    const glitchStyle = document.createElement('style');
    glitchStyle.id = 'glitch-styles';
    glitchStyle.textContent = `
        .glitch {
            position: relative;
            animation: glitch 2s infinite;
        }
        
        .glitch::before,
        .glitch::after {
            content: attr(data-text);
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            will-change: transform;
        }
        
        .glitch::before {
            animation: glitchTop 2s infinite;
            clip-path: polygon(0 0, 100% 0, 100% 35%, 0 35%);
        }
        
        .glitch::after {
            animation: glitchBottom 1.5s infinite;
            clip-path: polygon(0 65%, 100% 65%, 100% 100%, 0 100%);
        }
        
        @keyframes glitch {
            2%, 64% { transform: translate(2px, 0) skew(0deg); }
            4%, 60% { transform: translate(-2px, 0) skew(0deg); }
            62% { transform: translate(0, 0) skew(5deg); }
        }
        
        @keyframes glitchTop {
            2%, 64% { transform: translate(2px, -2px); color: var(--electric-cyan); }
            4%, 60% { transform: translate(-2px, 2px); color: var(--sunset-orange); }
            62% { transform: translate(13px, -1px) skew(-13deg); }
        }
        
        @keyframes glitchBottom {
            2%, 64% { transform: translate(-2px, 0); color: var(--sunset-orange); }
            4%, 60% { transform: translate(-2px, 0); color: var(--electric-cyan); }
            62% { transform: translate(-22px, 5px) skew(21deg); }
        }
    `;
    document.head.appendChild(glitchStyle);
}

addGlitchEffect();

// OPTIMIZED GLITCH APPLICATION
if (!prefersReducedMotion) {
    const glitchInterval = isMobile ? 30000 : 15000; // Less frequent on mobile
    setInterval(() => {
        const heroTitle = document.querySelector('.hero-title');
        if (!heroTitle) return;
        
        heroTitle.classList.add('glitch');
        heroTitle.setAttribute('data-text', 'WATERLINE');
        
        setTimeout(() => {
            heroTitle.classList.remove('glitch');
        }, 2000);
    }, glitchInterval);
}

// SMOOTH SCROLL POLYFILL FOR MOBILE (for older browsers)
(function() {
    if ('scrollBehavior' in document.documentElement.style) return;
    // Polyfill for smooth scroll
    document.querySelectorAll('.nav-node').forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                e.preventDefault();
                const top = targetSection.getBoundingClientRect().top + window.pageYOffset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });
})();

// CLEANUP ON PAGE UNLOAD
window.addEventListener('beforeunload', () => {
    animationManager.stop();
    if (observer) observer.disconnect();
});

// PERFORMANCE MONITORING
if (process.env.NODE_ENV === 'development') {
    let frameCount = 0;
    let lastTime = performance.now();
    
    function monitorPerformance() {
        frameCount++;
        const currentTime = performance.now();
        
        if (currentTime >= lastTime + 1000) {
            console.log(`FPS: ${Math.round((frameCount * 1000) / (currentTime - lastTime))}`);
            frameCount = 0;
            lastTime = currentTime;
        }
        
        requestAnimationFrame(monitorPerformance);
    }
    
    monitorPerformance();
}
console.log('🎬 WATERLINE Film Festival - Optimized Visual Experience Loaded');
console.log('🌊 Where Cinema Dissolves Into Art - Now Smoother Than Ever');