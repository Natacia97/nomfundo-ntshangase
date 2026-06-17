document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================================================
       1. MOBILE MENU TOGGLE
       ========================================================================== */
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('open');
            navMenu.classList.toggle('open');
            
            // Toggle body scroll when menu is open on mobile
            if (navMenu.classList.contains('open')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('open');
                navMenu.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    /* ==========================================================================
       2. STICKY NAVBAR ON SCROLL
       ========================================================================== */
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /* ==========================================================================
       3. INTERSECTION OBSERVER FOR ACTIVE NAV LINKS
       ========================================================================== */
    const sections = document.querySelectorAll('section[id]');
    
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px', // Trigger when section occupies the mid-to-upper viewport
        threshold: 0
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(section => observer.observe(section));

    /* ==========================================================================
       4. SCROLL REVEAL ANIMATIONS
       ========================================================================== */
    // Add CSS dynamically for scroll reveal animation styles
    const style = document.createElement('style');
    style.innerHTML = `
        .reveal {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }
        .reveal.active {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);

    // Apply reveal class to service cards, sections, etc.
    const serviceCards = document.querySelectorAll('.service-card');
    const highlightItems = document.querySelectorAll('.highlight-item');
    const aboutText = document.querySelector('.about-text');
    const aboutCard = document.querySelector('.about-card');
    
    const revealElements = [...serviceCards, ...highlightItems];
    if (aboutText) revealElements.push(aboutText);
    if (aboutCard) revealElements.push(aboutCard);

    revealElements.forEach(el => el.classList.add('reveal'));

    const revealObserverOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const revealObserverCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Stop observing after animation triggers
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealObserverCallback, revealObserverOptions);
    revealElements.forEach(el => revealObserver.observe(el));

    /* ==========================================================================
       5. CONTACT FORM HANDLER (Fetch/AJAX to Formspree)
       ========================================================================== */
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Stop standard redirect submission
            
            const submitBtn = contactForm.querySelector('.btn-submit');
            const originalBtnContent = submitBtn.innerHTML;
            
            // Set loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';
            formStatus.className = 'form-status';
            formStatus.style.display = 'none';

            // Gather Form Data
            const formData = new FormData(contactForm);
            
            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    // Success Case
                    formStatus.className = 'form-status success';
                    formStatus.innerHTML = 'Thank you! Your inquiry was sent successfully. I will get back to you shortly.';
                    contactForm.reset(); // Clear the inputs
                } else {
                    // Service Side Error
                    const data = await response.json();
                    if (data && data.errors) {
                        formStatus.innerHTML = data.errors.map(error => error.message).join(', ');
                    } else {
                        formStatus.innerHTML = 'Oops! There was a problem submitting your form. Please try again.';
                    }
                    formStatus.className = 'form-status error';
                }
            } catch (error) {
                // Network/Client Error
                formStatus.className = 'form-status error';
                formStatus.innerHTML = 'Could not submit. Please check your network connection and try again.';
                console.error('Submission error:', error);
            } finally {
                // Reset submit button state
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnContent;
                formStatus.style.display = 'block';
            }
        });
    }
});
