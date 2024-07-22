"use client";
import React, { useState, useEffect, useRef } from "react";
import CarouselItem from "./CarouselItem";
import LoadingIndicator from "./LoadingIndicator";

interface Photo {
  id: string;
  download_url: string;
  author: string;
}

interface CaptionedPhoto {
  image: string;
  caption: string;
}

const ImageCarousel: React.FC = () => {
  const [items, setItems] = useState<CaptionedPhoto[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transitionClass, setTransitionClass] = useState("");
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        // Fetch images
        const imagesResponse = await fetch(
          "https://picsum.photos/v2/list?page=1&limit=8"
        );
        const imagesData: Photo[] = await imagesResponse.json();

        // Fetch captions
        const captionsResponse = await fetch(
          "https://jsonplaceholder.typicode.com/posts?_limit=8"
        );
        const captionsData = await captionsResponse.json();

        // Combine images with captions
        const items = imagesData.map((image, index) => ({
          image: image.download_url,
          caption: captionsData[index]?.title || "No caption available"
        }));

        setItems(items);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data");
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const resetAutoScroll = () => {
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
    }
    autoScrollRef.current = setInterval(handleNext, 4000);
  };

  const handlePrev = () => {
    setTransitionClass(
      "transition-transform duration-500 transform -translate-x-full"
    );
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + items.length) % items.length
    );
    resetAutoScroll();
  };

  const handleNext = () => {
    setTransitionClass(
      "transition-transform duration-500 transform translate-x-full"
    );
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    resetAutoScroll();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setTransitionClass("");
    }, 500);

    return () => clearTimeout(timer);
  }, [currentIndex]);

  useEffect(() => {
    autoScrollRef.current = setInterval(handleNext, 4000);

    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    };
  }, [items]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (loading) return <LoadingIndicator />;
  if (error) return <p>{error}</p>;

  return (
    <div
      className="relative w-full max-w-4xl mx-auto overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <button
        onClick={handlePrev}
        className="absolute left-0 top-0 bottom-0 flex items-center justify-center bg-transparent p-2 z-10 w-20"
      >
        {/* Previous Button Icon */}
      </button>
      <button
        onClick={handleNext}
        className="absolute right-0 top-0 bottom-0 flex items-center justify-center bg-transparent p-2 z-10 w-20"
      >
        {/* Next Button Icon */}
      </button>
      <div className="relative w-full">
        <div
          className={`flex w-full transition-transform duration-500 ${transitionClass}`}
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {items.map((item, index) => (
            <CarouselItem
              key={index}
              image={item.image}
              caption={item.caption}
            />
          ))}
        </div>
      </div>
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {items.map((_, index) => (
          <span
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === currentIndex ? "bg-blue-500" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
