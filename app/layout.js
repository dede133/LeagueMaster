// app/layout.js
import '../styles/globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata = {
  title: 'LeagueMaster',
  description: 'Gestion y reservas de campos y ligas de futbol',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          {children}{' '}
          {/* Esto representa el contenido dinámico de cada página */}
        </main>
        <Footer />
      </body>
    </html>
  );
}
