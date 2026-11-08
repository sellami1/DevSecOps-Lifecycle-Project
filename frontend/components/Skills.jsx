const skillsDescription =
  'Version control, CI/CD, containers, orchestration, configuration management, infrastructure as code, and GitOps.';

export default function Skills({ skillGroups }) {
  const skills = skillGroups.flatMap(({ items }) => items);

  return (
    <section className="section section-grid reveal" id="skills">
      <div className="section-label"><span className="section-number">04</span><h2>DevSecOps Skills</h2></div>
      <div className="section-body skills-layout">
        <div className="skill-cloud">
          {skills.map((skill) => <span className="skill" key={skill}>{skill}</span>)}
        </div>
        <div className="skill-note"><span className="mono">TOOLKIT</span><p>{skillsDescription}</p></div>
      </div>
    </section>
  );
}