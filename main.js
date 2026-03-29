/*=============================================================================
  WOLFIX | Main JavaScript
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
        threshold: 0.15 // Trigger when 15% of the section is visible
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                // Optional: stop observing once it's shown if we only want it to reveal once
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const hiddenSections = document.querySelectorAll('.hidden-section');
    hiddenSections.forEach(section => {
        sectionObserver.observe(section);
    });
    
    // Fallback: Check if the hero section is in view on load immediately
    setTimeout(() => {
        const heroSection = document.querySelector('.hero.hidden-section');
        if (heroSection) {
            heroSection.classList.add('show');
        }
    }, 100);

});
