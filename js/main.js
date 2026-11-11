/**
 * OPLIORA PRIVATE LIMITED — Application Main Entry Point
 * Coordinates WebGL Scene, Motion System, Interactive Components,
 * and Lucide iconography.
 */

import { CONFIG } from "./config.js";
import { Hero3DScene } from "./hero-3d.js";
import { MotionEngine } from "./motion.js";
import { NavigationComponent } from "./components/nav.js";
import { ContactComponent } from "./components/contact.js";

class OplioraApp {
  constructor() {
    this.config = CONFIG;
    this.heroScene = null;
    this.motion = null;
    this.nav = null;
    this.contact = null;

    this.init();
  }

  init() {
    // 1. Render Lucide Icons
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }

    // 2. Initialize Navigation Component
    this.nav = new NavigationComponent();

    // 3. Initialize Contact Component
    this.contact = new ContactComponent();

    // 4. Initialize Three.js Hero WebGL Composition
    const heroCanvasContainer = document.querySelector("#heroCanvasContainer");
    const heroSvgFallback = document.querySelector("#heroSvgFallback");

    if (heroCanvasContainer) {
      this.heroScene = new Hero3DScene(heroCanvasContainer, heroSvgFallback);
    }

    // 5. Initialize GSAP Motion & Lenis Scroll Engine
    this.motion = new MotionEngine();

    // 6. Setup Back-to-Top Interaction
    this.initBackToTop();

    // 7. Accessible Marquee Pause on Focus
    this.initMarqueeAccessibility();

    // 8. Console Brand Signature
    console.log(
      `%c✦ ${this.config.company.name} %c— A Group of Businesses. One Vision.`,
      "color:#20C4E4; font-weight:800; font-size:13px;",
      "color:#67E6AE; font-size:12px;"
    );
  }

  initBackToTop() {
    const btn = document.querySelector("#backToTop");
    if (!btn) return;

    window.addEventListener(
      "scroll",
      () => {
        if (window.scrollY > 450) {
          btn.classList.add("back-to-top--visible");
        } else {
          btn.classList.remove("back-to-top--visible");
        }
      },
      { passive: true }
    );

    btn.addEventListener("click", () => {
      if (this.motion && this.motion.lenis) {
        this.motion.lenis.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }

  initMarqueeAccessibility() {
    const marquee = document.querySelector(".marquee__track");
    if (!marquee) return;

    marquee.addEventListener("focusin", () => {
      marquee.style.animationPlayState = "paused";
    });
    marquee.addEventListener("focusout", () => {
      marquee.style.animationPlayState = "running";
    });
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => new OplioraApp());
} else {
  new OplioraApp();
}

