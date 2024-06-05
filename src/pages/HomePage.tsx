// src/pages/HomePage.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Home Page</h1>
      <Link to="/randomizer" className="text-blue-500 hover:underline">
        Go to Randomizer
      </Link>
    </div>
  );
};

export default HomePage;