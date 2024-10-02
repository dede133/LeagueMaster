import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';

const CustomCarousel = ({ items, renderItem }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(false);

  useEffect(() => {
    if (isSliding) {
      const timer = setTimeout(() => {
        setIsSliding(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isSliding]);

  const handleNext = () => {
    setIsSliding(true);
    if (currentIndex === items.length - 1) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    setIsSliding(true);
    if (currentIndex === 0) {
      setCurrentIndex(items.length - 1);
    } else {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <Carousel className="w-full max-w-2xl mx-auto overflow-hidden">
      <CarouselContent
        className={`flex transition-transform duration-500 ease-in-out ${
          isSliding ? 'transform' : ''
        }`}
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {items.map((item, index) => (
          <CarouselItem key={index} className="flex-shrink-0 w-full">
            <div className="p-2">
              <Card className="w-full border-none shadow-none">
                <CardContent className="flex flex-col items-center justify-center p-4">
                  {renderItem(item)}
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* Mostrar flechas solo si hay más de una imagen */}
      {items.length > 1 && (
        <>
          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        </>
      )}
    </Carousel>
  );
};

export default CustomCarousel;
