/**
 * OPLIORA NAVIGATION COMPONENT
 * Transparent glass floating navbar with scroll elevation,
 * section spy, and accessible fullscreen mobile navigation drawer.
 */

export class NavigationComponent {
  constructor() {
    this.nav = document.querySelector(".nav");
    this.hamburger = document.querySelector(".nav__hamburger");
    this.mobileMenu = document.querySelector(".nav__mobile-menu");
    this.mobileLinks = document.querySelectorAll(".nav__mobile-link");
    this.navLinks = document.querySelectorAll(".nav__link");
    this.sections = document.querySelectorAll("section[id]");

    this.init();
  }

  init() {
    if (!this.nav) return;

    // 1. Scroll elevation listener
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (window.scrollY > 40) {
            this.nav.classList.add("nav--scrolled");
          } else {
            this.nav.classList.remove("nav--scrolled");
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // 2. Mobile drawer toggle
    if (this.hamburger && this.mobileMenu) {
      this.hamburger.addEventListener("click", () => {
        const isOpen = this.mobileMenu.classList.contains("nav__mobile-menu--open");
        isOpen ? this.closeMobileMenu() : this.openMobileMenu();
      });

      this.mobileLinks.forEach((link) => {
        link.addEventListener("click", () => this.closeMobileMenu());
      });

      // Escape key to close mobile menu
      window.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && this.mobileMenu.classList.contains("nav__mobile-menu--open")) {
          this.closeMobileMenu();
        }
      });
    }

    // 3. Section spy for active link state
    this.initSectionSpy();
  }

  openMobileMenu() {
    this.hamburger.classList.add("nav__hamburger--active");
    this.hamburger.setAttribute("aria-expanded", "true");
    this.mobileMenu.classList.add("nav__mobile-menu--open");
    document.body.style.overflow = "hidden";
  }

  closeMobileMenu() {
    this.hamburger.classList.remove("nav__hamburger--active");
    this.hamburger.setAttribute("aria-expanded", "false");
    this.mobileMenu.classList.remove("nav__mobile-menu--open");
    document.body.style.overflow = "";
  }

  initSectionSpy() {
    if (!this.sections.length || !this.navLinks.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            this.navLinks.forEach((link) => {
              if (link.getAttribute("href") === `#${id}`) {
                link.classList.add("nav__link--active");
              } else {
                link.classList.remove("nav__link--active");
              }
            });
          }
        });
      },
      {
        threshold: 0.25,
        rootMargin: "-80px 0px -40% 0px",
      }
    );

    this.sections.forEach((sec) => observer.observe(sec));
  }
}

