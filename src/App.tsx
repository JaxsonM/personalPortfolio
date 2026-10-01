import React from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SpotifyStats from './pages/SpotifyStats';
import CallbackPage from './pages/CallbackPage';
import SpotifyStatsDemo from './pages/SpotifyStatsDemo';
import ProjectPage from './pages/ProjectPage';
import NotFoundPage from './pages/NotFoundPage';

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/spotifystats" element={<SpotifyStats />} />
        <Route path="/callback" element={<CallbackPage />} />
        <Route path="/spotifystatsdemo" element={<SpotifyStatsDemo />} />
        {/* The old all-projects page now lives on the homepage; keep old links working. */}
        <Route path="/projects" element={<Navigate to="/#projects" replace />} />
        <Route path="/projects/:slug" element={<ProjectPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
