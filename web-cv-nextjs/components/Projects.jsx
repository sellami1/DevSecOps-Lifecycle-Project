import Link from 'next/link';
import { projects } from '../data/projects';

export default function Projects({ standalone = false }) {
  return (
    <section className={`section section-grid reveal${standalone ? ' projects-page' : ''}`} id={standalone ? 'project-list' : 'projects'}>
      <div className="section-label">
        <span className="section-number">02</span>
        <h2>DevSecOps Projects</h2>
        {standalone && <p className="section-intro">Selected work across delivery automation, GitOps, and repeatable infrastructure.</p>}
      </div>
      <div className="section-body project-grid">
        {projects.map((project, index) => (
          <article className={`project-card${index === 0 ? ' featured' : ''}`} key={project.slug}>
            <div className="project-top"><span>{project.category}</span><span>LAB / 0{index + 1}</span></div>
            <div className="project-content">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
            </div>
            <div className="project-bottom">
              {project.tools.map((tool) => <span key={tool}>{tool}</span>)}
              <Link className="project-link" href={`/projects/${project.slug}`}>View project <span aria-hidden="true">↗</span></Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}