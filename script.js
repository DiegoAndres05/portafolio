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
    const worksHeading = document.querySelector(".works-heading");
    if (worksHeading) {
      gsap.fromTo(worksHeading.querySelector("h2"), { y: 44, letterSpacing: "-.01em" }, {
        y: 0,
        letterSpacing: "-.05em",
        ease: "power3.out",
        scrollTrigger: { trigger: worksHeading, start: "top 88%", end: "top 42%", scrub: 0.8 },
      });
      gsap.fromTo(worksHeading.querySelector(".technical-label"), { x: -24 }, {
        x: 0,
        ease: "power2.out",
        scrollTrigger: { trigger: worksHeading, start: "top 90%", end: "top 55%", scrub: 0.7 },
      });
    }
    gsap.utils.toArray(".showcase-project").forEach((project) => {
      const image = project.querySelector("img");
      const copy = project.querySelector(".showcase-copy");
      const reverse = project.classList.contains("showcase-reverse");
      const scrollScene = gsap.timeline({
        scrollTrigger: {
          trigger: project,
          start: "top bottom",
          end: "center 42%",
          scrub: 0.85,
        },
      });
      scrollScene.fromTo(project, { y: 70, rotate: reverse ? 1.2 : -1.2 }, {
        y: 0,
        rotate: 0,
        ease: "power2.out",
      }, 0);
      if (copy) {
        scrollScene.fromTo(copy, { x: reverse ? 46 : -46 }, {
          x: 0,
          ease: "power2.out",
        }, 0);
      }
      if (image) {
        scrollScene.fromTo(image, { scale: 1.14 }, {
          scale: 1,
          ease: "power2.out",
        }, 0);
      }
      gsap.fromTo(project.querySelectorAll(".project-meta, h3, .private-badge, p, .tags, .explore-link"), {
        y: 16,
      }, {
        y: 0,
        duration: 0.55,
        stagger: 0.06,
        ease: "power2.out",
        scrollTrigger: { trigger: project, start: "top 82%", once: true },
      });
      if (image) gsap.to(image, {
        yPercent: -3, ease: "none",
        scrollTrigger: { trigger: project, start: "top bottom", end: "bottom top", scrub: true },
      });
      ScrollTrigger.create({
        trigger: project,
        start: "top 62%",
        end: "bottom 38%",
        onToggle: (self) => project.classList.toggle("is-active", self.isActive),
      });
    });

    const hero = document.querySelector(".hero");
    if (hero && window.matchMedia("(pointer: fine)").matches) {
      const moveAside = gsap.quickTo(".hero-aside", "x", { duration: 0.65, ease: "power2.out" });
      const moveAsideY = gsap.quickTo(".hero-aside", "y", { duration: 0.65, ease: "power2.out" });
      const moveTitle = gsap.quickTo(".hero h1", "x", { duration: 0.65, ease: "power2.out" });
      const moveTitleY = gsap.quickTo(".hero h1", "y", { duration: 0.65, ease: "power2.out" });
      hero.addEventListener("mousemove", (event) => {
        const bounds = hero.getBoundingClientRect();
        moveAside(((event.clientX - bounds.left) / bounds.width - 0.5) * 8);
        moveAsideY(((event.clientY - bounds.top) / bounds.height - 0.5) * 5);
        moveTitle(((event.clientX - bounds.left) / bounds.width - 0.5) * 3);
        moveTitleY(((event.clientY - bounds.top) / bounds.height - 0.5) * 2);
      });
      hero.addEventListener("mouseleave", () => gsap.to(".hero-aside, .hero h1", { x: 0, y: 0, duration: 0.7, ease: "power3.out" }));
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
  const projects = [...document.querySelectorAll(".showcase-project")];
  document.querySelectorAll(".filter").forEach((button) => {
    button.setAttribute("aria-pressed", button.classList.contains("active"));
    button.addEventListener("click", () => {
      document.querySelector(".filter.active")?.classList.remove("active");
      button.classList.add("active");
      document.querySelectorAll(".filter").forEach((item) => item.setAttribute("aria-pressed", item === button));
      const filter = button.dataset.filter;
      projects.forEach((project) => {
        const visible = filter === "all" || project.dataset.category === filter;
        project.classList.toggle("hidden", !visible);
        project.setAttribute("aria-hidden", String(!visible));
      });
      if (gsapReady && !prefersReducedMotion) {
        const visible = projects.filter((project) => !project.classList.contains("hidden"));
        gsap.fromTo(visible, { y: 12 }, { y: 0, duration: 0.4, stagger: 0.05, ease: "power2.out", overwrite: "auto" });
        ScrollTrigger.refresh();
      }
    });
  });

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
