import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Asegúrate de importar los estilos

const CustomCarousel = ({ items, renderItem }) => {
  return (
    <div className="max-w-full mx-auto">
      <Carousel
        showThumbs={false}
        showStatus={false}
        showIndicators={false}
        infiniteLoop
        autoPlay
      >
        {items.map((item, index) => (
          <div key={index} className="p-4">
            {renderItem(item)}
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default CustomCarousel;
