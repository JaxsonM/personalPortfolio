import React from 'react';
import { Link } from 'react-router-dom';
import PageShell from '../components/PageShell';

const NotFoundPage: React.FC = () => (
  <PageShell>
    <section className="max-w-2xl mx-auto px-6 py-32 text-center">
      <p className="text-sm font-medium text-blue-600 uppercase tracking-widest mb-3">404</p>
      <h1 className="text-4xl font-bold mb-4">Page not found</h1>
      <p className="text-gray-500 mb-10">The page you're looking for doesn't exist or has moved.</p>
      <div className="flex justify-center flex-wrap gap-4">
        <Link to="/" className="bg-gray-900 text-white px-7 py-3 rounded-full text-sm font-medium hover:bg-gray-700 transition-colors">
          Back to home
        </Link>
        <Link to="/#projects" className="border border-gray-300 text-gray-700 px-7 py-3 rounded-full text-sm font-medium hover:border-gray-500 transition-colors">
          View projects
        </Link>
      </div>
    </section>
  </PageShell>
);

export default NotFoundPage;
