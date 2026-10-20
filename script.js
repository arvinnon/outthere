// ============================================
// Light / Dark Theme
// ============================================
const themeToggle = document.getElementById('themeToggle');
const themeColorMeta = document.querySelector('meta[name="theme-color"]');
const systemLight = window.matchMedia('(prefers-color-scheme: light)');

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (themeToggle) {
        themeToggle.setAttribute('aria-label', theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
    }
    if (themeColorMeta) {
        themeColorMeta.setAttribute('content', theme === 'light' ? '#E8E2D5' : '#1A1A1A');
    }
}

function savedTheme() {
    try {
        return localStorage.getItem('theme');
    } catch (e) {
        return null;
    }
}

applyTheme(document.documentElement.getAttribute('data-theme') || 'dark');

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        applyTheme(next);
        try {
            localStorage.setItem('theme', next);
        } catch (e) {}
    });
}

// Follow system changes until the visitor picks a theme themselves
systemLight.addEventListener('change', (e) => {
    if (!savedTheme()) {
        applyTheme(e.matches ? 'light' : 'dark');
    }
});

// ============================================
// Mobile Menu Toggle
// ============================================
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

function setMenu(open) {
    navMenu.classList.toggle('active', open);
    hamburger.setAttribute('aria-expanded', String(open));
    hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        setMenu(!navMenu.classList.contains('active'));
    });

    // Close menu on link click
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => setMenu(false));
    });

    // Close menu with Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            setMenu(false);
            hamburger.focus();
        }
    });
}

// ============================================
// Navbar Background on Scroll
// ============================================
const navbar = document.querySelector('.navbar-overlay');

if (navbar) {
    const updateNavbar = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40 || navMenu.classList.contains('active'));
    };
    window.addEventListener('scroll', updateNavbar, { passive: true });
    hamburger.addEventListener('click', updateNavbar);
    updateNavbar();
}

// ============================================
// Active Nav Link While Scrolling
// ============================================
const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
const sections = [...navLinks]
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

if ('IntersectionObserver' in window && sections.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
                });
            }
        });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(section => sectionObserver.observe(section));
}

// ============================================
// Scroll Reveal
// ============================================
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if ('IntersectionObserver' in window && !reduceMotion) {
    document.documentElement.classList.add('js');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.reveal').forEach((el, i) => {
        // Stagger siblings slightly so rows animate in sequence
        el.style.transitionDelay = `${(i % 5) * 80}ms`;
        revealObserver.observe(el);
    });
}
