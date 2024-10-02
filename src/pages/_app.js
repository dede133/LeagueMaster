// src/pages/_app.js
import '../styles/globals.css';
import { Theme } from '@radix-ui/themes';
import Header from '../components/Header';
import Footer from '../components/Footer';

function MyApp({ Component, pageProps }) {
  return (
    <Theme>
      <div className="flex flex-col min-h-screen">
        {/* Header estará presente en todas las páginas */}
        <Header />

        {/* El contenido de la página debe crecer para llenar el espacio disponible */}
        <main className="flex-1">
          <Component {...pageProps} />
        </main>

        {/* El footer siempre se mantiene en la parte inferior */}
        <Footer />
      </div>
    </Theme>
  );
}

export default MyApp;
