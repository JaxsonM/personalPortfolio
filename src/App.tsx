import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RandomizerPage from './pages/RandomizerPage';
import SpotifyStats from './pages/SpotifyStats';
import CallbackPage from './pages/CallbackPage';
import SpotifyStatsDemo from './pages/SpotifyStatsDemo';
import MovieAppPage from './pages/MovieApp/MovieAppPage';
import HelloPage from './pages/ApiPractice';
import CitrixScriptPage from './pages/CitrixScriptPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectPage from './pages/ProjectPage';
import NotFoundPage from './pages/NotFoundPage';

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/randomizer" element={<RandomizerPage />} />
        <Route path="/spotifystats" element={<SpotifyStats />} />
        <Route path="/callback" element={<CallbackPage />} />
        <Route path="/spotifystatsdemo" element={<SpotifyStatsDemo />} />
        <Route path="/movieapp" element={<MovieAppPage />} />
        <Route path="/hello" element={<HelloPage />} />
        <Route path="/fixcitrix" element={<CitrixScriptPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:slug" element={<ProjectPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
