/* ============================================================
   OPLIORA PRIVATE LIMITED — Main Script
   Premium corporate website interactions & animations
   Vanilla JS · No dependencies · Performance-first
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ----------------------------------------------------------
     0. REDUCED MOTION CHECK
     ---------------------------------------------------------- */
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  /* If user prefers reduced motion, reveal everything instantly
     and skip parallax / cursor effects entirely. */
  if (prefersReducedMotion) {
    document
      .querySelectorAll(
        '.reveal-up, .reveal-left, .reveal-right, .reveal-scale'
      )
      .forEach((el) => el.classList.add('visible'));

    document
      .querySelectorAll(
        '.hero__tagline, .hero__headline, .hero__description, .hero__actions, .hero__scroll'
      )
      .forEach((el) => el.classList.add('visible'));
  }

  /* ----------------------------------------------------------
     1. NAVBAR SCROLL BEHAVIOR
     ---------------------------------------------------------- */
  const nav = document.querySelector('.nav');
  let lastScrollY = window.scrollY;
  let navTicking = false;

  function onNavScroll() {
    lastScrollY = window.scrollY;
    if (!navTicking) {
      requestAnimationFrame(updateNav);
      navTicking = true;
    }
  }

  function updateNav() {
    if (!nav) { navTicking = false; return; }

    if (lastScrollY > 80) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
    navTicking = false;
  }

  window.addEventListener('scroll', onNavScroll, { passive: true });
  // Initialise on load
  updateNav();

  /* ----------------------------------------------------------
     2. MOBILE NAVIGATION
     ---------------------------------------------------------- */
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileMenu = document.querySelector('.nav__mobile-menu');
  const mobileLinks = document.querySelectorAll('.nav__mobile-link');

  function openMobileMenu() {
    if (!hamburger || !mobileMenu) return;
    hamburger.classList.add('active', 'nav__hamburger--active');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('open', 'nav__mobile-menu--open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (!hamburger || !mobileMenu) return;
    hamburger.classList.remove('active', 'nav__hamburger--active');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open', 'nav__mobile-menu--open');
    document.body.style.overflow = '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu && mobileMenu.classList.contains('open');
      isOpen ? closeMobileMenu() : openMobileMenu();
    });
  }

  // Close menu when a link is clicked
  mobileLinks.forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });

  /* ----------------------------------------------------------
     3. SMOOTH SCROLL
     ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const offset = 80; // px offset for fixed navbar
      const top =
        target.getBoundingClientRect().top + window.pageYOffset - offset;

      window.scrollTo({ top, behavior: 'smooth' });

      // Close mobile menu if open
      closeMobileMenu();
    });
  });

  /* ----------------------------------------------------------
     4. SCROLL-TRIGGERED REVEAL ANIMATIONS
     ---------------------------------------------------------- */
  if (!prefersReducedMotion) {
    const revealElements = document.querySelectorAll(
      '.reveal-up, .reveal-left, .reveal-right, .reveal-scale'
    );

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px',
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));

    /* Staggered children: parent has [data-stagger],
       each child gets an incremental transition-delay. */
    const staggerParents = document.querySelectorAll('[data-stagger]');

    staggerParents.forEach((parent) => {
      const delay = parseInt(parent.dataset.stagger, 10) || 100; // ms between children
      const children = parent.children;

      const staggerObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Determine child index for stagger delay
              const idx = Array.from(children).indexOf(entry.target);
              entry.target.style.transitionDelay = `${idx * delay}ms`;
              entry.target.classList.add('visible');
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.12,
          rootMargin: '0px 0px -60px 0px',
        }
      );

      Array.from(children).forEach((child) => {
        // Ensure children have a reveal class for the CSS transition
        if (
          !child.classList.contains('reveal-up') &&
          !child.classList.contains('reveal-left') &&
          !child.classList.contains('reveal-right') &&
          !child.classList.contains('reveal-scale')
        ) {
          child.classList.add('reveal-up');
        }
        staggerObserver.observe(child);
      });
    });
  }

  /* ----------------------------------------------------------
     5. HERO TEXT REVEAL
     ---------------------------------------------------------- */
  if (!prefersReducedMotion) {
    const heroReveals = [
      { selector: '.hero__tagline', delay: 200 },
      { selector: '.hero__headline', delay: 500 },
      { selector: '.hero__description', delay: 800 },
      { selector: '.hero__actions', delay: 1100 },
      { selector: '.hero__scroll', delay: 1500 },
    ];

    heroReveals.forEach(({ selector, delay }) => {
      const el = document.querySelector(selector);
      if (el) {
        setTimeout(() => el.classList.add('visible'), delay);
      }
    });
  }

  /* ----------------------------------------------------------
     6. HERO PARALLAX
     ---------------------------------------------------------- */
  if (!prefersReducedMotion) {
    const heroContent = document.querySelector('.hero__content');
    let parallaxTicking = false;

    function updateParallax() {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;

      if (heroContent && scrollY < vh) {
        const translateY = scrollY * 0.2;
        const opacity = Math.max(0, 1 - (scrollY / vh) * 0.7);

        heroContent.style.transform = `translateY(${translateY}px)`;
        heroContent.style.opacity = opacity;
      }
      parallaxTicking = false;
    }

    window.addEventListener(
      'scroll',
      () => {
        if (!parallaxTicking) {
          requestAnimationFrame(updateParallax);
          parallaxTicking = true;
        }
      },
      { passive: true }
    );
  }

  /* ----------------------------------------------------------
     7. MARQUEE PAUSE ON HOVER
     ---------------------------------------------------------- */
  const marqueeTrack = document.querySelector('.marquee__track');

  if (marqueeTrack) {
    marqueeTrack.addEventListener('mouseenter', () => {
      marqueeTrack.style.animationPlayState = 'paused';
    });

    marqueeTrack.addEventListener('mouseleave', () => {
      marqueeTrack.style.animationPlayState = 'running';
    });
  }

  /* ----------------------------------------------------------
     8. HERO SVG ARROW ANIMATION
     ---------------------------------------------------------- */
  const heroVisual = document.querySelector('.hero__visual');

  if (heroVisual) {
    // Add floating animation classes to individual arrow paths
    const arrowPaths = heroVisual.querySelectorAll('path');
    arrowPaths.forEach((path, i) => {
      path.classList.add('hero-arrow-float');
      // Stagger animation delay per arrow for organic movement
      path.style.animationDelay = `${i * 0.3}s`;
    });

    // Add subtle pulse/rotation to the entire SVG group
    const svgGroups = heroVisual.querySelectorAll('svg, g');
    svgGroups.forEach((group) => {
      group.classList.add('hero-arrow-pulse');
    });
  }

  /* ----------------------------------------------------------
     9. VALUES COUNTER / REVEAL
     ---------------------------------------------------------- */
  const valuesSection = document.querySelector('.values');

  if (valuesSection && !prefersReducedMotion) {
    const valuesItems = valuesSection.querySelectorAll('.values__item');

    const valuesObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Stagger each value item
            valuesItems.forEach((item, i) => {
              setTimeout(() => item.classList.add('visible'), i * 150);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    valuesObserver.observe(valuesSection);
  }

  /* ----------------------------------------------------------
     10. CAREERS TIMELINE / PROCESS STEPS
     ---------------------------------------------------------- */
  const careersProcess = document.querySelector('.careers__process');

  if (careersProcess && !prefersReducedMotion) {
    const steps = careersProcess.querySelectorAll(
      '.careers__step, .careers__process-step'
    );

    const careersObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            steps.forEach((step, i) => {
              setTimeout(() => step.classList.add('active'), i * 300);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    careersObserver.observe(careersProcess);
  }

  /* ----------------------------------------------------------
     11. CONTACT FORM (placeholder / simulated)
     ---------------------------------------------------------- */
  const contactForm = document.querySelector('.contact__form');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector(
        'button[type="submit"], .contact__submit'
      );
      if (!submitBtn) return;

      // Store original text
      const originalText = submitBtn.textContent;

      // Show sending state
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
      submitBtn.classList.add('sending');

      // Simulate success after 1.5s
      setTimeout(() => {
        submitBtn.textContent = 'Sent ✓';
        submitBtn.classList.remove('sending');
        submitBtn.classList.add('sent');

        // Reset form and button after 3s
        setTimeout(() => {
          contactForm.reset();
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          submitBtn.classList.remove('sent');
        }, 3000);
      }, 1500);
    });
  }

  /* ----------------------------------------------------------
     12. CURSOR GLOW EFFECT (desktop only)
     ---------------------------------------------------------- */
  if (!prefersReducedMotion) {
    const isDesktop = window.matchMedia('(min-width: 769px)').matches;
    const heroSection = document.querySelector('.hero');

    if (isDesktop && heroSection) {
      // Create glow element if not in HTML
      let cursorGlow = heroSection.querySelector('.hero__cursor-glow');

      if (!cursorGlow) {
        cursorGlow = document.createElement('div');
        cursorGlow.classList.add('hero__cursor-glow');
        // Inline fallback styles (CSS should handle appearance)
        Object.assign(cursorGlow.style, {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(0,188,212,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
          transform: 'translate(-50%, -50%)',
          opacity: '0',
          transition: 'opacity 0.35s ease',
          zIndex: '1',
        });
        heroSection.style.position =
          heroSection.style.position || 'relative';
        heroSection.style.overflow = 'hidden';
        heroSection.appendChild(cursorGlow);
      }

      let glowRAF = null;

      heroSection.addEventListener('mousemove', (e) => {
        if (glowRAF) cancelAnimationFrame(glowRAF);

        glowRAF = requestAnimationFrame(() => {
          const rect = heroSection.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          cursorGlow.style.transform = `translate(${x - 160}px, ${y - 160}px)`;
          cursorGlow.style.opacity = '1';
        });
      });

      heroSection.addEventListener('mouseleave', () => {
        cursorGlow.style.opacity = '0';
      });
    }
  }

  /* ----------------------------------------------------------
     13. (Handled in section 0 above)
         Reduced Motion support applied at the very top.
     ---------------------------------------------------------- */

  /* ----------------------------------------------------------
     14. NAVBAR ACTIVE LINK TRACKING
     ---------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  if (sections.length && navLinks.length) {
    const activeLinkObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');

            navLinks.forEach((link) => {
              link.classList.remove('active', 'nav__link--active');
              if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('active', 'nav__link--active');
              }
            });
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: '-80px 0px -40% 0px',
      }
    );

    sections.forEach((section) => activeLinkObserver.observe(section));
  }

  /* ----------------------------------------------------------
     15. BACK TO TOP BUTTON
     ---------------------------------------------------------- */
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('back-to-top--visible');
      } else {
        backToTopBtn.classList.remove('back-to-top--visible');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ----------------------------------------------------------
     UTILITY: Debounce (not used above but handy for extensions)
     ---------------------------------------------------------- */
  // eslint-disable-next-line no-unused-vars
  function debounce(fn, wait = 100) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  /* ----------------------------------------------------------
     BOOT LOG
     ---------------------------------------------------------- */
  console.log(
    '%c✦ Opliora %c— script loaded',
    'color:#00bcd4;font-weight:700',
    'color:#94a3b8'
  );
});
