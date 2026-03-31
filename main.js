/*=============================================================================
  Wolafix | Main JavaScript
=============================================================================*/

document.addEventListener("DOMContentLoaded", () => {

    // 1. Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav .nav-link, .mobile-nav .btn-mobile');
    const icon = menuToggle.querySelector('i');

    menuToggle.addEventListener('click', () => {
        const isOpen = mobileNav.classList.contains('open');
        if (isOpen) {
            mobileNav.classList.remove('open');
            icon.classList.replace('ph-x', 'ph-list');
        } else {
            mobileNav.classList.add('open');
            icon.classList.replace('ph-list', 'ph-x');
        }
    });

    // Close mobile menu when a link is clicked
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('open');
            icon.classList.replace('ph-x', 'ph-list');
        });
    });

    // 2. Scroll Reveal Animations via Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const hiddenSections = document.querySelectorAll('.hidden-section');
    hiddenSections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Fallback: reveal hero immediately
    setTimeout(() => {
        const heroSection = document.querySelector('.hero.hidden-section');
        if (heroSection) heroSection.classList.add('show');
    }, 100);

    // 3. SVG Motion Path Animation
    const trackPath = document.getElementById('motion-path');
    const car = document.getElementById('motion-car');
    const trackSvg = document.getElementById('track-svg');

    if (trackPath && car && trackSvg) {
        const pathLength = trackPath.getTotalLength();
        const duration = 5000;
        let startTime = null;
        let carX = 0, carY = 0;

        function animateCar(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = (timestamp - startTime) % duration;
            const distance = (elapsed / duration) * pathLength;
            const point = trackPath.getPointAtLength(distance);
            carX = point.x;
            carY = point.y;
            car.setAttribute('cx', carX);
            car.setAttribute('cy', carY);
            requestAnimationFrame(animateCar);
        }
        requestAnimationFrame(animateCar);

        trackSvg.addEventListener('mousemove', (e) => {
            const svgRect = trackSvg.getBoundingClientRect();
            const scaleX = 304 / svgRect.width;
            const scaleY = 112 / svgRect.height;
            const mouseX = (e.clientX - svgRect.left) * scaleX;
            const mouseY = (e.clientY - svgRect.top) * scaleY;
            const dx = mouseX - carX;
            const dy = mouseY - carY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 25) {
                car.setAttribute('fill', '#ffffff');
                car.setAttribute('filter', 'url(#glow)');
                car.setAttribute('r', '7');
            } else {
                car.setAttribute('fill', '#a855f7');
                car.removeAttribute('filter');
                car.setAttribute('r', '5');
            }
        });

        trackSvg.addEventListener('mouseleave', () => {
            car.setAttribute('fill', '#a855f7');
            car.removeAttribute('filter');
            car.setAttribute('r', '5');
        });
    }

    // 4. Magnetic Letter Effect on showcase text
    const magneticLines = document.querySelectorAll('.magnetic-text');
    const GLOW_RADIUS = 60; // px — how close the mouse must be to light a letter

    magneticLines.forEach(line => {
        // Split text into individual character <span>s, preserving spaces
        const text = line.textContent;
        line.textContent = '';
        text.split('').forEach(ch => {
            const span = document.createElement('span');
            span.className = ch === ' ' ? 'char space' : 'char';
            span.textContent = ch === ' ' ? '\u00A0' : ch; // non-breaking space for gaps
            line.appendChild(span);
        });
    });

    const allChars = document.querySelectorAll('.magnetic-text .char');

    document.addEventListener('mousemove', (e) => {
        const mx = e.clientX;
        const my = e.clientY;

        allChars.forEach(span => {
            const rect = span.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dist = Math.sqrt((mx - cx) ** 2 + (my - cy) ** 2);

            if (dist < GLOW_RADIUS) {
                // Intensity fades from 1 (right on it) to 0 (at radius edge)
                const intensity = 1 - dist / GLOW_RADIUS;
                const alpha = (intensity * 0.9).toFixed(2);
                span.classList.add('lit');
                // Smoothly vary glow strength based on proximity
                span.style.textShadow =
                    `0 0 ${Math.round(6 * intensity)}px rgba(255,255,255,${alpha}),` +
                    `0 0 ${Math.round(18 * intensity)}px rgba(255,255,255,${(intensity * 0.4).toFixed(2)})`;
            } else {
                span.classList.remove('lit');
                span.style.textShadow = '';
            }
        });
    });

});
