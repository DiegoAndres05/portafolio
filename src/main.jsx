import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./selected-works.css";
import { selectedProjects as projects } from "../data/projects.js";

function FolderCard({ project, open, onToggle }) {
  const detailsId = `project-details-${project.number}`;

  return (
    <article className={`folder-card ${open ? "is-open" : ""}`} id={`project-${project.number}`}>
      <button className="folder-visual" type="button" onClick={onToggle} aria-expanded={open} aria-controls={detailsId} aria-label={`${open ? "Cerrar" : "Abrir"} ${project.name}`}>
        <span className="folder-tab" />
        <span className="folder-back">
          <img src={project.image} alt="" loading="lazy" decoding="async" />
        </span>
        <span className="folder-files" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span className="folder-front">
          <img className="folder-cover" src={project.image} alt={project.imageAlt} loading="lazy" decoding="async" />
          <span className="folder-shade" />
          <span className="folder-label">
            <strong>{project.name}</strong>
            <small>{project.category}</small>
          </span>
          <span className="folder-index">/{project.number}</span>
          <span className="folder-action">{open ? "CLOSE" : "VIEW"} <span>↗</span></span>
        </span>
      </button>
      <div className="folder-details" id={detailsId} aria-hidden={!open}>
        <div className="folder-meta"><span>{project.category}</span><span>{project.meta}</span></div>
        <p>{project.description}</p>
        <div className="folder-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        <a className="folder-link" href={project.href} target="_blank" rel="noreferrer" tabIndex={open ? 0 : -1}>OPEN PROJECT <span>↗</span></a>
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
          <span>{String(visibleProjects.length).padStart(2, "0")} / PROJECTS</span>
          <div role="group" aria-label="Filter projects">
            {filters.map((item) => <button key={item} className={filter === item ? "active" : ""} type="button" aria-pressed={filter === item} onClick={() => { setFilter(item); setOpenProject(null); }}>{item}</button>)}
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
