// src/pages/_app.js
import '../styles/globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

function MyApp({ Component, pageProps }) {
  return (
    <>
      {/* Header estará presente en todas las páginas */}
      <Header />

      {/* Renderiza el componente de la página actual */}
      <Component {...pageProps} />

      {/* Renderiza el componente de la página actual */}
      <Footer />
    </>
  );
}

export default MyApp;
