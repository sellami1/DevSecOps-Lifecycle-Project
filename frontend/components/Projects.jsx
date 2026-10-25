import Link from 'next/link';

export default function Projects({ projects, standalone = false }) {
  return (
    <section className={`section section-grid reveal${standalone ? ' projects-page' : ''}`} id={standalone ? 'project-list' : 'projects'}>
      <div className="section-label">
        <span className="section-number">02</span>
        <h2>DevSecOps Projects</h2>
        {standalone && <p className="section-intro">Selected work across delivery automation, GitOps, and repeatable infrastructure.</p>}
      </div>
      <div className="section-body project-grid">
        {projects.map((project, index) => (
          <article className={`project-card${index === 0 ? ' featured' : ''}`} key={project.id}>
            <div className="project-top"><span>{project.category}</span><span>LAB / 0{index + 1}</span></div>
            <div className="project-content">
              <h3>{project.name}</h3>
              <p>{project.description}</p>
            </div>
            <div className="project-bottom">
              {project.stack.map((tool) => <span key={tool}>{tool}</span>)}
              <Link className="project-link" href={`/projects/${project.id}`}>View project <span aria-hidden="true">↗</span></Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}