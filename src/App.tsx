// src/AppRouter.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RandomizerPage from './pages/RandomizerPage';
import HuntingPage from './pages/HuntingPage';
import SpotifyStats from './pages/SpotifyStats';
import CallbackPage from './pages/CallbackPage';

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/randomizer" element={<RandomizerPage />} />
        <Route path="/huntingpage" element={<HuntingPage />} />
        <Route path="/spotifystats" element={<SpotifyStats />} />
        <Route path="/callback" element={<CallbackPage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
