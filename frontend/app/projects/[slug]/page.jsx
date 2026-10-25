import Link from 'next/link';
import { notFound } from 'next/navigation';
import { projects } from '../../../data/projects';

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  return { title: project ? `${project.title} — Kadhem Sellami` : 'Project not found' };
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();

  return (
    <article className="project-detail">
      <Link className="text-link" href="/projects">← All projects</Link>
      <div className="detail-heading">
        <span className="mono">{project.category}</span>
        <h1>{project.title}<span>.</span></h1>
        <p>{project.description}</p>
      </div>
      <div className="detail-grid">
        <section className="detail-copy">
          <span className="mono">OVERVIEW</span>
          <h2>From source to reliable delivery.</h2>
          <p>{project.detail}</p>
        </section>
        <aside className="detail-aside">
          <span className="mono">TOOLKIT</span>
          <div className="detail-tools">{project.tools.map((tool) => <span key={tool}>{tool}</span>)}</div>
          <span className="mono outcome-label">OUTCOME</span>
          <p>{project.outcome}</p>
        </aside>
      </div>
      <nav className="detail-pagination" aria-label="Project navigation">
        {projects.filter((item) => item.slug !== project.slug).map((item) => (
          <Link className="text-link" href={`/projects/${item.slug}`} key={item.slug}>{item.title} <span aria-hidden="true">↗</span></Link>
        ))}
      </nav>
    </article>
  );
}