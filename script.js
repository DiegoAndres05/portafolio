const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const prefersReducedMotion = motionQuery.matches;
const gsapReady = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";

function initFallbackReveals() {
  const revealItems = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("visible"));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => observer.observe(item));
}

function initMotion() {
  if (!gsapReady || prefersReducedMotion) {
    initFallbackReveals();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  gsap.ticker.lagSmoothing(500, 33);
  const context = gsap.context(() => {
    // Keep every content block available; motion only offsets its entrance.
    gsap.set(".reveal", { autoAlpha: 1 });
    const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
    intro
      .from(".site-header", { yPercent: -100, duration: 0.7 })
      .from(".intro-meta > *, .index > *", { y: 14, stagger: 0.05, duration: 0.4 }, "-=0.25")
      .from(".hero .eyebrow, .hero h1, .hero-text, .hero-actions, .hero-aside, .scroll-cue",
        { y: 18, stagger: 0.06, duration: 0.55 }, "-=0.2");

    gsap.to(".scroll-cue i", { y: 5, repeat: -1, yoyo: true, duration: 0.9, ease: "sine.inOut" });
    gsap.to(".hero-aside-label", { opacity: 0.45, repeat: -1, yoyo: true, duration: 1.8, ease: "sine.inOut" });

    gsap.utils.toArray(".works-heading, .project-details, .contact").forEach((section) => {
      gsap.fromTo(section, { y: 30 }, {
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 84%", once: true },
      });
    });
    const hero = document.querySelector(".hero");
    if (hero && window.matchMedia("(pointer: fine)").matches) {
      const moveAside = gsap.quickTo(".hero-aside", "x", { duration: 0.65, ease: "power2.out" });
      const moveTitle = gsap.quickTo(".hero h1", "x", { duration: 0.65, ease: "power2.out" });
      let bounds = hero.getBoundingClientRect();
      hero.addEventListener("mousemove", (event) => {
        moveAside(((event.clientX - bounds.left) / bounds.width - 0.5) * 8);
        moveTitle(((event.clientX - bounds.left) / bounds.width - 0.5) * 3);
      });
      window.addEventListener("resize", () => { bounds = hero.getBoundingClientRect(); }, { passive: true });
      hero.addEventListener("mouseleave", () => gsap.to(".hero-aside, .hero h1", { x: 0, duration: 0.7, ease: "power3.out" }));
    }

    ScrollTrigger.create({
      start: "top -40px", end: 99999,
      onEnter: () => gsap.to(".site-header", { backgroundColor: "rgba(10,10,10,.94)", duration: 0.3 }),
      onLeaveBack: () => gsap.to(".site-header", { backgroundColor: "rgba(10,10,10,.78)", duration: 0.3 }),
    });
    window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
  });
  window.addEventListener("pagehide", () => context.revert(), { once: true });
}

function initInteractions() {
  document.querySelector("form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const message = form.querySelector(".form-message");
    message.textContent = "RECIBIDO. TE ESCRIBO EN MENOS DE 24 HORAS.";
    form.reset();
    if (gsapReady && !prefersReducedMotion) gsap.fromTo(message, { y: 8 }, { y: 0, duration: 0.4, ease: "power2.out" });
  });

  const menuButton = document.querySelector(".menu-button");
  const nav = document.querySelector(".main-nav");
  if (nav && !menuButton) nav.setAttribute("aria-hidden", "false");
  menuButton?.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("mobile-open");
    nav.setAttribute("aria-hidden", String(!isOpen));
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
    if (gsapReady && !prefersReducedMotion && isOpen) {
      gsap.fromTo(nav.querySelectorAll("a"), { x: -12 }, { x: 0, duration: 0.3, stagger: 0.06, ease: "power2.out" });
    }
  });
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
      if (nav?.classList.contains("mobile-open")) menuButton.click();
    });
  });
}

initMotion();
initInteractions();
