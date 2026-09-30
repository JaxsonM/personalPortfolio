import React from 'react';

const SiteFooter: React.FC = () => (
  <footer className="bg-gray-50 border-t border-gray-100 py-6">
    <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400 gap-2">
      <span>&copy; {new Date().getFullYear()} Jaxson Madison</span>
      <span>Built with React · Hosted on AWS Amplify</span>
    </div>
  </footer>
);

export default SiteFooter;
