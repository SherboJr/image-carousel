import React from "react";

interface CarouselItemProps {
  image: string;
  caption: string;
}

const CarouselItem: React.FC<CarouselItemProps> = ({ image, caption }) => {
  return (
    <div className="flex-shrink-0 w-full relative">
      <img src={image} alt={caption} className="w-full h-auto object-cover" />
      <div className="absolute bottom-10 left-0 w-full bg-black bg-opacity-50 text-white text-center p-2">
        {caption}
      </div>
    </div>
  );
};

export default CarouselItem;
