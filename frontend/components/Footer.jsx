export default function Footer() {
  return (
    <footer className="footer">
      <span>KADHEM SELLAMI</span>
      <span>DEVSECOPS PORTFOLIO · NEXT.JS</span>
      <span>{new Date().getFullYear()}</span>
    </footer>
  );
}