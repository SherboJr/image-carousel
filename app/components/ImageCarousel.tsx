"use client";
import React, { useState, useEffect } from "react";

interface Photo {
  id: string;
  download_url: string;
  author: string;
}

const ImageCarousel: React.FC = () => {
  const [images, setImages] = useState<Photo[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transitionClass, setTransitionClass] = useState("");

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(
          "https://picsum.photos/v2/list?page=1&limit=5"
        );
        const data = await response.json();
        setImages(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch images");
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const handlePrev = () => {
    setTransitionClass(
      "transition-transform duration-500 transform -translate-x-full"
    );
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  const handleNext = () => {
    setTransitionClass(
      "transition-transform duration-500 transform translate-x-full"
    );
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  useEffect(() => {
    // Reset transition class after the image changes to remove the effect
    const timer = setTimeout(() => {
      setTransitionClass("");
    }, 500);

    return () => clearTimeout(timer);
  }, [currentIndex]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="relative w-full max-w-4xl mx-auto overflow-hidden">
      <button
        onClick={handlePrev}
        className="absolute left-0 top-0 bottom-0 flex items-center justify-center bg-transparent p-2 z-10 w-20"
      >
        {/* */}
      </button>
      <button
        onClick={handleNext}
        className="absolute right-0 top-0 bottom-0 flex items-center justify-center bg-transparent p-2 z-10 w-20"
      >
        {/* */}
      </button>
      <div className="relative w-full">
        <div
          className={`flex transition-transform duration-500 ${transitionClass}`}
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image) => (
            <img
              key={image.id}
              src={image.download_url}
              alt={image.author}
              className="w-full h-auto object-cover"
            />
          ))}
        </div>
      </div>
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
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
