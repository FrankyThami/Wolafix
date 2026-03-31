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
        const duration = 5000; // ms per full loop
        let startTime = null;
        let carX = 0, carY = 0;

        function animateCar(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = (timestamp - startTime) % duration;
            const distance = (elapsed / duration) * pathLength;
            const point = trackPath.getPointAtLength(distance);
            carX = point.x;
            carY = point.y;

            // Move the circle by setting cx/cy
            car.setAttribute('cx', carX);
            car.setAttribute('cy', carY);

            requestAnimationFrame(animateCar);
        }

        requestAnimationFrame(animateCar);

        // Mouse proximity glow effect
        trackSvg.addEventListener('mousemove', (e) => {
            const svgRect = trackSvg.getBoundingClientRect();
            const scaleX = 304 / svgRect.width;   // viewBox width / rendered width
            const scaleY = 112 / svgRect.height;  // viewBox height / rendered height

            // Convert mouse coords to SVG viewBox space
            const mouseX = (e.clientX - svgRect.left) * scaleX;
            const mouseY = (e.clientY - svgRect.top) * scaleY;

            const dx = mouseX - carX;
            const dy = mouseY - carY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 25) {
                // Near — white glow
                car.setAttribute('fill', '#ffffff');
                car.setAttribute('filter', 'url(#glow)');
                car.setAttribute('r', '7');
            } else {
                // Far — default purple
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

});
