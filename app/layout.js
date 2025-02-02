'use client';
import '../styles/globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { AuthProvider } from '../context/AuthContext';
import { LeagueProvider } from '../context/LeagueContext';
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isMatchStatsPage = pathname.includes('matches'); // Ahora detecta si la URL contiene 'matches' en cualquier parte.

  return (
    <html lang="es">
      <body className="flex flex-col min-h-screen">
        <AuthProvider>
          <LeagueProvider>
            {!isMatchStatsPage && <Header />}
            <main className="flex-1">{children}</main>
            {!isMatchStatsPage && <Footer />}
          </LeagueProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
