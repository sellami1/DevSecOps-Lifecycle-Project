import Link from 'next/link';

export default function About({ profile }) {
  const [firstName, ...familyName] = profile.name.split(' ');
  const initials = profile.name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  return (
    <section className="hero section-grid reveal" id="about">
      <div className="hero-main">
        <div className="eyebrow"><span className="status-dot" /> DEVSECOPS · CONTINUOUS LEARNING</div>
        <p className="hero-kicker">{profile.title} · Cloud-Native &amp; Security Automation</p>
        <h1>{firstName}<br /><span>{familyName.join(' ').toUpperCase()}</span></h1>
        <p className="hero-summary">{profile.summary}</p>
        <div className="hero-links">
          <Link className="pill-link" href="/#projects">Explore projects ↓</Link>
          <Link className="pill-link" href="/#contact">Get in touch ↓</Link>
        </div>
      </div>
      <aside className="hero-side">
        <div className="avatar" aria-label={`${profile.name} initials`}>{initials}</div>
        <div className="hero-meta">
          <div><span>Born</span><strong>11 Nov 2001</strong></div>
          <div><span>Education</span><strong>Computer Science</strong></div>
          <div><span>Specialty</span><strong>Information Systems Development</strong></div>
          <div><span>Currently</span><strong>DevOps Master&apos;s Degree</strong></div>
        </div>
        <div className="fact-card"><span className="fact-number">DEV</span><span className="fact-copy">Build repeatable delivery workflows</span></div>
        <div className="fact-card"><span className="fact-number">SEC</span><span className="fact-copy">Bring security into the delivery lifecycle</span></div>
      </aside>
    </section>
  );
}