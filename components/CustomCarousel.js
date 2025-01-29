'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const CustomCarousel = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(1);
  const [isSliding, setIsSliding] = useState(false);

  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerPage(3);
      } else if (window.innerWidth >= 768) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(1);
      }
    };

    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);

    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);

  const handleNext = useCallback(() => {
    if (isSliding) return;
    setIsSliding(true);
    if (currentIndex >= items.length - itemsPerPage) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(currentIndex + itemsPerPage);
    }
  }, [currentIndex, items.length, itemsPerPage, isSliding]);

  const handlePrevious = useCallback(() => {
    if (isSliding) return;
    setIsSliding(true);
    if (currentIndex === 0) {
      setCurrentIndex(items.length - itemsPerPage);
    } else {
      setCurrentIndex(currentIndex - itemsPerPage);
    }
  }, [currentIndex, items.length, itemsPerPage, isSliding]);

  const transformStyle = useMemo(
    () => ({
      transform: `translateX(-${(currentIndex / itemsPerPage) * 100}%)`,
    }),
    [currentIndex, itemsPerPage]
  );

  const handleItemClick = (e) => {
    e.stopPropagation();
  };

  const displayItems = items.length === 1 ? [...items, ...items] : items;

  const paddedItems = [...displayItems];
  while (paddedItems.length % itemsPerPage !== 0) {
    paddedItems.push(
      ...displayItems.slice(
        0,
        itemsPerPage - (paddedItems.length % itemsPerPage)
      )
    );
  }

  return (
    <div className="relative w-full max-w-5xl mx-auto overflow-hidden">
      <div
        className={`flex transition-transform duration-500 ease-in-out`}
        style={transformStyle}
        onTransitionEnd={() => setIsSliding(false)}
      >
        {paddedItems.map((item, index) => (
          <div
            key={index}
            className="flex-shrink-0 p-2"
            style={{ width: `${100 / itemsPerPage}%` }}
            onClick={handleItemClick}
          >
            <Link
              href={`/fields/${item.field_id}`}
              className="block bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow h-full flex flex-col"
            >
              <div className="overflow-hidden rounded-t-lg flex-grow">
                {item.photo_url && item.photo_url.length > 0 ? (
                  <img
                    src={`${API_BASE_URL}/${item.photo_url[0]}`}
                    alt={item.name}
                    className="w-full h-64 object-cover transition-transform duration-300 hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No Image Available</span>
                  </div>
                )}
              </div>
              <CardHeader className="p-4">
                <CardTitle className="text-lg font-bold">{item.name}</CardTitle>
                <CardDescription className="text-gray-600">
                  {item.address}
                </CardDescription>
              </CardHeader>
            </Link>
          </div>
        ))}
      </div>

      {items.length > itemsPerPage && (
        <>
          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow focus:outline-none disabled:opacity-50"
            disabled={isSliding}
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow focus:outline-none disabled:opacity-50"
            disabled={isSliding}
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        </>
      )}
    </div>
  );
};

export default CustomCarousel;
