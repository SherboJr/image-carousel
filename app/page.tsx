// src/pages/index.tsx
import ImageCarousel from "./components/ImageCarousel";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <ImageCarousel />
    </div>
  );
};

export default Home;
