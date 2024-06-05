// src/AppRouter.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RandomizerPage from './pages/RandomizerPage';

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/randomizer" element={<RandomizerPage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
