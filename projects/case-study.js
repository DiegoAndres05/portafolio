const project = window.privateProject;
const root = document.querySelector("[data-case-study]");
const emptyMessage = "Información pendiente de completar.";
const isPrivateProject = project?.status === "PRIVATE";
const projectVisibilityLabel = isPrivateProject ? "PRIVATE PROJECT" : "PUBLIC SHOWCASE";

function textOrEmpty(value) {
  return value || emptyMessage;
}

function listOrEmpty(values) {
  return values?.length ? values.map((value) => `<li>${value}</li>`).join("") : `<li>${emptyMessage}</li>`;
}

function optionalLink(url, label) {
  return url ? `<a class="explore-link" href="${url}" target="_blank" rel="noreferrer">${label} ↗</a>` : "";
}

function renderCaseStudy() {
  if (!project || !root) return;
  const galleryCategories = [...new Set(project.gallery.map((item) => item.category).filter(Boolean))];
  const galleryTabs = galleryCategories.length
    ? `<button class="gallery-tab active" data-gallery-filter="all">ALL</button>${galleryCategories.map((category) => `<button class="gallery-tab" data-gallery-filter="${category}">${category}</button>`).join("")}`
    : "";
  document.title = `${project.name} / ${projectVisibilityLabel} — DIEGO BARRIOS`;
  document.querySelector('meta[name="description"]').setAttribute("content", `${project.name} — ${projectVisibilityLabel.toLowerCase()} by Diego Barrios.`);
  root.innerHTML = `
    <header class="site-header">
      <a class="brand" href="../../index.html#inicio" aria-label="Diego Barrios, inicio"><strong>DIEGO BARRIOS</strong><span>/</span><em>PORTFOLIO</em></a>
      <nav class="main-nav" aria-label="Navegación principal"><a class="active" href="../../index.html#proyectos">WORKS</a><a href="../../index.html#project-details">DETAILS</a><a href="../../index.html#contacto">CONTACTO</a></nav>
      <div class="availability"><i></i><span>${isPrivateProject ? "PRIVATE PROJECTS" : "PUBLIC SHOWCASE"}</span><b>/ ${project.number}</b></div>
    </header>
    <main class="case-main">
      <section class="case-header shell">
        <div><a class="case-back" href="../../index.html#proyectos">← BACK TO SELECTED WORKS</a><span class="technical-label">[ ${project.number} — ${project.category} ]</span><h1 class="case-title">${project.name}</h1><p class="case-description">${textOrEmpty(project.description)}</p></div>
        <div class="case-meta"><div class="case-meta-row"><span>STATUS</span><strong class="${isPrivateProject ? "private-label" : "public-label"}">${projectVisibilityLabel}</strong></div><div class="case-meta-row"><span>TYPE</span><strong>${project.type}</strong></div><div class="case-meta-row"><span>SLUG</span><strong>/${project.slug}</strong></div></div>
      </section>
      <section class="case-hero shell"><img src="${project.cover}" alt="${project.name} application screenshot placeholder" /><span class="capture-pending">CAPTURE PENDING / REPLACE WITH REAL SCREENSHOT</span></section>
      <section class="case-section shell"><div class="case-section-heading"><span class="technical-label">[ 01 — PROJECT OVERVIEW ]</span><h2>Context before<br /><em>assumptions.</em></h2></div><div class="case-overview"><span></span><div class="case-copy"><div><h3>Context & objective</h3><p>${textOrEmpty(project.description)}</p></div><div><h3>Contribution</h3><p>${textOrEmpty(project.contribution)}</p></div></div></div></section>
      <section class="case-section shell"><div class="case-section-heading"><span class="technical-label">[ 02 — INTERFACE GALLERY ]</span><h2>Real screens,<br /><em>when available.</em></h2></div><div class="gallery-tabs">${galleryTabs}</div><div class="gallery-grid">${project.gallery.length ? project.gallery.map((item, index) => `<button type="button" class="gallery-item" data-gallery-category="${item.category || "overview"}" data-lightbox="${item.src}" data-caption="${item.caption || project.name}"><img loading="lazy" decoding="async" src="${item.src}" alt="${item.alt || project.name + " screenshot"}" /><span class="gallery-label">[ ${String(index + 1).padStart(2, "0")} ] ${item.category || "OVERVIEW"}</span></button>`).join("") : `<div class="gallery-empty"><span class="technical-label">CAPTURES PENDING</span><p>Add real screenshots to the project gallery directory and update its data entry.</p></div>`}</div></section>
      <section class="case-section shell"><div class="case-section-heading"><span class="technical-label">[ 03 — DEVELOPMENT CONTRIBUTION ]</span><h2>What was<br /><em>built.</em></h2></div><div class="case-data-grid"><div class="data-block"><h3>Functionalities</h3><ul class="data-list">${listOrEmpty(project.functionalities)}</ul></div><div class="data-block"><h3>Technical challenges</h3><p>${textOrEmpty(project.challenges)}</p></div></div></section>
      <section class="case-section shell"><div class="case-section-heading"><span class="technical-label">[ 04 — TECHNOLOGY STACK ]</span><h2>Tools remain<br /><em>specific.</em></h2></div><div class="case-data-grid"><div class="data-block"><h3>Technologies</h3><ul class="data-list">${listOrEmpty(project.technologies)}</ul></div><div class="data-block"><h3>Available links</h3>${optionalLink(project.demoUrl, "VIEW LIVE")} ${optionalLink(project.githubUrl, "VIEW GITHUB") || `<p>${emptyMessage}</p>`}</div></div></section>
      <nav class="case-nav shell" aria-label="Navegación de caso"><a href="../../index.html#proyectos">← ALL PROJECTS</a><a href="${project.slug === "runnet" ? "../grastore/index.html" : "../runnet/index.html"}">NEXT CASE STUDY ↗</a></nav>
    </main>
    <footer class="site-footer shell"><div><strong>DIEGO BARRIOS</strong><span>/ PORTFOLIO</span></div><div class="footer-links"><a href="../../index.html#proyectos">SELECTED WORKS ↗</a><a href="mailto:hola@diegobarrios.dev">EMAIL ↗</a></div><small>© 2025 DIEGO BARRIOS / ${projectVisibilityLabel} <a href="../../index.html#inicio">↑ TOP</a></small></footer>
    <div class="lightbox" role="dialog" aria-modal="true" aria-hidden="true" aria-label="Image preview"><button type="button" class="lightbox-close" aria-label="Close image preview">×</button><button type="button" class="lightbox-prev" aria-label="Previous image">←</button><img alt="" /><button type="button" class="lightbox-next" aria-label="Next image">→</button><span class="lightbox-caption"></span></div>
  `;
  initCaseStudy();
}

