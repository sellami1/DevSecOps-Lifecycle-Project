import './globals.css';
import Footer from '../components/Footer';
import Header from '../components/Header';
import ProgressBar from '../components/ProgressBar';

export const metadata = {
  title: 'Kadhem Sellami — DevSecOps Portfolio',
  description: 'Kadhem Sellami\'s DevSecOps portfolio, skills, projects, and education.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ProgressBar />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}