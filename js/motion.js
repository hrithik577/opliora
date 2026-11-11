/**
 * OPLIORA MOTION SYSTEM (GSAP + ScrollTrigger + Lenis)
 * Production-grade choreography engine.
 *
 * Implements:
 * - Smooth momentum scrolling (Lenis) synced with GSAP ticker
 * - Cinematic Hero entrance timeline (words reveal, 3D entrance, CTA stagger)
 * - Pinned storytelling experience in About section
 * - Feedo section background morph & gold beam sweep
 * - Careers SVG path drawing linked to ScrollTrigger
 * - Magnetic button hover interactions
 * - Dual-layer desktop cursor follower
 * - Full reduced-motion graceful degradation
 */

export class MotionEngine {
  constructor() {
    this.lenis = null;
    this.prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    this.init();
  }

  init() {
    // 1. Initialize Lenis Smooth Scroll (if not reduced motion and available)
    this.initLenis();

    // 2. Register GSAP Plugins
    if (window.gsap && window.ScrollTrigger) {
      window.gsap.registerPlugin(window.ScrollTrigger);
    } else {
      console.warn("✦ GSAP / ScrollTrigger not detected. Running standard view.");
      return;
    }

    if (this.prefersReducedMotion) {
      this.handleReducedMotion();
      return;
    }

    // 3. Setup Animations
    this.initHeroEntrance();
    this.initAboutPinnedStory();
    this.initFeedoShowcase();
    this.initCareersTimeline();
    this.initPrinciplesInteractions();
    this.initMagneticButtons();
    this.initCursorFollower();
    this.initScrollProgress();
  }

  initLenis() {
    if (this.prefersReducedMotion || !window.Lenis) return;

    try {
      this.lenis = new window.Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth exponential decay
        direction: "vertical",
        gestureDirection: "vertical",
        smooth: true,
        smoothTouch: false,
        touchMultiplier: 1.5,
      });

      // Synchronize Lenis with GSAP ScrollTrigger
      this.lenis.on("scroll", () => {
        if (window.ScrollTrigger) window.ScrollTrigger.update();
      });

      window.gsap.ticker.add((time) => {
        this.lenis.raf(time * 1000);
      });

