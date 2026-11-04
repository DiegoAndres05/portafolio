import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./selected-works.css";
import masajistaImage from "../assets/masajista-colombiana-showcase.png";
import runnetImage from "../public/images/projects/runnet/cover.svg";
import grastoreImage from "../public/images/projects/grastore/gallery/overview.png";

const projects = [
  {
    number: "01",
    name: "Football Jersey Store",
    category: "FULL STACK / E-COMMERCE",
    meta: "2025",
    image: "https://xmsreelwxwqjzgtkxcje.supabase.co/storage/v1/object/public/product-images/products/cmvj4q9ax001d13ayz6r3ifrv/brasil-retro-98-1792649154021-0.webp",
    description: "Plataforma de gestión comercial y deportiva para Flashsports.",
    tags: ["E-Commerce", "Payments", "Fulfillment"],
    href: "https://www.flashsports.shop/"
  },
  {
    number: "02",
    name: "Cartagena Tailored Travel",
    category: "WEB DEVELOPMENT / TRAVEL",
    meta: "2025",
    image: "https://tfjicnbkytsfkykauqpf.supabase.co/storage/v1/object/public/images/hero-og.jpeg",
    description: "Experiencias turísticas personalizadas, hospedajes, islas, yates y reservas.",
    tags: ["Web Design", "Booking UX", "Travel"],
    href: "https://www.cartagenatailoredtravel.com/"
  },
  {
    number: "03",
    name: "Masajista Colombiana",
    category: "WEB DEVELOPMENT / WELLNESS",
    meta: "2025",
    image: masajistaImage,
    description: "Experiencia digital para terapias profesionales, bienestar y viajes energéticos.",
    tags: ["Web Design", "Content System", "WhatsApp UX"],
    href: "https://www.masajistacolombiana.com/"
  },
  {
    number: "04",
    name: "RUNNET",
    category: "WEB DEVELOPMENT / LOGISTICS",
    meta: "LIVE",
    image: runnetImage,
    description: "Muestra web para una empresa de mensajería enfocada en nuevos clientes.",
    tags: ["Web Development", "Logistics"],
    href: "https://www.runnet.com.co/"
  },
  {
    number: "05",
    name: "GRASTORE",
    category: "INTERNAL WEB APPLICATION",
    meta: "PRIVATE",
    image: grastoreImage,
    description: "Aplicación web interna para operación comercial y punto de venta.",
    tags: ["Private Project", "Operations"],
    href: "projects/grastore/index.html"
  }
];

function FolderCard({ project, open, onToggle }) {
  return (
    <article className={`folder-card ${open ? "is-open" : ""}`}>
      <button className="folder-visual" type="button" onClick={onToggle} aria-expanded={open} aria-label={`${open ? "Cerrar" : "Abrir"} ${project.name}`}>
        <span className="folder-tab" />
        <span className="folder-back">
          <img src={project.image} alt="" />
        </span>
        <span className="folder-files" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span className="folder-front">
          <span className="folder-label">
            <strong>{project.name}</strong>
            <small>{project.category}</small>
          </span>
          <span className="folder-index">/{project.number}</span>
        </span>
      </button>
      <div className="folder-details">
        <div className="folder-meta"><span>{project.category}</span><span>{project.meta}</span></div>
        <p>{project.description}</p>
        <div className="folder-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        <a className="folder-link" href={project.href} target="_blank" rel="noreferrer">OPEN PROJECT <span>↗</span></a>
      </div>
    </article>
  );
}

function SelectedWorks() {
  const [openProject, setOpenProject] = useState(null);
  const [filter, setFilter] = useState("ALL");
  const filters = ["ALL", "FULL STACK", "WEB", "PRIVATE"];
  const visibleProjects = projects.filter((project) => {
    if (filter === "ALL") return true;
    if (filter === "WEB") return project.category.startsWith("WEB");
    if (filter === "PRIVATE") return project.meta === "PRIVATE";
    return project.category.startsWith(filter);
  });

  return (
    <section className="react-works" aria-labelledby="selected-works-title">
      <div className="react-works-heading">
        <div>
          <span className="react-technical-label">[ 01 — SELECTED PROJECTS ]</span>
          <h2 id="selected-works-title">Selected <em>Works.</em></h2>
          <p>Hover to lean · Click to open · Explore to visit</p>
        </div>
        <div className="react-works-controls">
          <span>05 / PROJECTS</span>
          <div role="group" aria-label="Filter projects">
            {filters.map((item) => <button key={item} className={filter === item ? "active" : ""} type="button" onClick={() => setFilter(item)}>{item}</button>)}
          </div>
        </div>
      </div>
      <div className="folder-grid">
        {visibleProjects.map((project) => <FolderCard key={project.number} project={project} open={openProject === project.number} onToggle={() => setOpenProject(openProject === project.number ? null : project.number)} />)}
      </div>
    </section>
  );
}

const root = document.getElementById("selected-works-root");
if (root) createRoot(root).render(<SelectedWorks />);
