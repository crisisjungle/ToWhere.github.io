import React, { useState } from 'react';
import Home from './pages/Home';
import Story from './pages/Story';
import End from './pages/End';
import CityDetail from './pages/CityDetail';
import Globe from './pages/Globe';

export default function App() {
  const [page, setPage] = useState('home');
  const [selectedCity, setSelectedCity] = useState(null);

  const goTo = (p) => setPage(p);

  const goToCity = (cityName) => {
    setSelectedCity(cityName);
    setPage('city');
  };

  const goBackToHome = () => {
    setSelectedCity(null);
    setPage('home');
  };

  const goBackToGlobe = () => {
    setSelectedCity(null);
    setPage('globe');
  };

  return (
    <div style={{ width: '100%', height: '100%', margin: 0, padding: 0 }}>
      {page === 'home' && <Home goTo={goTo} goToCity={goToCity} />}
      {page === 'story' && <Story goTo={goTo} />}
      {page === 'end' && <End goTo={goTo} />}
      {page === 'globe' && <Globe goTo={goTo} goToCity={goToCity} />}
      {page === 'city' && selectedCity && (
        <CityDetail cityName={selectedCity} goBack={goBackToGlobe} />
      )}
    </div>
  );
} 