function initCaseStudy() {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGsap = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";
  const lightbox = document.querySelector(".lightbox");
  const lightboxImage = lightbox.querySelector("img");
  const items = [...document.querySelectorAll("[data-lightbox]")];
  let currentIndex = 0;
  let lastFocused = null;
  const closeLightbox = () => {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");
    lastFocused?.focus();
  };
  const showImage = (index) => {
    if (!items.length) return;
    currentIndex = (index + items.length) % items.length;
    const item = items[currentIndex];
    lightboxImage.src = item.dataset.lightbox;
    lightboxImage.alt = item.dataset.caption;
    lightbox.querySelector(".lightbox-caption").textContent = item.dataset.caption;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
    lightbox.querySelector(".lightbox-close").focus();
  };
  items.forEach((item, index) => item.addEventListener("click", () => {
    lastFocused = document.activeElement;
    showImage(index);
  }));
  lightbox.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
  lightbox.querySelector(".lightbox-prev").addEventListener("click", () => showImage(currentIndex - 1));
  lightbox.querySelector(".lightbox-next").addEventListener("click", () => showImage(currentIndex + 1));
  lightbox.addEventListener("click", (event) => { if (event.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("open")) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") showImage(currentIndex - 1);
    if (event.key === "ArrowRight") showImage(currentIndex + 1);
    if (event.key === "Tab") {
      const controls = [...lightbox.querySelectorAll("button")];
      if (controls.length && (event.shiftKey && document.activeElement === controls[0] || !event.shiftKey && document.activeElement === controls.at(-1))) {
        event.preventDefault();
        (event.shiftKey ? controls.at(-1) : controls[0]).focus();
      }
    }
  });
  document.querySelectorAll(".gallery-tab").forEach((tab) => tab.addEventListener("click", () => {
    document.querySelector(".gallery-tab.active")?.classList.remove("active");
    tab.classList.add("active");
    const filter = tab.dataset.galleryFilter;
    document.querySelectorAll(".gallery-item").forEach((item) => { item.hidden = filter !== "all" && item.dataset.galleryCategory !== filter; });
  }));

  if (hasGsap && !reducedMotion) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray(".case-hero img, .gallery-item img").forEach((image, index) => {
      gsap.fromTo(image,
        { scale: 1.04, y: 18 },
        {
          scale: 1,
          y: 0,
          duration: 1,
          delay: Math.min(index * 0.06, 0.24),
          ease: "power3.out",
          scrollTrigger: { trigger: image, start: "top 88%", once: true },
        },
      );
      gsap.to(image, {
        yPercent: -3,
        ease: "none",
        scrollTrigger: { trigger: image, start: "top bottom", end: "bottom top", scrub: true },
      });
    });

    document.querySelectorAll(".gallery-item, .case-hero").forEach((frame) => {
      const image = frame.querySelector("img");
      if (!image) return;
      frame.addEventListener("mouseenter", () => gsap.to(image, { scale: 1.025, duration: 0.55, ease: "power3.out", overwrite: true }));
      frame.addEventListener("mouseleave", () => gsap.to(image, { scale: 1, duration: 0.65, ease: "power3.out", overwrite: true }));
    });
    window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
  }
}

renderCaseStudy();
