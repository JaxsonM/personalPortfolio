import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RandomizerPage from './pages/RandomizerPage';
import HuntingPage from './pages/HuntingPage';
import SpotifyStats from './pages/SpotifyStats';
import CallbackPage from './pages/CallbackPage';
import SpotifyStatsDemo from './pages/SpotifyStatsDemo';
import MovieAppPage from './pages/MovieApp/MovieAppPage';
import HelloPage from './pages/ApiPractice';

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/randomizer" element={<RandomizerPage />} />
        <Route path="/huntingpage" element={<HuntingPage />} />
        <Route path="/spotifystats" element={<SpotifyStats />} />
        <Route path="/callback" element={<CallbackPage />} />
        <Route path="/spotifystatsdemo" element={<SpotifyStatsDemo />} />
        <Route path="/movieapp" element={<MovieAppPage />} />
        <Route path="/hello" element={<HelloPage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