      window.gsap.ticker.lagSmoothing(0);
    } catch (e) {
      console.warn("✦ Lenis init bypassed:", e);
    }
  }

  initHeroEntrance() {
    const gsap = window.gsap;

    const heroTl = gsap.timeline({
      defaults: { ease: "power3.out" },
    });

    // 1. Non-blocking nav logo entrance
    heroTl.from(".nav__brand", {
      opacity: 0,
      y: -18,
      duration: 0.8,
      delay: 0.1,
    });

    // 2. Nav links & CTA
    heroTl.from(
      ".nav__links li, .nav__cta",
      {
        opacity: 0,
        y: -14,
        stagger: 0.06,
        duration: 0.6,
      },
      "-=0.5"
    );

    // 3. Hero Tagline Pill
    heroTl.from(
      ".hero__tagline",
      {
        opacity: 0,
        y: 20,
        scale: 0.96,
        duration: 0.7,
      },
      "-=0.4"
    );

    // 4. Headline line-by-line / word reveal
    heroTl.from(
      ".hero__headline-line",
      {
        yPercent: 100,
        opacity: 0,
        duration: 1.0,
        stagger: 0.16,
        ease: "power4.out",
      },
      "-=0.45"
    );

    // 5. Supporting Description
    heroTl.from(
      ".hero__description",
      {
        opacity: 0,
        y: 24,
        duration: 0.85,
      },
      "-=0.6"
    );

    // 6. Action Buttons
    heroTl.from(
      ".hero__actions .btn",
      {
        opacity: 0,
        y: 20,
        stagger: 0.12,
        duration: 0.7,
      },
      "-=0.55"
    );

    // 7. Hero 3D Canvas / Visual Fade-in
    heroTl.from(
      ".hero__visual",
      {
        opacity: 0,
        scale: 0.9,
        duration: 1.4,
        ease: "power2.out",
      },
      0.3
    );

    // 8. Scroll Indicator
    heroTl.from(
      ".hero__scroll",
      {
        opacity: 0,
        y: 15,
        duration: 0.8,
      },
      "-=0.4"
    );
  }

  initAboutPinnedStory() {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    const aboutSection = document.querySelector("#about");
    const storyCards = document.querySelectorAll(".about__story-card");
    const geoVisual = document.querySelector(".about__geometry-visual");

    if (!aboutSection || storyCards.length < 2) return;

    // Pin the About storytelling container while visitor scrolls through scenes
    const pinDistance = window.innerHeight * 1.5;

    const storyTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: aboutSection,
        start: "top top",
        end: `+=${pinDistance}`,
        pin: true,
        scrub: 0.8,
        anticipatePin: 1,
      },
    });

    // Cross-fade through the 3 storytelling scenes
    storyCards.forEach((card, index) => {
      if (index === 0) return; // First card is active initially

      const prevCard = storyCards[index - 1];

      // Fade out previous card
      storyTimeline.to(
        prevCard,
        {
          opacity: 0.08,
          y: -25,
          scale: 0.96,
          duration: 1,
        },
        `scene-${index}`
      );

      // Fade in current card
      storyTimeline.fromTo(
        card,
        { opacity: 0, y: 35, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 1 },
        `scene-${index}`
      );

      // Morph / rotate geometric accent facets in sync
      if (geoVisual) {
        storyTimeline.to(
          geoVisual,
          {
            rotationZ: index * 18,
            rotationY: index * 24,
            scale: 1 + index * 0.05,
            duration: 1,
          },
          `scene-${index}`
        );
      }
    });
  }

  initFeedoShowcase() {
    const gsap = window.gsap;
    const feedoSection = document.querySelector("#business");
    if (!feedoSection) return;

    // Background transition from Navy to Obsidian Black
    gsap.to("body", {
      scrollTrigger: {
        trigger: feedoSection,
        start: "top 70%",
        end: "bottom 30%",
        onEnter: () => feedoSection.classList.add("feedo--active"),
        onLeaveBack: () => feedoSection.classList.remove("feedo--active"),
      },
    });

    // Gold Light Sweep Beam Animation
    const lightBeam = feedoSection.querySelector(".feedo__light-beam");
    if (lightBeam) {
      gsap.fromTo(
        lightBeam,
        { xPercent: -100, opacity: 0 },
        {
          xPercent: 120,
          opacity: 0.75,
          duration: 2.2,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: feedoSection,
            start: "top 60%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    // Feedo Logo Mask Reveal
    const logoFrame = feedoSection.querySelector(".feedo__logo-frame");
    if (logoFrame) {
      gsap.from(logoFrame, {
        scale: 0.88,
        opacity: 0,
        boxShadow: "0 0 0 rgba(212,160,23,0)",
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: feedoSection,
          start: "top 65%",
        },
      });
    }

    // Staggered Feedo Features List
    gsap.from(".feedo__feature", {
      opacity: 0,
      x: -25,
      stagger: 0.15,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".feedo__features",
        start: "top 80%",
      },
    });
  }

  initCareersTimeline() {
    const gsap = window.gsap;
    const timelineSvgPath = document.querySelector(".careers__timeline-path");
    const steps = document.querySelectorAll(".careers__step");

    if (!timelineSvgPath) return;

    const pathLength = timelineSvgPath.getTotalLength ? timelineSvgPath.getTotalLength() : 600;

    // Prepare SVG line for drawing
    gsap.set(timelineSvgPath, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
    });

    // Scrub the path drawing on scroll
    gsap.to(timelineSvgPath, {
      strokeDashoffset: 0,
      ease: "none",
      scrollTrigger: {
        trigger: ".careers__timeline-wrapper",
        start: "top 75%",
        end: "bottom 65%",
        scrub: 0.7,
      },
    });

    // Staggered step highlight cards
    steps.forEach((step, i) => {
      gsap.from(step, {
        opacity: 0.2,
        scale: 0.92,
        duration: 0.6,
        scrollTrigger: {
          trigger: step,
          start: "top 80%",
          toggleActions: "play none none reverse",
          onEnter: () => step.classList.add("careers__step--active"),
          onLeaveBack: () => step.classList.remove("careers__step--active"),
        },
      });
    });
  }

  initPrinciplesInteractions() {
    const gsap = window.gsap;
    const items = document.querySelectorAll(".principles__card");
    if (!items.length) return;

    items.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        // Dim sibling cards
        items.forEach((other) => {
          if (other !== card) {
            gsap.to(other, { opacity: 0.45, duration: 0.35 });
          }
        });
        // Lift active card
        gsap.to(card, {
          y: -8,
          scale: 1.015,
          duration: 0.4,
          ease: "power2.out",
        });
      });

      card.addEventListener("mouseleave", () => {
        // Restore all cards
        items.forEach((c) => {
          gsap.to(c, { opacity: 1, y: 0, scale: 1, duration: 0.35 });
        });
      });
    });
  }

  initMagneticButtons() {
    // Desktop only magnetic pull effect on primary CTA buttons
    const isDesktop = window.matchMedia("(min-width: 1025px)").matches;
    if (!isDesktop) return;

    const magneticBtns = document.querySelectorAll("[data-magnetic]");

    magneticBtns.forEach((btn) => {
      const bound = 28; // max px pull

      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        window.gsap.to(btn, {
          x: (x / (rect.width / 2)) * bound,
          y: (y / (rect.height / 2)) * bound,
          duration: 0.4,
          ease: "power2.out",
        });
      });

      btn.addEventListener("mouseleave", () => {
        window.gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.65,
          ease: "elastic.out(1, 0.4)",
        });
      });
    });
  }

  initCursorFollower() {
    const isDesktop = window.matchMedia("(min-width: 1025px)").matches;
    if (!isDesktop) return;

    const cursorDot = document.querySelector(".cursor-dot");
    const cursorRing = document.querySelector(".cursor-ring");

    if (!cursorDot || !cursorRing) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;

    window.addEventListener(
      "mousemove",
      (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Instant dot position
        cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      },
      { passive: true }
    );

    // Smooth trailing ring loop
    const updateRing = () => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      requestAnimationFrame(updateRing);
    };
    requestAnimationFrame(updateRing);

    // Enlarge ring on interactive elements
    const interactives = document.querySelectorAll(
      "a, button, input, select, textarea, .principles__card"
    );
    interactives.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        cursorRing.classList.add("cursor-ring--expanded");
      });
      el.addEventListener("mouseleave", () => {
        cursorRing.classList.remove("cursor-ring--expanded");
      });
    });
  }

  initScrollProgress() {
    const progressBar = document.querySelector(".scroll-progress-bar");
    if (!progressBar) return;

    window.addEventListener(
      "scroll",
      () => {
        const winScroll =
          document.body.scrollTop || document.documentElement.scrollTop;
        const height =
          document.documentElement.scrollHeight -
          document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + "%";
      },
      { passive: true }
    );
  }

  handleReducedMotion() {
    console.info("✦ Reduced motion active. Standard accessible transitions engaged.");
    // Make sure all animated targets are fully visible
    const selectors = [
      ".hero__tagline",
      ".hero__headline-line",
      ".hero__description",
      ".hero__actions .btn",
      ".hero__visual",
      ".about__story-card",
      ".feedo__logo-frame",
      ".feedo__feature",
      ".careers__step",
    ];

    selectors.forEach((sel) => {
      document.querySelectorAll(sel).forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
    });
  }
}

