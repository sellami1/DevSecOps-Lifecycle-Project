export default function Experience() {
  return (
    <section className="section section-grid reveal" id="experience">
      <div className="section-label"><span className="section-number">01</span><h2>Experience</h2></div>
      <div className="section-body timeline">
        <article className="timeline-item">
          <div className="timeline-date">CURRENT</div>
          <div>
            <h3>DevOps Master&apos;s Degree</h3>
            <p className="role">Graduate studies · DevOps</p>
            <p>Developing practical expertise in automation, container platforms, infrastructure as code, and secure software delivery.</p>
            <div className="tags"><span>CI/CD</span><span>Cloud Native</span><span>DevSecOps</span></div>
          </div>
        </article>
        <article className="timeline-item">
          <div className="timeline-date">FOUNDATION</div>
          <div>
            <h3>Computer Science · Information Systems Development</h3>
            <p className="role">Academic background</p>
            <p>Built a foundation in software and information systems, now extending that work into reliable and secure infrastructure.</p>
            <div className="tags"><span>Computer Science</span><span>Information Systems</span><span>Development</span></div>
          </div>
        </article>
      </div>
    </section>
  );
}