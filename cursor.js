/*=============================================================================
  Elegant Dot & Ring Cursor
=============================================================================*/
const isTouchDevices = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (window.matchMedia("(pointer: coarse)").matches);

if (!isTouchDevices) {
    // 1. Mark body to trigger CSS hiding the default cursor
    document.body.classList.add('has-custom-cursor');
    
    // 2. Create Dot and Ring DOM elements
    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    
    const ring = document.createElement('div');
    ring.className = 'cursor-ring';
    
    document.body.appendChild(dot);
    document.body.appendChild(ring);
    
    // 3. Track coordinates
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    
    // 4. Listen for mouse movements
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Immediate update for dot (no lag)
        dot.style.left = `${mouseX}px`;
        dot.style.top = `${mouseY}px`;
    });
    
    // 5. Lerp animation loop for smooth trailing ring
    const renderLoop = () => {
        // The factor 0.15 makes the ring slightly trail behind the dot
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        
        ring.style.left = `${ringX}px`;
        ring.style.top = `${ringY}px`;
        
        requestAnimationFrame(renderLoop);
    };
    renderLoop();
    
    // 6. Interactive Element Hover State
    const interactiveSelectors = 'a, button, .btn, .card, input, textarea';
    
    const attachHoverStates = () => {
        const interactives = document.querySelectorAll(interactiveSelectors);
        interactives.forEach(el => {
            // Avoid adding multiple listeners if already added
            if(!el.dataset.cursorAttached) {
                el.dataset.cursorAttached = "true";
                el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
                el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
            }
        });
    };
    
    // Attach immediately
    attachHoverStates();
    
    // If elements are dynamic (e.g., added later), we'd use MutationObserver, 
    // but for our static landing page, initial attachment is sufficient.
}
