import React from 'react';
import HeroSection from '../components/HeroSection';

interface HomePageProps {
  navigate: (path: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  return (
    <>
      <HeroSection navigate={navigate} />
    </>
  );
};

export default HomePage;
