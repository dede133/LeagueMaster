import '../styles/globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { AuthProvider } from '../context/AuthContext';
import { LeagueProvider } from '../context/LeagueContext';

export const metadata = {
  title: 'LeagueMaster',
  description: 'Gestión y reservas de campos y ligas de fútbol',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="flex flex-col min-h-screen">
        <AuthProvider>
          <LeagueProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </LeagueProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
