// src/AppRouter.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RandomizerPage from './pages/RandomizerPage';
import HuntingPage from './pages/HuntingPage';

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/randomizer" element={<RandomizerPage />} />
        <Route path="/huntingpage" element={<HuntingPage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
