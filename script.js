// ══════════════════════════════════════════════════════════════════
// ThalirX Studio – Web Application Development Service Page
// Script: Cursor, Scroll, Nav, Animations, Tilt
// ══════════════════════════════════════════════════════════════════

// ── Device Detection ──
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// ══════════════════════════════════════════════════
// PRELOADER
// ══════════════════════════════════════════════════
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('fade-out');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 800);
    }
    document.body.classList.add('loaded');
});

// ══════════════════════════════════════════════════
// SCROLL HANDLER (Throttled via rAF)
// ══════════════════════════════════════════════════
let isScrolling = false;

window.addEventListener('scroll', () => {
    if (!isScrolling) {
        window.requestAnimationFrame(() => {
            handleScroll();
            isScrolling = false;
        });
        isScrolling = true;
    }
}, { passive: true });

function handleScroll() {
    const winScroll = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = docHeight > 0 ? (winScroll / docHeight) * 100 : 0;

    // Scroll Progress Bar
    const progressBar = document.querySelector('.scroll-progress-bar');
    if (progressBar) progressBar.style.width = scrolled + '%';

    // Back to Top Button
    const topBtn = document.getElementById('backToTop');
    if (topBtn) {
        topBtn.style.display = winScroll > 500 ? 'flex' : 'none';
        topBtn.style.justifyContent = 'center';
        topBtn.style.alignItems = 'center';
    }

    // Parallax on hero video
    if (!isMobile) {
        const heroVideo = document.querySelector('.hero-bg-video');
        if (heroVideo) {
            heroVideo.style.transform = `translateX(-50%) translateY(calc(-50% + ${winScroll * 0.4}px))`;
        }
    }

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (winScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
}

// ══════════════════════════════════════════════════
// MOBILE MENU TOGGLE
// ══════════════════════════════════════════════════
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-links a');

if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
    });

    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });
}

// ══════════════════════════════════════════════════
// BACK TO TOP
// ══════════════════════════════════════════════════
const backToTopBtn = document.getElementById('backToTop');
if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ══════════════════════════════════════════════════
// CUSTOM CURSOR (Desktop Only)
// ══════════════════════════════════════════════════
const cursor = document.getElementById('cursor');
const cursorBlur = document.getElementById('cursor-blur');

// Force off-screen until first mouse move to prevent wrong spawn position
if (cursor) { cursor.style.left = '-9999px'; cursor.style.top = '-9999px'; }
if (cursorBlur) { cursorBlur.style.left = '-9999px'; cursorBlur.style.top = '-9999px'; }

if (!isMobile && cursor && cursorBlur) {
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';

        window.requestAnimationFrame(() => {
            cursorBlur.style.left = e.clientX + 'px';
            cursorBlur.style.top = e.clientY + 'px';
        });
    });

    // Hover expand on interactive elements
    const interactiveEls = document.querySelectorAll('a, button, .glass-panel, .nav-toggle');
    interactiveEls.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.width = '40px';
            cursor.style.height = '40px';
            cursor.style.borderColor = '#00ff55';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.width = '20px';
            cursor.style.height = '20px';
            cursor.style.borderColor = '#ffffff';
        });
    });
} else {
    if (cursor) cursor.style.display = 'none';
    if (cursorBlur) cursorBlur.style.display = 'none';
}

// ══════════════════════════════════════════════════
// 3D TILT EFFECT (Desktop Only)
// ══════════════════════════════════════════════════
function applyTilt(card) {
    if (isMobile) return; // Skip tilt on mobile for performance

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
}

// Apply tilt to all tiltable elements
document.querySelectorAll('[data-tilt]').forEach(applyTilt);

// ══════════════════════════════════════════════════
// SCROLL ANIMATIONS (IntersectionObserver)
// ══════════════════════════════════════════════════
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -80px 0px'
};

const fadeUpObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            fadeUpObserver.unobserve(entry.target);
            
            const counterContainer = ['clientCounter', 'communityCounter'].includes(entry.target.id)
                ? entry.target
                : entry.target.querySelector('#clientCounter, #communityCounter');
            if(counterContainer && !counterContainer.classList.contains('animated')) {
                counterContainer.classList.add('animated'); 
                const targetStr = counterContainer.getAttribute('data-target').toString();
                const digits = targetStr.split('');
                
                counterContainer.innerHTML = ''; 

                digits.forEach((digit, index) => {
                    const column = document.createElement('div');
                    column.className = 'digit-column';
                    let numbersHtml = '<div class="digit">0</div>';
                    
                    for(let i=1; i < 15; i++) {
                        numbersHtml += `<div class="digit">${Math.floor(Math.random() * 10)}</div>`;
                    }
                    numbersHtml += `<div class="digit">${digit}</div>`;
                    
                    column.innerHTML = numbersHtml;
                    counterContainer.appendChild(column);
                    
                    setTimeout(() => {
                        const firstDigit = column.querySelector('.digit');
                        const h = firstDigit.getBoundingClientRect().height;
                        const remHeight = h / parseFloat(getComputedStyle(document.documentElement).fontSize);
                        column.style.transform = `translateY(-${15 * remHeight}rem)`; 
                    }, 100); 
                });

                const plusSign = document.createElement('div');
                plusSign.className = 'plus-symbol';
                plusSign.innerText = '+';
                counterContainer.appendChild(plusSign);
            }
        }
    });
}, observerOptions);

function observeElements(selector) {
    document.querySelectorAll(selector).forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        fadeUpObserver.observe(el);
    });
}

// Observe all animatable elements
observeElements(
    '.section-title, ' +
    '.about-text, ' +
    '.why-card, ' +
    '.service-card, ' +
    '.process-step, ' +
    '.process-connector, ' +
    '.tech-category, ' +
    '.tech-card, ' +
    '.cta-card, ' +
    '.cta-text, ' +
    '.tech-subtitle, ' +
    '.footer-col, ' +
    '.footer-logo, ' +
    '.vision-mission-stack, ' +
    '.stat, ' +
    '.stat-item'
);

function animateSingleCounter(stat) {
    if (stat.classList.contains('animated')) return;
    stat.classList.add('animated');
    
    const target = +stat.getAttribute('data-target');
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        
        const currentCount = Math.floor(easedProgress * target);
        const showPlus = (target >= 5 && target !== 2025);
        stat.innerText = currentCount + (showPlus ? '+' : '');
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            stat.innerText = target + (showPlus ? '+' : '');
        }
    }
    
    requestAnimationFrame(update);
}

function observeStats() {
    const stats = document.querySelectorAll('.stat-number');
    if (stats.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSingleCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    stats.forEach(stat => observer.observe(stat));
}

document.addEventListener('DOMContentLoaded', () => {
    observeStats();
});

// ══════════════════════════════════════════════════
// SMOOTH SCROLL FOR ANCHOR LINKS
// ══════════════════════════════════════════════════
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetEl = document.querySelector(targetId);
        if (targetEl) {
            e.preventDefault();
            const navHeight = document.querySelector('.navbar')?.offsetHeight || 70;
            const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});
