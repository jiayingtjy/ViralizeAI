import LandingHero from '@/components/LandingHero';
import LandingNavbar from '@/components/landing-navbar';
import React from 'react';

const LandingPage = () => {
  return (
    <div className="h-full">
      <LandingNavbar />
      <LandingHero/>
    </div>
  );
};

export default LandingPage;
